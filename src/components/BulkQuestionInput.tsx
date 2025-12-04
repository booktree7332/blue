import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Plus, Eye, EyeOff } from "lucide-react";

interface ParsedQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface BulkQuestionInputProps {
  onAddQuestions: (questions: ParsedQuestion[]) => void;
}

const DEFAULT_OPTIONS = ["1", "2", "3", "4", "5"];

export const BulkQuestionInput = ({ onAddQuestions }: BulkQuestionInputProps) => {
  const [bulkText, setBulkText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const parseQuestions = (text: string): ParsedQuestion[] => {
    const questions: ParsedQuestion[] = [];
    const blocks = text.trim().split(/\n\s*\n/); // Split by blank lines

    for (const block of blocks) {
      const lines = block.trim().split("\n").filter(line => line.trim());
      if (lines.length < 2) continue;

      const questionText = lines[0].trim();
      const correctAnswerLine = lines[1].trim();
      const correctAnswer = parseInt(correctAnswerLine) - 1; // Convert 1-5 to 0-4

      if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 4) {
        throw new Error(`Invalid answer number "${correctAnswerLine}" for question "${questionText}". Must be 1-5.`);
      }

      questions.push({
        text: questionText,
        options: [...DEFAULT_OPTIONS],
        correctAnswer,
        explanation: "",
      });
    }

    return questions;
  };

  const handlePreview = () => {
    setParseError(null);
    try {
      const parsed = parseQuestions(bulkText);
      if (parsed.length === 0) {
        setParseError("No questions found. Please check the format.");
        return;
      }
      setParsedQuestions(parsed);
      setShowPreview(true);
    } catch (error: any) {
      setParseError(error.message);
    }
  };

  const handleAdd = () => {
    if (parsedQuestions.length > 0) {
      onAddQuestions(parsedQuestions);
      setBulkText("");
      setParsedQuestions([]);
      setShowPreview(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Bulk Add Questions
        </CardTitle>
        <CardDescription>
          Quickly add multiple questions at once using a simple text format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Format:</strong> Each question should have the question text on the first line, 
            followed by the correct answer number (1-5) on the second line. 
            Separate questions with a blank line. Options will be numbered 1-5 by default.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>Paste Questions</Label>
          <Textarea
            placeholder={`What is the capital of France?
3

What is 2+2?
2

Which planet is largest?
4`}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        {parseError && (
          <Alert variant="destructive">
            <AlertDescription>{parseError}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            disabled={!bulkText.trim()}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Preview Questions"}
          </Button>
          {showPreview && parsedQuestions.length > 0 && (
            <Button type="button" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add {parsedQuestions.length} Questions
            </Button>
          )}
        </div>

        {showPreview && parsedQuestions.length > 0 && (
          <div className="space-y-3 mt-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-sm">Preview ({parsedQuestions.length} questions)</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {parsedQuestions.map((q, i) => (
                <div key={i} className="p-3 bg-background rounded border text-sm">
                  <div className="font-medium">Q{i + 1}: {q.text}</div>
                  <div className="text-muted-foreground mt-1">
                    Correct: Option {q.correctAnswer + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
