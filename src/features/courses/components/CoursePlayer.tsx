"use client";

import { useState } from "react";
import { CourseWithModules, Lesson } from "../types";
import { toggleLessonProgress } from "../student-actions";
import { getModuleQuiz } from "../../../features/assessment/actions";
import { QuizEngine } from "../../../features/assessment/components/QuizEngine";
import { Question } from "../../../features/assessment/types";
import { getYouTubeEmbedUrl } from "../utils";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  ChevronLeft,
  Menu,
  Trophy,
  X
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface CoursePlayerProps {
  course: CourseWithModules;
  completedLessonIds: string[];
}

export function CoursePlayer({ course, completedLessonIds }: CoursePlayerProps) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    course.modules[0]?.lessons[0] || null
  );
  
  const [activeQuizModuleId, setActiveQuizModuleId] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isCompleted = (lessonId: string) => completedLessonIds.includes(lessonId);

  const handleToggleComplete = async (lesson: Lesson) => {
    const currentStatus = isCompleted(lesson.id);
    await toggleLessonProgress(lesson.id, course.id, !currentStatus);
  };

  const startQuiz = async (moduleId: string) => {
    setActiveLesson(null);
    const { data } = await getModuleQuiz(moduleId);
    if (data && data.length > 0) {
      setQuizQuestions(data);
      setActiveQuizModuleId(moduleId);
    } else {
      setQuizQuestions([]);
      setActiveQuizModuleId(moduleId);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold hover:text-primary">
          <ChevronLeftIcon className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <Accordion type="multiple" defaultValue={course.modules.map(m => m.id)} className="w-full">
          {course.modules.map((module) => (
            <AccordionItem key={module.id} value={module.id} className="border-none">
              <AccordionTrigger className="px-3 py-2 hover:bg-muted rounded-md text-sm font-bold no-underline hover:no-underline">
                {module.title}
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                <div className="space-y-1">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLesson(lesson);
                        setActiveQuizModuleId(null);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                        activeLesson?.id === lesson.id 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-muted"
                      }`}
                    >
                      {isCompleted(lesson.id) ? (
                        <CheckCircle2Icon className="h-4 w-4 text-green-500 shrink-0" />
                      ) : lesson.content_type === 'video' ? (
                        <PlayCircleIcon className="h-4 w-4 shrink-0" />
                      ) : (
                        <FileTextIcon className="h-4 w-4 shrink-0" />
                      )}
                      <span className="truncate">{lesson.title}</span>
                    </button>
                  ))}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full mt-2 text-xs h-8 border-dashed ${activeQuizModuleId === module.id ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => startQuiz(module.id)}
                  >
                    <TrophyIcon className="h-3 w-3 mr-2" />
                    Avaliação do Módulo
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar Desktop */}
      <aside 
        className={`hidden lg:flex ${
          isSidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 border-r bg-muted/30 flex-col shrink-0 overflow-hidden`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile (Sheet) */}
      <Sheet open={!isSidebarOpen && window.innerWidth < 1024} onOpenChange={(open) => setIsSidebarOpen(!open)}>
         <SheetContent side="left" className="p-0 w-80">
            <SidebarContent />
         </SheetContent>
      </Sheet>

      {/* Área Principal do Player */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        <header className="h-14 border-b flex items-center px-4 sm:px-6 justify-between bg-background z-10 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="text-xs sm:text-sm font-semibold truncate px-2 sm:px-4 text-center flex-1">
            {activeLesson?.title || (activeQuizModuleId ? "Avaliação do Módulo" : "Selecione uma aula")}
          </div>
          <Link href="/dashboard" className="lg:hidden text-muted-foreground">
             <X className="h-5 w-5" />
          </Link>
          <div className="hidden lg:block w-10"></div> 
        </header>

        <div className="flex-1 overflow-y-auto bg-muted/10">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* Renderização de Conteúdo */}
              <Card className="overflow-hidden border-none shadow-2xl bg-black aspect-video flex items-center justify-center">
                {activeLesson.content_type === 'video' && activeLesson.content_url ? (
                  <iframe
                    className="w-full h-full"
                    src={getYouTubeEmbedUrl(activeLesson.content_url) || ""}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : activeLesson.content_type === 'pdf' ? (
                  <div className="flex flex-col items-center text-white p-10 text-center gap-4">
                    <FileTextIcon className="h-16 w-16 opacity-50" />
                    <p>Este material é um documento PDF.</p>
                    <Button variant="secondary" asChild>
                      <a href={activeLesson.content_url || "#"} target="_blank" rel="noreferrer">
                        Abrir Documento em Nova Guia
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="p-10 text-white italic opacity-50">
                    Conteúdo textual ou indisponível.
                  </div>
                )}
              </Card>

              {/* Ações da Aula */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-background p-6 rounded-xl border shadow-sm">
                <div>
                  <h3 className="text-xl font-bold">{activeLesson.title}</h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">
                    {course.title} • {activeLesson.content_type}
                  </p>
                </div>
                <Button 
                  size="lg"
                  variant={isCompleted(activeLesson.id) ? "outline" : "default"}
                  className={isCompleted(activeLesson.id) ? "border-green-500 text-green-600 hover:bg-green-50" : ""}
                  onClick={() => handleToggleComplete(activeLesson)}
                >
                  {isCompleted(activeLesson.id) ? (
                    <>
                      <CheckCircle2Icon className="mr-2 h-5 w-5 text-green-500" />
                      Aula Concluída
                    </>
                  ) : (
                    "Concluir Aula"
                  )}
                </Button>
              </div>

              {/* Descrição/Corpo da Aula */}
              {activeLesson.content_body && (
                <Card className="p-8 prose prose-slate max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: activeLesson.content_body }} />
                </Card>
              )}
            </div>
          ) : activeQuizModuleId ? (
            <div className="max-w-4xl mx-auto p-10">
              <QuizEngine 
                moduleId={activeQuizModuleId} 
                courseId={course.id} 
                questions={quizQuestions} 
                onComplete={() => window.location.reload()}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
              <PlayCircleIcon className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-medium">Pronto para começar?</h3>
              <p className="text-muted-foreground">Selecione uma aula no menu lateral para iniciar seus estudos.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
