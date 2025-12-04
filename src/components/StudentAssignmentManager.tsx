import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, UserPlus, UserMinus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Student {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface StudentAssignmentManagerProps {
  assignmentId: string;
  assignmentTitle: string;
}

export const StudentAssignmentManager = ({ assignmentId, assignmentTitle }: StudentAssignmentManagerProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [assignedStudentIds, setAssignedStudentIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Fetch all verified students
      const { data: studentsData, error: studentsError } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          profiles!inner(id, full_name, email, verified)
        `)
        .eq("role", "student");

      if (studentsError) throw studentsError;

      // Filter to only verified students
      const verifiedStudents = (studentsData || [])
        .filter((s: any) => s.profiles?.verified)
        .map((s: any) => ({
          id: s.user_id,
          full_name: s.profiles.full_name,
          email: s.profiles.email,
        }));

      setStudents(verifiedStudents);

      // Fetch assigned students for this assignment
      const { data: assignedData, error: assignedError } = await supabase
        .from("student_assignments")
        .select("student_id")
        .eq("assignment_id", assignmentId);

      if (assignedError) throw assignedError;

      setAssignedStudentIds(new Set((assignedData || []).map(a => a.student_id)));
    } catch (error: any) {
      toast.error("Failed to fetch students: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStudents();
    }
  }, [open, assignmentId]);

  const toggleStudent = async (studentId: string) => {
    setSaving(true);
    try {
      if (assignedStudentIds.has(studentId)) {
        // Remove assignment
        const { error } = await supabase
          .from("student_assignments")
          .delete()
          .eq("assignment_id", assignmentId)
          .eq("student_id", studentId);

        if (error) throw error;

        setAssignedStudentIds(prev => {
          const next = new Set(prev);
          next.delete(studentId);
          return next;
        });
        toast.success("Student removed from assignment");
      } else {
        // Add assignment
        const { error } = await supabase
          .from("student_assignments")
          .insert({ assignment_id: assignmentId, student_id: studentId });

        if (error) throw error;

        setAssignedStudentIds(prev => new Set([...prev, studentId]));
        toast.success("Student assigned");
      }
    } catch (error: any) {
      toast.error("Failed to update assignment: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const assignAll = async () => {
    setSaving(true);
    try {
      const unassignedStudents = students.filter(s => !assignedStudentIds.has(s.id));
      if (unassignedStudents.length === 0) return;

      const { error } = await supabase
        .from("student_assignments")
        .insert(unassignedStudents.map(s => ({
          assignment_id: assignmentId,
          student_id: s.id,
        })));

      if (error) throw error;

      setAssignedStudentIds(new Set(students.map(s => s.id)));
      toast.success(`Assigned ${unassignedStudents.length} students`);
    } catch (error: any) {
      toast.error("Failed to assign students: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const removeAll = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("student_assignments")
        .delete()
        .eq("assignment_id", assignmentId);

      if (error) throw error;

      setAssignedStudentIds(new Set());
      toast.success("All students removed from assignment");
    } catch (error: any) {
      toast.error("Failed to remove students: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Assign Students
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Student Assignments</DialogTitle>
          <DialogDescription>
            Select which students should have access to "{assignmentTitle}"
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            <div className="flex gap-2 items-center justify-between">
              <Badge variant="secondary">
                {assignedStudentIds.size} of {students.length} assigned
              </Badge>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={assignAll}
                  disabled={saving || assignedStudentIds.size === students.length}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={removeAll}
                  disabled={saving || assignedStudentIds.size === 0}
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Remove All
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto border rounded-lg">
              {students.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No verified students found
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Assigned</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox
                            checked={assignedStudentIds.has(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                            disabled={saving}
                          />
                        </TableCell>
                        <TableCell>{student.full_name || "Unknown"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {student.email || "No email"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
