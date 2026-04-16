"use client";

import { useState, useEffect } from "react";
import { getInstitutions } from "@/features/institutions/actions";
import { updateCourseVisibility } from "../actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { LandmarkIcon, Loader2, Save, Users } from "lucide-react";
import { toast } from "sonner";

interface CourseVisibilityManagerProps {
  courseId: string;
  initialSelectedIds?: string[];
}

export function CourseVisibilityManager({ courseId, initialSelectedIds = [] }: CourseVisibilityManagerProps) {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await getInstitutions();
      if (data) setInstitutions(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const toggleInstitution = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateCourseVisibility(courseId, selectedIds);
    if (!error) {
      toast.success("Visibilidade do curso atualizada!");
    } else {
      toast.error("Erro ao salvar: " + error);
    }
    setIsSaving(false);
  };

  const selectAll = () => {
    setSelectedIds(institutions.map(i => i.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3 border-b mb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Visibilidade por Instituição
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-[10px] uppercase" onClick={selectAll}>Selecionar Todas</Button>
            <Button variant="ghost" size="sm" className="text-[10px] uppercase" onClick={clearAll}>Limpar</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
          {institutions.map(inst => (
            <div 
              key={inst.id} 
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedIds.includes(inst.id) 
                  ? "bg-blue-50 border-blue-200" 
                  : "bg-white border-slate-100 hover:border-slate-300"
              }`}
              onClick={() => toggleInstitution(inst.id)}
            >
              <Checkbox 
                id={inst.id} 
                checked={selectedIds.includes(inst.id)}
                onCheckedChange={() => toggleInstitution(inst.id)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">{inst.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono">{inst.domain || "Domínio padrão"}</p>
              </div>
              <LandmarkIcon className={`h-4 w-4 ${selectedIds.includes(inst.id) ? "text-blue-500" : "text-slate-200"}`} />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t mt-6 flex justify-between items-center px-6 py-4">
        <p className="text-xs text-slate-500">
           {selectedIds.length} de {institutions.length} instituições selecionadas.
        </p>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
           {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
           Salvar Regras de Acesso
        </Button>
      </CardFooter>
    </Card>
  );
}
