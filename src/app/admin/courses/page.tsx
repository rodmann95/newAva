import { getCourses } from "@/features/courses/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, BookOpenIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const { data: courses, error } = await getCourses();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
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

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
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
                    <BookOpenIcon className="h-4 w-4" />
                    -- Módulos
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 bg-muted/50">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/admin/courses/${course.id}`}>
                    Editar Conteúdo
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-muted p-4 rounded-full mb-4">
            <BookOpenIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Nenhum curso encontrado</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Você ainda não criou nenhum curso para esta instituição. Comece criando seu primeiro curso agora.
          </p>
          <Button asChild>
            <Link href="/admin/courses/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Criar meu primeiro curso
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
