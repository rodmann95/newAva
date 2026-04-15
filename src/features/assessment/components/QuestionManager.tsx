"use client";

import { useState } from "react";
import { createQuestion, deleteQuestion } from "../actions";
import { Question } from "../types";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Trash2Icon, PlusIcon, HelpCircleIcon, Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface QuestionManagerProps {
  moduleId: string;
  courseId: string;
  existingQuestions?: Question[];
}

const emptyOptions = () => [
  { text: "", is_correct: false },
  { text: "", is_correct: false },
  { text: "", is_correct: false },
  { text: "", is_correct: false },
];

export function QuestionManager({ moduleId, courseId, existingQuestions = [] }: QuestionManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(existingQuestions);
  const [text, setText] = useState("");
  const [options, setOptions] = useState(emptyOptions());
  const [isLoading, setIsLoading] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, { text: "", is_correct: false }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: "text" | "is_correct", value: any) => {
    const newOptions = [...options];
    if (field === "is_correct") {
      // Only one correct answer at a time
      newOptions.forEach((o, i) => { o.is_correct = (i === index ? value : false); });
    } else {
      newOptions[index].text = value;
    }
    setOptions(newOptions);
  };

  const resetForm = () => {
    setText("");
    setOptions(emptyOptions());
  };

  const handleCreate = async () => {
    if (!text.trim()) {
      toast.error("Preencha o enunciado da questão.");
      return;
    }
    const filledOptions = options.filter(o => o.text.trim());
    if (filledOptions.length < 2) {
      toast.error("Forneça pelo menos 2 alternativas.");
      return;
    }
    if (!filledOptions.some(o => o.is_correct)) {
      toast.error("Marque pelo menos uma alternativa como correta.");
      return;
    }
    
    setIsLoading(true);
    const result = await createQuestion(moduleId, courseId, text.trim(), filledOptions);
    setIsLoading(false);

    if (result.error) {
      toast.error("Erro ao salvar questão: " + result.error);
      return;
    }

    // Optimistically add to local state
    if (result.data) {
      const newQ: Question = {
        id: result.data.id,
        module_id: moduleId,
        text: text.trim(),
        options: filledOptions.map((o, i) => ({
          id: `temp-${i}`,
          question_id: result.data!.id,
          text: o.text,
          is_correct: o.is_correct,
        })),
      };
      setQuestions(prev => [...prev, newQ]);
      toast.success("Questão salva com sucesso!");
      resetForm();
    }
  };

  const handleDelete = async (questionId: string) => {
    const result = await deleteQuestion(questionId);
    if (result.error) {
      toast.error("Erro ao excluir: " + result.error);
      return;
    }
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    toast.success("Questão removida.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircleIcon className="h-4 w-4 mr-2" />
          Banco de Questões
          {questions.length > 0 && (
            <Badge variant="secondary" className="ml-2">{questions.length}</Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircleIcon className="h-5 w-5 text-primary" />
            Gerenciar Questões do Módulo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add New Question Form */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Nova Questão
            </h3>

            <div className="space-y-2">
              <Label>Enunciado da Questão</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite a pergunta aqui..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label>Alternativas <span className="text-muted-foreground text-xs">(marque a correta com ✓)</span></Label>
              {options.map((option, index) => (
                <div key={index} className={`flex items-center gap-3 p-2 rounded-md border transition-colors ${option.is_correct ? 'bg-green-50 border-green-300' : 'bg-background border-border'}`}>
                  <Checkbox 
                    checked={option.is_correct} 
                    onCheckedChange={(checked) => handleOptionChange(index, "is_correct", checked)}
                    className={option.is_correct ? "border-green-500 data-[state=checked]:bg-green-500" : ""}
                  />
                  <Input 
                    value={option.text} 
                    onChange={(e) => handleOptionChange(index, "text", e.target.value)} 
                    placeholder={`Alternativa ${index + 1}`}
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent"
                  />
                  {option.is_correct && <CheckCircle2Icon className="h-4 w-4 text-green-500 shrink-0" />}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveOption(index)} 
                    disabled={options.length <= 2}
                    className="h-7 w-7 shrink-0"
                  >
                    <Trash2Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={handleAddOption} className="text-xs w-full border border-dashed">
                <PlusIcon className="h-3 w-3 mr-1" /> Adicionar Alternativa
              </Button>
            </div>
            
            <Button className="w-full" onClick={handleCreate} disabled={isLoading}>
              {isLoading ? (
                <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
              ) : (
                "Salvar Questão"
              )}
            </Button>
          </div>

          <Separator />

          {/* Existing Questions List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Questões Cadastradas ({questions.length})
            </h3>

            {questions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <HelpCircleIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground italic">
                  Nenhuma questão cadastrada ainda.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div key={q.id} className="border rounded-lg p-4 bg-background space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-sm font-medium leading-relaxed">{q.text}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(q.id)}
                        className="h-7 w-7 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>

                    {q.options && q.options.length > 0 && (
                      <div className="pl-9 grid grid-cols-1 gap-1">
                        {q.options.map((opt) => (
                          <div 
                            key={opt.id} 
                            className={`text-xs px-3 py-1.5 rounded flex items-center gap-2 ${
                              opt.is_correct 
                                ? 'bg-green-50 text-green-700 font-medium' 
                                : 'text-muted-foreground'
                            }`}
                          >
                            {opt.is_correct && <CheckCircle2Icon className="h-3.5 w-3.5 text-green-500 shrink-0" />}
                            <span>{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
