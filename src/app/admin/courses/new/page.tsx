"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/features/courses/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeftIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const { data, error: actionError } = await createCourse(title, description);

    if (actionError) {
      setError(actionError);
      setIsLoading(false);
    } else if (data) {
      router.push(`/admin/courses/${data.id}`);
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/courses">
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Curso</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Título do Curso</Label>
              <Input 
                id="title" 
                name="title" 
                required 
                placeholder="Ex: Gestão Pública Passo a Passo" 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Uma breve descrição sobre o que o aluno irá aprender." 
                rows={4}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/50 pt-6">
            <Button variant="ghost" asChild disabled={isLoading}>
              <Link href="/admin/courses">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Criar e Adicionar Conteúdo
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
