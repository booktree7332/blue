-- Create student_assignments table for tracking which students are assigned to which assignments
CREATE TABLE public.student_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(assignment_id, student_id)
);

-- Enable RLS
ALTER TABLE public.student_assignments ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can do everything on student_assignments"
ON public.student_assignments
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Instructors can manage assignments for their own assignments
CREATE POLICY "Instructors can manage student_assignments for own assignments"
ON public.student_assignments
FOR ALL
USING (
  has_role(auth.uid(), 'instructor') AND 
  EXISTS (
    SELECT 1 FROM public.assignments 
    WHERE assignments.id = student_assignments.assignment_id 
    AND assignments.instructor_id = auth.uid()
  )
);

-- Students can read their own assignment mappings
CREATE POLICY "Students can read own student_assignments"
ON public.student_assignments
FOR SELECT
USING (
  has_role(auth.uid(), 'student') AND 
  auth.uid() = student_id
);