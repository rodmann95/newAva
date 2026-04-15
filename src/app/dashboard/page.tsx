import { getStudentDashboard, getAvailableCourses } from "@/features/courses/student-actions";
import { AnnouncementBanner } from "@/features/courses/components/AnnouncementBanner";
import { DownloadCertificate } from "@/features/certificates/components/DownloadCertificate";
import { EnrollButton } from "@/features/courses/components/EnrollButton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpenIcon, LayoutDashboardIcon, CalendarIcon, Loader2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Suspense } from "react";
import { CurrentDate } from "@/components/current-date";

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Meu Dashboard</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1 font-semibold">
              Ambiente Virtual do Aluno
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white p-2 px-4 rounded-full border shadow-sm">
            <CalendarIcon className="h-4 w-4" />
            <CurrentDate />
          </div>
        </div>

        <Suspense fallback={<div className="h-16 w-full bg-slate-100 animate-pulse rounded-md" />}>
          <AnnouncementBanner />
        </Suspense>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando seus cursos...</p>
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}

async function DashboardContent() {
  const [{ data: enrolledCourses, error: enrolledError }, { data: availableCourses, error: availableError }] = await Promise.all([
    getStudentDashboard(),
    getAvailableCourses()
  ]);

  const error = enrolledError || availableError;

  return (
    <div className="space-y-12 pb-20">
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Meus Cursos Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800" id="cursos">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            Meus Cursos
          </h2>
          {enrolledCourses && enrolledCourses.length > 0 && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {enrolledCourses.length} curso(s) em andamento
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enrolledCourses && enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <Card key={course.id} className="flex flex-col border-none shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description || "Sem descrição disponível."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>PROGRESSO</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {course.progress === 100 ? (
                    <DownloadCertificate 
                      courseId={course.id} 
                      courseTitle={course.title}
                      userName="Servidor Público"
                    />
                  ) : (
                    <Button className="w-full" asChild>
                      <Link href={`/courses/${course.id}/player`}>
                        Acessar Curso
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="md:col-span-3 py-20 text-center space-y-4 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <LayoutDashboardIcon className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-medium text-slate-900">Nenhum curso iniciado</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Você ainda não começou nenhuma capacitação. Explore o catálogo abaixo para se matricular!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Catalog Section */}
      {availableCourses && availableCourses.length > 0 && (
        <section className="space-y-6 pt-10 border-t">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
              <PlusIcon className="h-6 w-6" />
              Catálogo de Capacitação
            </h2>
            <p className="text-slate-500">Selecione novos cursos e trilhas de aprendizado disponíveis para você.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCourses.map((course) => (
              <Card key={course.id} className="flex flex-col border-slate-200 bg-white/50 hover:bg-white hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-fit mb-2">
                    Disponível
                  </div>
                  <CardTitle className="text-xl text-slate-900">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-3 text-slate-600">
                    {course.description || "Sem descrição disponível."}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-6 flex flex-col gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/courses/${course.id}`}>
                      Ver Módulos e Aulas
                    </Link>
                  </Button>
                  <EnrollButton courseId={course.id} />
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
