-- Create content-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('content-images', 'content-images', true);

-- Create RLS policies for content-images bucket
CREATE POLICY "Admins can upload content images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'content-images' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update content images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'content-images' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete content images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'content-images' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Anyone can view content images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'content-images');