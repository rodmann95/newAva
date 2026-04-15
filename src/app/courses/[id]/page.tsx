import { getCourseCurriculum } from "@/features/courses/student-actions";
import { EnrollButton } from "@/features/courses/components/EnrollButton";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeftIcon, 
  BookOpenIcon, 
  PlayCircleIcon, 
  FileTextIcon,
  ClockIcon,
  LayersIcon
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CoursePreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function CoursePreviewPage({ params }: CoursePreviewPageProps) {
  const { id } = await params;
  const { data, error } = await getCourseCurriculum(id);

  if (!data || error) return notFound();

  const { course, curriculum } = data;
  const totalLessons = curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="container mx-auto py-12 px-4">
          <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white hover:bg-white/10 mb-6">
            <Link href="/dashboard">
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Link>
          </Button>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              <BookOpenIcon className="h-3.5 w-3.5" />
              Curso Disponível
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-lg text-slate-300 leading-relaxed">
                {course.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <LayersIcon className="h-4 w-4 text-blue-400" />
                <span><strong className="text-white">{curriculum.length}</strong> módulo{curriculum.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <PlayCircleIcon className="h-4 w-4 text-blue-400" />
                <span><strong className="text-white">{totalLessons}</strong> aula{totalLessons !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Enroll button */}
            <div className="pt-4">
              <div className="inline-block">
                <EnrollButton courseId={course.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <LayersIcon className="h-6 w-6 text-blue-600" />
          Conteúdo do Curso
        </h2>

        {curriculum.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BookOpenIcon className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>O conteúdo ainda está sendo preparado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {curriculum.map((module, index) => (
              <div key={module.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Module header */}
                <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{module.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {module.lessons.length} aula{module.lessons.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Lessons list */}
                {module.lessons.length > 0 && (
                  <ul className="divide-y divide-slate-50">
                    {module.lessons.map((lesson, lessonIdx) => (
                      <li key={lesson.id} className="flex items-center gap-4 px-6 py-3">
                        <span className="text-xs text-slate-400 w-4 font-mono">{lessonIdx + 1}</span>
                        {lesson.content_type === "video" ? (
                          <PlayCircleIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <FileTextIcon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        )}
                        <span className="text-sm text-slate-700 flex-1">{lesson.title}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                          {lesson.content_type === "video" ? "Vídeo" : "PDF"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center space-y-4">
          <h3 className="text-2xl font-bold">Pronto para começar?</h3>
          <p className="text-blue-100">Matricule-se agora e tenha acesso imediato a todos os módulos.</p>
          <div className="inline-block">
            <EnrollButton courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
