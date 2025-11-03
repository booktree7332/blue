-- Add resubmission fields to assignments table
ALTER TABLE public.assignments 
ADD COLUMN is_resubmittable boolean NOT NULL DEFAULT false,
ADD COLUMN max_attempts integer NULL;

-- Add comment explaining the fields
COMMENT ON COLUMN public.assignments.is_resubmittable IS 'Whether students can resubmit this assignment multiple times';
COMMENT ON COLUMN public.assignments.max_attempts IS 'Maximum number of submission attempts allowed. NULL means unlimited attempts when is_resubmittable is true';