-- Extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Membres
CREATE TABLE IF NOT EXISTS tenant_members (
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  PRIMARY KEY (tenant_id, user_id)
);

-- Sources (fichiers uploadés)
CREATE TABLE IF NOT EXISTS kb_sources (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  object_path TEXT NOT NULL,
  original_name TEXT,
  mime_type TEXT,
  status TEXT DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Chunks vecteurs
CREATE TABLE IF NOT EXISTS kb_chunks (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  source_id BIGINT REFERENCES kb_sources(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  lang TEXT DEFAULT 'fr',
  tags TEXT[],
  content_sha256 TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS kb_chunks_tenant_idx ON kb_chunks (tenant_id);
CREATE INDEX IF NOT EXISTS kb_chunks_tags_idx ON kb_chunks USING gin (tags);
CREATE INDEX IF NOT EXISTS kb_chunks_sha_idx ON kb_chunks (content_sha256);
CREATE INDEX IF NOT EXISTS kb_chunks_vec_idx ON kb_chunks USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_chunks ENABLE ROW LEVEL SECURITY;

-- Helper: est-membre ?
CREATE OR REPLACE FUNCTION is_member_of_tenant(tid UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_members
    WHERE tenant_id = tid AND user_id = auth.uid()
  );
$$;

-- Policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tenants' AND policyname = 'tenants_select_self') THEN
    CREATE POLICY tenants_select_self ON tenants
    FOR SELECT USING (EXISTS (
      SELECT 1 FROM tenant_members m WHERE m.tenant_id = id AND m.user_id = auth.uid()
    ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tenant_members' AND policyname = 'tenant_members_select_self') THEN
    CREATE POLICY tenant_members_select_self ON tenant_members
    FOR SELECT USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tenant_members' AND policyname = 'tenant_members_insert_self') THEN
    CREATE POLICY tenant_members_insert_self ON tenant_members
    FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kb_sources' AND policyname = 'kb_sources_select_self') THEN
    CREATE POLICY kb_sources_select_self ON kb_sources
    FOR SELECT USING (is_member_of_tenant(tenant_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kb_sources' AND policyname = 'kb_sources_insert_by_member') THEN
    CREATE POLICY kb_sources_insert_by_member ON kb_sources
    FOR INSERT WITH CHECK (is_member_of_tenant(tenant_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kb_chunks' AND policyname = 'kb_chunks_select_self') THEN
    CREATE POLICY kb_chunks_select_self ON kb_chunks
    FOR SELECT USING (is_member_of_tenant(tenant_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kb_chunks' AND policyname = 'kb_chunks_insert_by_member') THEN
    CREATE POLICY kb_chunks_insert_by_member ON kb_chunks
    FOR INSERT WITH CHECK (is_member_of_tenant(tenant_id));
  END IF;
END $$;

-- RPC de recherche sémantique
CREATE OR REPLACE FUNCTION match_chunks(
  p_tenant_id UUID,
  p_query_embedding vector(1536),
  p_match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT, title TEXT, content TEXT, tags TEXT[], similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    id, title, content, tags,
    1 - (embedding <=> p_query_embedding) AS similarity
  FROM kb_chunks
  WHERE tenant_id = p_tenant_id
  ORDER BY embedding <-> p_query_embedding
  LIMIT p_match_count;
$$;

-- Bucket storage pour les documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kb', 'kb', false)
ON CONFLICT (id) DO NOTHING;

-- Policies storage
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'kb_select_by_tenant') THEN
    CREATE POLICY kb_select_by_tenant ON storage.objects
    FOR SELECT USING (
      bucket_id = 'kb' AND 
      (storage.foldername(name))[1] IN (
        SELECT 'tenants/' || tenant_id::text FROM tenant_members WHERE user_id = auth.uid()
      )
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'kb_insert_by_tenant') THEN
    CREATE POLICY kb_insert_by_tenant ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'kb' AND 
      (storage.foldername(name))[1] IN (
        SELECT 'tenants/' || tenant_id::text FROM tenant_members WHERE user_id = auth.uid()
      )
    );
  END IF;
END $$;