import { getCourses } from "@/features/courses/actions";
import { Navbar } from "@/components/navbar";
import { Suspense } from "react";
import { PlusIcon, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminCourseList } from "./course-list";

export default function AdminCoursesPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Cursos</h1>
          <p className="text-muted-foreground">
            Gerencie o catálogo de cursos e trilhas de aprendizado.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Curso
          </Link>
        </Button>
      </div>

      <Suspense fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }>
        <AdminCoursesDataWrapper />
      </Suspense>
    </div>
  );
}

async function AdminCoursesDataWrapper() {
  const { data: courses, error } = await getCourses();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
        Erro ao carregar cursos: {error}
      </div>
    );
  }

  return <AdminCourseList courses={courses || []} />;
}
