import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Which of the following best describes the main idea of the passage?",
    options: [
      "The importance of early childhood education",
      "The role of technology in modern classrooms",
      "Various teaching methodologies across different cultures",
      "The impact of standardized testing on student performance"
    ],
    correctAnswer: 2
  },
  {
    id: 2,
    text: "According to the text, what is the primary benefit of collaborative learning?",
    options: [
      "It reduces the workload for teachers",
      "It helps students develop communication skills",
      "It makes classes more entertaining",
      "It requires less classroom space"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "The author's tone in the passage can best be described as:",
    options: [
      "Critical and pessimistic",
      "Neutral and informative",
      "Enthusiastic and promotional",
      "Skeptical and questioning"
    ],
    correctAnswer: 1
  }
];

const Student = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(mockQuestions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === mockQuestions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;
  const answeredCount = selectedAnswers.filter(a => a !== null).length;

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-3xl">
          <Card className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="mx-auto h-20 w-20 text-primary" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground">Quiz Complete!</h1>
            <p className="mb-6 text-xl text-muted-foreground">
              You scored {score} out of {mockQuestions.length}
            </p>
            <div className="mb-8 text-4xl font-bold text-primary">
              {Math.round((score / mockQuestions.length) * 100)}%
            </div>
            <Button onClick={() => navigate("/")} size="lg">
              Return to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const question = mockQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card p-4 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">Reading Comprehension Quiz</h1>
            <Button variant="outline" onClick={() => navigate("/")}>
              Exit Quiz
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {mockQuestions.length}</span>
              <span>{answeredCount} answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Card className="p-8">
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              {question.text}
            </h2>
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                      isSelected
                        ? "border-primary bg-accent"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                      )}
                      <span className="text-foreground">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentQuestion === mockQuestions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={answeredCount !== mockQuestions.length}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>

        <div className="mt-6 flex justify-center gap-2">
          {mockQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`h-10 w-10 rounded-lg border-2 transition-all ${
                selectedAnswers[index] !== null
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentQuestion === index
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:border-primary"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Student;
