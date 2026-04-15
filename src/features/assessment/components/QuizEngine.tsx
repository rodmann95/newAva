"use client";

import { useState } from "react";
import { Question } from "../types";
import { submitQuizAttempt } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2Icon, 
  XCircleIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon,
  TrophyIcon,
  RotateCcwIcon,
  ArrowRightIcon,
  HelpCircleIcon
} from "lucide-react";

interface QuizEngineProps {
  moduleId: string;
  courseId: string;
  questions: Question[];
  onComplete?: () => void;
}

export function QuizEngine({ moduleId, courseId, questions, onComplete }: QuizEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number, passed: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = Object.entries(answers).map(([qId, oId]) => ({
      questionId: qId,
      optionId: oId
    }));
    
    const { data, error } = await submitQuizAttempt(moduleId, payload);
    
    if (error) {
      alert("Erro ao enviar tentativa: " + error);
    } else if (data) {
      setResult({ score: data.score, passed: data.passed });
    }
    setIsSubmitting(false);
  };

  if (result) {
    return (
      <Card className="max-w-xl mx-auto border-none shadow-2xl overflow-hidden">
        <div className={`h-2 ${result.passed ? "bg-green-500" : "bg-destructive"}`} />
        <CardHeader className="text-center pt-10">
          <div className="flex justify-center mb-6">
            {result.passed ? (
              <div className="bg-green-100 p-4 rounded-full">
                <TrophyIcon className="h-12 w-12 text-green-600" />
              </div>
            ) : (
              <div className="bg-destructive/10 p-4 rounded-full">
                <RotateCcwIcon className="h-12 w-12 text-destructive" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            {result.passed ? "Parabéns! Você passou!" : "Não foi desta vez..."}
          </CardTitle>
          <div className="mt-4">
            <span className="text-5xl font-black">{result.score}%</span>
            <p className="text-muted-foreground mt-2 font-medium uppercase tracking-widest text-xs">
              Sua Nota Final
            </p>
          </div>
        </CardHeader>
        <CardContent className="text-center pb-8 px-10">
          <p className="text-muted-foreground">
            {result.passed 
              ? "Você concluiu este módulo com sucesso. Seu progresso foi atualizado." 
              : "Sua nota foi inferior a 70%. Revise o conteúdo e tente novamente."}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 bg-muted/30 p-8">
          {result.passed ? (
            <Button className="w-full h-12 text-lg" onClick={onComplete}>
              Continuar Curso
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button className="w-full h-12" onClick={() => window.location.reload()}>
                <RotateCcwIcon className="mr-2 h-5 w-5" />
                Tentar Novamente
              </Button>
              <Button variant="ghost" className="w-full" onClick={onComplete}>
                Voltar às Aulas
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Guard: no questions registered for this module
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="bg-amber-50 p-6 rounded-full">
          <HelpCircleIcon className="h-16 w-16 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Avaliação ainda não disponível</h3>
        <p className="text-slate-500 max-w-sm">
          O professor ainda não cadastrou questões para este módulo. Volte mais tarde!
        </p>
        <Button variant="outline" onClick={onComplete}>
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Voltar às Aulas
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-none">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <span>Questão {currentStep + 1} de {questions.length}</span>
          <span>{Math.round(progress)}% Concluído</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        <CardTitle className="text-xl leading-relaxed pt-4">
          {currentQuestion.text}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="py-6">
        <RadioGroup 
          onValueChange={handleAnswer} 
          value={answers[currentQuestion.id]}
          className="space-y-3"
        >
          {currentQuestion.options?.map((option) => (
            <Label
              key={option.id}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50 ${
                answers[currentQuestion.id] === option.id 
                  ? "border-primary bg-primary/5 ring-1 ring-primary" 
                  : "border-border"
              }`}
            >
              <RadioGroupItem value={option.id} className="sr-only" />
              <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                answers[currentQuestion.id] === option.id ? "border-primary bg-primary text-white" : "border-muted-foreground/30"
              }`}>
                {answers[currentQuestion.id] === option.id && <div className="h-2 w-2 bg-white rounded-full" />}
              </div>
              <span className="text-sm font-medium">{option.text}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-muted/10 p-6">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          disabled={currentStep === 0}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        
        {currentStep === questions.length - 1 ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!answers[currentQuestion.id] || isSubmitting}
            className="px-8"
          >
            {isSubmitting ? "Enviando..." : "Finalizar Prova"}
          </Button>
        ) : (
          <Button 
            onClick={handleNext} 
            disabled={!answers[currentQuestion.id]}
            className="px-8"
          >
            Próxima Questão
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
