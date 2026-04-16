"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function EnrolledCoursesList({ courses }: { courses: any[] }) {
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Buscar nos meus cursos..." 
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="flex flex-col border-none shadow-md hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-5">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {course.description || "Sem descrição disponível."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 px-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>PROGRESSO</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 mt-4">
                <Button className="w-full" asChild>
                  <Link href={`/courses/${course.id}/player`}>
                    Continuar Estudos
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 p-20 rounded-2xl text-center space-y-4">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-medium text-slate-900">Nenhum curso encontrado</h3>
          {search ? (
             <Button variant="link" onClick={() => setSearch("")} className="text-blue-600">
              Limpar busca
            </Button>
          ) : (
            <Button asChild>
               <Link href="/dashboard/catalog">Explorar Cursos</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
