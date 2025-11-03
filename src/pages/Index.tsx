import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, UserCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card p-6 shadow-sm">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Homework Hub</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            A modern platform for assignment management and online assessments
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-8">
        <section className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Welcome to Homework Hub
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose your role to get started. Students can take quizzes with our TOEFL-style interface, 
            while instructors can create and manage assignments.
          </p>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl">
            <div className="p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <UserCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">Student Portal</h3>
              <p className="mb-6 text-muted-foreground">
                Access your assignments, take quizzes with a distraction-free interface, 
                and track your progress.
              </p>
              <Button 
                onClick={() => navigate("/student")} 
                className="w-full"
                size="lg"
              >
                Enter as Student
              </Button>
            </div>
          </Card>

          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl">
            <div className="p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">Instructor Portal</h3>
              <p className="mb-6 text-muted-foreground">
                Create assignments, manage questions, and monitor student performance 
                with ease.
              </p>
              <Button 
                onClick={() => navigate("/instructor")} 
                className="w-full"
                size="lg"
              >
                Enter as Instructor
              </Button>
            </div>
          </Card>
        </div>

        <section className="mt-16">
          <h3 className="mb-8 text-center text-2xl font-bold text-foreground">Key Features</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h4 className="mb-2 font-semibold text-foreground">TOEFL-Style Interface</h4>
              <p className="text-sm text-muted-foreground">
                Clean, distraction-free quiz environment optimized for focus
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h4 className="mb-2 font-semibold text-foreground">Easy Assignment Creation</h4>
              <p className="text-sm text-muted-foreground">
                Intuitive tools for instructors to create multiple-choice questions
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <UserCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h4 className="mb-2 font-semibold text-foreground">Progress Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Real-time feedback and comprehensive performance analytics
              </p>
            </Card>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t bg-card p-6">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>© 2024 Homework Hub. Built for modern education.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
