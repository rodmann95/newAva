import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsIcon, SaveIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações da Instituição</h1>
          <p className="text-slate-500 text-sm">Personalize a identidade visual e as regras da sua prefeitura.</p>
        </div>
        <SettingsIcon className="h-8 w-8 text-slate-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>Configure como os alunos veem a plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Plataforma</Label>
              <Input id="name" defaultValue="AVA GovTech" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">URL da Logomarca (PNG/SVG)</Label>
              <Input id="logo" placeholder="https://exemplo.com/logo.png" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input id="primary" type="color" className="w-12 p-1" defaultValue="#2563eb" />
                  <Input defaultValue="#2563eb" className="font-mono text-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input id="secondary" type="color" className="w-12 p-1" defaultValue="#64748b" />
                  <Input defaultValue="#64748b" className="font-mono text-xs" />
                </div>
              </div>
            </div>
            <Button className="w-full gap-2">
              <SaveIcon className="h-4 w-4" />
              Salvar Alterações Visual
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Certificação & Provas</CardTitle>
            <CardDescription>Regras globais para emissão de certificados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="min-score">Nota Mínima para Aprovação (%)</Label>
              <Input id="min-score" type="number" defaultValue="70" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attempts">Limite de Tentativas por Prova</Label>
              <Input id="attempts" type="number" defaultValue="3" />
            </div>
            <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100 italic">
               Dica: Notas acima de 70% aumentam a credibilidade da certificação pública.
            </div>
            <Button variant="outline" className="w-full gap-2 border-slate-200">
              <SaveIcon className="h-4 w-4" />
              Atualizar Regras Educacionais
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
