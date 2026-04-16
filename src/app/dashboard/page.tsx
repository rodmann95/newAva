import { getStudentDashboard, getAvailableCourses, getStudentProfile } from "@/features/courses/student-actions";
import { getStudentCertificates } from "@/features/certificates/actions";
import { AnnouncementBanner } from "@/features/courses/components/AnnouncementBanner";
import { DownloadCertificate } from "@/features/certificates/components/DownloadCertificate";
import { EnrollButton } from "@/features/courses/components/EnrollButton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpenIcon, LayoutDashboardIcon, CalendarIcon, Loader2Icon, PlusIcon, AwardIcon, LandmarkIcon } from "lucide-react";
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
            <p className="text-sm text-muted-foreground">Carregando seu progresso...</p>
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}

async function DashboardContent() {
  try {
    const [
      { data: enrolledCourses, error: enrolledError }, 
      { data: availableCourses, error: availableError },
      { data: profile },
      { data: certificates }
    ] = await Promise.all([
      getStudentDashboard(),
      getAvailableCourses(),
      getStudentProfile(),
      getStudentCertificates()
    ]);

    const error = enrolledError || availableError;

    return (
      <div className="space-y-12 pb-20">
        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md border border-destructive/20 text-sm font-medium">
            Atenção: {error}
          </div>
        )}

        {/* Profile Info & Institution */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 text-sm font-medium">
            <LandmarkIcon className="h-4 w-4" />
            Instituição: <span className="font-bold">{profile?.institutions?.name || "Sem Vínculo"}</span>
          </div>
          {certificates && certificates.length > 0 && (
            <div className="flex items-center gap-3 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl border border-yellow-100 text-sm font-medium">
              <AwardIcon className="h-4 w-4" />
              Certificados Conquistados: <span className="font-bold">{certificates.length}</span>
            </div>
          )}
        </div>

        {/* Meus Cursos Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800" id="cursos">
              <BookOpenIcon className="h-5 w-5 text-primary" />
              Cursos em Andamento
            </h2>
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
                        userName={profile?.full_name || "Aluno"}
                      />
                    ) : (
                      <Button className="w-full" asChild>
                        <Link href={`/courses/${course.id}/player`}>
                          Continuar Estudos
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
              </div>
            )}
          </div>
        </section>

        {/* Certificates Section */}
        <section className="space-y-6 pt-10 border-t">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <AwardIcon className="h-5 w-5 text-yellow-600" />
            Minha Galeria de Certificados
          </h2>
          {certificates && certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {certificates.map((cert: any) => (
                <Card key={cert.id} className="bg-slate-50 border-slate-200">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">{cert.courses?.title}</CardTitle>
                    <CardDescription className="text-[10px]">Emitido em {new Date(cert.created_at).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <DownloadCertificate 
                      courseId={cert.course_id} 
                      courseTitle={cert.courses?.title} 
                      userName={profile?.full_name || "Aluno"} 
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white border text-center py-10 rounded-xl text-slate-400 text-sm italic">
              Você ainda não possui certificados disponíveis.
            </div>
          )}
        </section>

        {/* Catalog Section */}
        <section className="space-y-6 pt-10 border-t">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
              <PlusIcon className="h-6 w-6" />
              Novas Capacitações Disponíveis
            </h2>
          </div>
          {availableCourses && availableCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableCourses.map((course) => (
                <Card key={course.id} className="flex flex-col border-slate-200 bg-white/50 hover:bg-white hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3 text-slate-600">
                      {course.description || "Sem descrição disponível."}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-6 flex flex-col gap-2">
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
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl text-center text-blue-600 font-medium italic">
              🚀 Você já está inscrito em todos os cursos disponíveis para sua instituição!
            </div>
          )}
        </section>
      </div>
    );
  } catch (err: any) {
    console.error("DashboardContent crash:", err);
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Erro ao carregar o dashboard</h2>
        <Button asChild variant="outline">
          <Link href="/dashboard">Tentar Recarregar</Link>
        </Button>
      </div>
    );
  }
}
