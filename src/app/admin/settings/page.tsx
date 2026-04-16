"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsIcon, SaveIcon, Loader2Icon, GlobeIcon, PaletteIcon } from "lucide-react";
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
        .maybeSingle();

      if (profile?.institution_id) {
        const { data: inst } = await supabase
          .from("institutions")
          .select("*")
          .eq("id", profile.institution_id)
          .maybeSingle();
        
        if (inst) {
          if (typeof inst.brand_colors === 'string') {
            try { inst.brand_colors = JSON.parse(inst.brand_colors); } catch(e) {}
          }
          setInstitution(inst);
        }
      }
      setIsLoading(false);
    }
    fetchSettings();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!institution) return;

    setIsSaving(true);
    const updates = {
      name: institution.name,
      domain: institution.domain,
      logo_url: institution.logo_url,
      brand_colors: institution.brand_colors
    };

    const { error } = await updateInstitutionSettings(institution.id, updates);

    if (!error) {
      toast.success("Configurações atualizadas!");
    } else {
      toast.error("Erro ao salvar: " + error);
    }
    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-slate-500">Buscando dados da instituição...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações da Instituição</h1>
          <p className="text-slate-500 text-sm">Personalize a identidade visual e as regras de acesso.</p>
        </div>
        <SettingsIcon className="h-8 w-8 text-slate-300" />
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GlobeIcon className="h-5 w-5 text-blue-500" />
              Identidade Básica
            </CardTitle>
            <CardDescription>Informações principais da instituição.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Instituição</Label>
              <Input 
                id="name" 
                value={institution?.name || ""} 
                onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domínio customizado</Label>
              <Input 
                id="domain" 
                value={institution?.domain || ""} 
                onChange={(e) => setInstitution({ ...institution, domain: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">URL do Logotipo</Label>
              <Input 
                id="logo" 
                value={institution?.logo_url || ""} 
                onChange={(e) => setInstitution({ ...institution, logo_url: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PaletteIcon className="h-5 w-5 text-purple-500" />
              Personalização Visual
            </CardTitle>
            <CardDescription>Cores da marca no portal do aluno.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primary" 
                    type="color" 
                    className="w-12 p-1 cursor-pointer" 
                    value={institution?.brand_colors?.primary || "#000000"} 
                    onChange={(e) => setInstitution({ 
                      ...institution, 
                      brand_colors: { ...institution.brand_colors, primary: e.target.value } 
                    })}
                  />
                  <Input 
                    value={institution?.brand_colors?.primary || "#000000"} 
                    readOnly
                    className="font-mono text-xs" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input 
                    id="secondary" 
                    type="color" 
                    className="w-12 p-1 cursor-pointer" 
                    value={institution?.brand_colors?.secondary || "#ffffff"} 
                    onChange={(e) => setInstitution({ 
                      ...institution, 
                      brand_colors: { ...institution.brand_colors, secondary: e.target.value } 
                    })}
                  />
                  <Input 
                    value={institution?.brand_colors?.secondary || "#ffffff"} 
                    readOnly
                    className="font-mono text-xs" 
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 mt-4" disabled={isSaving}>
              {isSaving ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
