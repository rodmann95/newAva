"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnrollButton } from "@/features/courses/components/EnrollButton";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function CourseCatalogList({ courses }: { courses: any[] }) {
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Buscar cursos por nome ou descrição..." 
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="flex flex-col border-slate-200 bg-white hover:shadow-lg transition-all border-l-4 border-l-blue-500">
              <CardHeader className="p-6">
                <CardTitle className="text-xl text-slate-900">{course.title}</CardTitle>
                <CardDescription className="line-clamp-3 text-slate-600 mt-2">
                  {course.description || "Sem descrição disponível."}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto p-6 pt-0 flex flex-col gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/courses/${course.id}`}>
                    Ver Detalhes
                  </Link>
                </Button>
                <EnrollButton courseId={course.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 p-20 rounded-2xl text-center space-y-4">
          <Plus className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-medium text-slate-900">Nenhum curso encontrado</h3>
          <p className="text-slate-500">Tente ajustar seus critérios de busca ou aguarde novos lançamentos.</p>
          {search && (
            <Button variant="link" onClick={() => setSearch("")} className="text-blue-600">
              Limpar busca
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
