"use client";

import { useState } from "react";
import { CourseWithModules, Module, Lesson } from "../types";
import { createModule, deleteModule, createLesson, deleteLesson, updateModule } from "../actions";
import { QuestionManager } from "@/features/assessment/components/QuestionManager";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRightIcon, 
  PlusIcon, 
  Trash2Icon, 
  PlayCircleIcon,
  FileTextIcon,
  LayoutGridIcon,
  PencilIcon
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface CourseEditorProps {
  course: CourseWithModules;
}

export function CourseEditor({ course }: CourseEditorProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    course.modules[0]?.id || null
  );
  
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const selectedModule = course.modules.find(m => m.id === selectedModuleId);

  const handleAddModule = async () => {
    if (!newModuleTitle) return;
    await createModule(course.id, newModuleTitle, course.modules.length);
    setNewModuleTitle("");
    setIsAddModuleOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
      {/* Sidebar de Módulos */}
      <Card className="w-full lg:w-80 shrink-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">Módulos</CardTitle>
          <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Módulo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="module-title">Título do Módulo</Label>
                  <Input 
                    id="module-title" 
                    value={newModuleTitle} 
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="Ex: Introdução ao Curso"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddModule}>Criar Módulo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="px-2">
          <div className="space-y-1">
            {course.modules.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum módulo criado.
              </p>
            )}
            {course.modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setSelectedModuleId(module.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedModuleId === module.id 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                }`}
              >
                <span className="truncate">{module.title}</span>
                <ChevronRightIcon className="h-4 w-4 shrink-0 opacity-50" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 space-y-6">
        {selectedModule ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedModule.title}</h2>
                  <p className="text-sm text-muted-foreground">Gerencie as lições deste módulo.</p>
                </div>
                <RenameModuleDialog 
                  module={selectedModule} 
                  courseId={course.id} 
                />
              </div>
              <div className="flex gap-2">
                <QuestionManager 
                  moduleId={selectedModule.id} 
                  courseId={course.id}
                  existingQuestions={selectedModule.questions} 
                />
                <Button variant="destructive" size="sm" onClick={() => deleteModule(selectedModule.id, course.id)}>
                <Trash2Icon className="h-4 w-4 mr-2" />
                Remover Módulo
              </Button>
            </div>
          </div>
            
            <Separator />

            <div className="grid gap-4">
              {selectedModule.lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {lesson.content_type === 'video' ? (
                        <PlayCircleIcon className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileTextIcon className="h-5 w-5 text-orange-500" />
                      )}
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {lesson.content_type}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteLesson(lesson.id, course.id)}>
                      <Trash2Icon className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <AddLessonDialog moduleId={selectedModule.id} courseId={course.id} currentCount={selectedModule.lessons.length} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center border rounded-lg border-dashed">
            <LayoutGridIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Selecione um módulo</h3>
            <p className="text-sm text-muted-foreground">Crie ou selecione um módulo na barra lateral para começar a adicionar conteúdo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddLessonDialog({ moduleId, courseId, currentCount }: { moduleId: string, courseId: string, currentCount: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleAddLesson = async (type: 'video' | 'pdf') => {
    if (!title) return;
    await createLesson(moduleId, courseId, {
      title,
      content_type: type,
      content_url: url,
      order_index: currentCount
    });
    setTitle("");
    setUrl("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-dashed">
          <PlusIcon className="h-4 w-4 mr-2" />
          Adicionar Nova Lição
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Lição</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da aula" />
          </div>
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video">Vídeo (YouTube)</TabsTrigger>
              <TabsTrigger value="pdf">Materiais (PDF)</TabsTrigger>
            </TabsList>
            <TabsContent value="video" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>URL do YouTube</Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <Button className="w-full" onClick={() => handleAddLesson('video')}>Adicionar Vídeo</Button>
            </TabsContent>
            <TabsContent value="pdf" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>URL do PDF</Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link do documento" />
              </div>
              <Button className="w-full" onClick={() => handleAddLesson('pdf')}>Adicionar PDF</Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RenameModuleDialog({ module, courseId }: { module: Module, courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(module.title);

  const handleRename = async () => {
    if (!title || title === module.title) {
      setIsOpen(false);
      return;
    }
    await updateModule(module.id, { title }, courseId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear Módulo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rename-title">Novo Título</Label>
            <Input 
              id="rename-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Introdução ao Curso"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleRename}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
