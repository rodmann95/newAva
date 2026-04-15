"use client";

import { useState } from "react";
import { updateCourse } from "../actions";
import { Button } from "@/components/ui/button";
import { Loader2Icon, GlobeIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";

interface PublishToggleProps {
  courseId: string;
  isPublished: boolean;
}

export function PublishToggle({ courseId, isPublished: initialPublished }: PublishToggleProps) {
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const newState = !isPublished;

    const { error } = await updateCourse(courseId, { is_published: newState });

    if (error) {
      toast.error("Falha ao atualizar status: " + error);
    } else {
      setIsPublished(newState);
      toast.success(newState ? "✅ Curso publicado! Alunos já podem se matricular." : "🔒 Curso voltou para rascunho.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status badge */}
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
          isPublished
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-slate-50 text-slate-500 border-slate-200"
        }`}
      >
        {isPublished ? (
          <GlobeIcon className="h-3.5 w-3.5" />
        ) : (
          <LockIcon className="h-3.5 w-3.5" />
        )}
        {isPublished ? "Publicado" : "Rascunho"}
      </span>

      {/* Toggle button */}
      <Button
        onClick={handleToggle}
        disabled={isLoading}
        variant={isPublished ? "outline" : "default"}
        className={isPublished ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" : "bg-green-600 hover:bg-green-700 text-white"}
        size="sm"
      >
        {isLoading ? (
          <Loader2Icon className="h-4 w-4 animate-spin" />
        ) : isPublished ? (
          <>
            <LockIcon className="h-4 w-4 mr-2" />
            Despublicar
          </>
        ) : (
          <>
            <GlobeIcon className="h-4 w-4 mr-2" />
            Publicar Curso
          </>
        )}
      </Button>
    </div>
  );
}
