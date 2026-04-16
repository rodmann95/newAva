"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { updateInstitutionSettings } from "@/features/institutions/actions";

export default function SettingsPage() {
  const [institution, setInstitution] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("institution_id")
        .eq("id", user.id)
        .single();

      if (profile?.institution_id) {
        const { data: inst } = await supabase
          .from("institutions")
          .select("*")
          .eq("id", profile.institution_id)
          .single();
        
        setInstitution(inst);
      }
      setIsLoading(false);
    }
    fetchSettings();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!institution) return;

    setIsSaving(true);
    const { error } = await updateInstitutionSettings(institution.id, institution);

    if (!error) {
      toast.success("Configurações atualizadas com sucesso!");
    } else {
      toast.error("Erro ao salvar: " + error);
    }
    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-slate-500">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações da Instituição</h1>
          <p className="text-slate-500 text-sm">Personalize a identidade visual e as regras da sua prefeitura.</p>
        </div>
        <SettingsIcon className="h-8 w-8 text-slate-300" />
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>Configure como os alunos veem a plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Instituição</Label>
              <Input 
                id="name" 
                value={institution?.name || ""} 
                onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
              />
            </div>
            {/* Outros campos de visual e regras podem ser adicionados aqui se a tabela suportar */}
            <Button type="submit" className="w-full gap-2" disabled={isSaving}>
              {isSaving ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
