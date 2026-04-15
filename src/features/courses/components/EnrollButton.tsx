"use client";

import { useState } from "react";
import { enrollInCourse } from "../student-actions";
import { Button } from "@/components/ui/button";
import { Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";

interface EnrollButtonProps {
  courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEnroll = async () => {
    setIsLoading(true);
    const { error } = await enrollInCourse(courseId);
    
    if (error) {
      toast.error("Falha ao se matricular: " + error);
      setIsLoading(false);
    } else {
      toast.success("Matrícula realizada com sucesso!");
      setIsSuccess(true);
      // Wait a bit to show success state then revalidate happens via server action
    }
  };

  if (isSuccess) {
    return (
      <Button disabled className="w-full bg-green-500 hover:bg-green-500 text-white gap-2">
        <CheckCircle2Icon className="h-4 w-4" />
        Matriculado
      </Button>
    );
  }

  return (
    <Button 
      className="w-full" 
      onClick={handleEnroll} 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        "Matricular-se Agora"
      )}
    </Button>
  );
}
