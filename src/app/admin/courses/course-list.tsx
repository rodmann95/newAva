"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function AdminCourseList({ courses }: { courses: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Buscar cursos por título..." 
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Card key={course.id} className="flex flex-col border border-slate-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={course.is_published ? "default" : "secondary"}>
                    {course.is_published ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description || "Sem descrição."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Gerenciar Conteúdo
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 bg-muted/50">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/admin/courses/${course.id}`}>
                    Editar Curso
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-muted p-4 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Nenhum curso encontrado</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Não encontramos cursos com este nome. Tente outro termo ou crie um novo curso.
          </p>
          {search ? (
             <Button variant="link" onClick={() => setSearch("")} className="text-blue-600">
              Limpar busca
            </Button>
          ) : (
            <Button asChild>
              <Link href="/admin/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar meu primeiro curso
              </Link>
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
