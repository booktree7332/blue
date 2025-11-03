-- Add explanation column to questions table
ALTER TABLE public.questions ADD COLUMN explanation TEXT;

-- Add file fields to assignments table
ALTER TABLE public.assignments 
  ADD COLUMN file_url TEXT,
  ADD COLUMN file_type TEXT CHECK (file_type IN ('image', 'pdf'));

-- Create storage bucket for assignment files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assignment-files', 'assignment-files', true);

-- RLS Policy: Instructors and admins can upload files
CREATE POLICY "Staff can upload assignment files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assignment-files' AND
  (public.has_role(auth.uid(), 'instructor'::app_role) OR 
   public.has_role(auth.uid(), 'admin'::app_role))
);

-- RLS Policy: Authenticated users can view assignment files
CREATE POLICY "Authenticated users can view assignment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignment-files' AND auth.role() = 'authenticated');

-- RLS Policy: Staff can delete files
CREATE POLICY "Staff can delete assignment files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assignment-files' AND
  (public.has_role(auth.uid(), 'instructor'::app_role) OR 
   public.has_role(auth.uid(), 'admin'::app_role))
);