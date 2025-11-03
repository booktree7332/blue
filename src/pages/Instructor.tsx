import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuestionForm {
  text: string;
  options: string[];
  correctAnswer: number;
}

const Instructor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    if (!assignmentTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter an assignment title",
        variant: "destructive"
      });
      return;
    }

    const hasEmptyFields = questions.some(
      q => !q.text.trim() || q.options.some(opt => !opt.trim())
    );

    if (hasEmptyFields) {
      toast({
        title: "Error",
        description: "Please fill in all question fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Assignment created successfully"
    });

    // Reset form
    setAssignmentTitle("");
    setQuestions([
      {
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card p-4 shadow-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Create Assignment</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Card className="p-8">
          <div className="mb-8">
            <Label htmlFor="title" className="text-lg font-semibold">
              Assignment Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Reading Comprehension Quiz 1"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="space-y-8">
            {questions.map((question, qIndex) => (
              <Card key={qIndex} className="border-2 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <FileText className="h-5 w-5" />
                    Question {qIndex + 1}
                  </h3>
                  {questions.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Question Text</Label>
                    <Textarea
                      placeholder="Enter your question here..."
                      value={question.text}
                      onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="mb-3 block">Answer Options</Label>
                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === oIndex}
                            onChange={() => updateQuestion(qIndex, "correctAnswer", oIndex)}
                            className="h-4 w-4 text-primary"
                          />
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Select the radio button to mark the correct answer
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Button variant="outline" onClick={addQuestion} className="flex-1">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Create Assignment
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Instructor;
