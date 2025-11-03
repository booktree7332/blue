-- Create a secure function to fetch questions without exposing answers to students
CREATE OR REPLACE FUNCTION public.get_assignment_questions(
  _assignment_id uuid,
  _include_answers boolean DEFAULT false
)
RETURNS TABLE (
  id uuid,
  assignment_id uuid,
  text text,
  options jsonb,
  correct_answer integer,
  explanation text,
  order_number integer,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user should see answers (instructors, admins, or if explicitly requested after submission)
  IF _include_answers OR 
     has_role(auth.uid(), 'instructor') OR 
     has_role(auth.uid(), 'admin') THEN
    -- Return all fields including correct_answer
    RETURN QUERY
    SELECT 
      q.id,
      q.assignment_id,
      q.text,
      q.options,
      q.correct_answer,
      q.explanation,
      q.order_number,
      q.created_at
    FROM questions q
    WHERE q.assignment_id = _assignment_id
    ORDER BY q.order_number;
  ELSE
    -- Students get questions WITHOUT correct_answer and explanation
    RETURN QUERY
    SELECT 
      q.id,
      q.assignment_id,
      q.text,
      q.options,
      NULL::integer as correct_answer,  -- Hide correct answer
      NULL::text as explanation,         -- Hide explanation
      q.order_number,
      q.created_at
    FROM questions q
    WHERE q.assignment_id = _assignment_id
    ORDER BY q.order_number;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_assignment_questions(uuid, boolean) TO authenticated;