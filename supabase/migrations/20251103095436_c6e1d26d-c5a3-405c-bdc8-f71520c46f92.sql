-- Allow all authenticated users to view all profiles
-- This is necessary so students can see who assigned their work
CREATE POLICY "Authenticated users can read all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);