-- Corriger le search_path pour is_member_of_tenant sans DROP
CREATE OR REPLACE FUNCTION is_member_of_tenant(tid UUID)
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_members
    WHERE tenant_id = tid AND user_id = auth.uid()
  );
$$;

-- Corriger le search_path pour match_chunks sans DROP
CREATE OR REPLACE FUNCTION match_chunks(
  p_tenant_id UUID,
  p_query_embedding vector(1536),
  p_match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT, title TEXT, content TEXT, tags TEXT[], similarity FLOAT
)
LANGUAGE SQL 
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    id, title, content, tags,
    1 - (embedding <=> p_query_embedding) AS similarity
  FROM kb_chunks
  WHERE tenant_id = p_tenant_id
  ORDER BY embedding <-> p_query_embedding
  LIMIT p_match_count;
$$;