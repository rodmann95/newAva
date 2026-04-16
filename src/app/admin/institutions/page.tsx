"use client";

import { useEffect, useState } from "react";
import { getInstitutions, createInstitution, updateInstitutionSettings } from "@/features/institutions/actions";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LandmarkIcon, 
  Loader2Icon, 
  PlusIcon, 
  Settings2Icon, 
  GlobeIcon, 
  PaletteIcon,
  SaveIcon
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export default function InstitutionsManagementPage() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInst, setSelectedInst] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setIsLoading(true);
    const { data, error } = await getInstitutions();
    if (data) setInstitutions(data);
    if (error) toast.error("Falha ao carregar instituições");
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!newName) return;
    setIsCreating(true);
    const { data, error } = await createInstitution(newName);
    if (!error) {
      toast.success("Instituição criada com sucesso!");
      setNewName("");
      setIsCreateOpen(false);
      fetchInstitutions();
    } else {
      toast.error("Erro ao criar: " + error);
    }
    setIsCreating(false);
  };

  const handleUpdate = async () => {
    if (!selectedInst) return;
    setIsSaving(true);
    const { error } = await updateInstitutionSettings(selectedInst.id, {
      name: selectedInst.name,
      domain: selectedInst.domain,
      logo_url: selectedInst.logo_url,
      brand_colors: selectedInst.brand_colors
    });

    if (!error) {
      toast.success("Configurações atualizadas!");
      setSelectedInst(null);
      fetchInstitutions();
    } else {
      toast.error("Erro ao salvar: " + error);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Instituições</h1>
          <p className="text-slate-500 text-sm">Gerencie todas as organizações e suas identidades visuais.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Nova Instituição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Instituição</DialogTitle>
              <DialogDescription>Adicione uma nova organização ao sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2 text-sm">
                <Label htmlFor="name">Nome da Instituição</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Instituto Federal, Corporativo..." 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={isCreating || !newName}>
                {isCreating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Confirmar Cadastro"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Identificador</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institutions.map((inst) => (
                  <TableRow key={inst.id} className="group">
                    <TableCell className="font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <LandmarkIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        {inst.name}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[10px] text-slate-400">
                      {inst.id}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 text-xs"
                        onClick={() => {
                          let colors = inst.brand_colors || { primary: "#000000", secondary: "#ffffff" };
                          if (typeof colors === 'string') {
                            try { colors = JSON.parse(colors); } catch(e) {}
                          }
                          setSelectedInst({ ...inst, brand_colors: colors });
                        }}
                      >
                        <Settings2Icon className="h-3 w-3" />
                        Configurar Estética
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Sheet (Configurações Unificadas) */}
      <Sheet open={!!selectedInst} onOpenChange={() => setSelectedInst(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle>Configurações: {selectedInst?.name}</SheetTitle>
            <SheetDescription>Personalize a identidade visual desta instituição específica.</SheetDescription>
          </SheetHeader>
          
          <div className="space-y-8 text-sm pb-20">
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-blue-600 border-b pb-2">
                <GlobeIcon className="h-4 w-4" />
                Domínio e Marca
              </h3>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Exibido</Label>
                <Input 
                  id="edit-name" 
                  value={selectedInst?.name || ""} 
                  onChange={(e) => setSelectedInst({ ...selectedInst, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-domain">Domínio Customizado</Label>
                <Input 
                  id="edit-domain" 
                  placeholder="ex: ava.prefeitura.gov.br"
                  value={selectedInst?.domain || ""} 
                  onChange={(e) => setSelectedInst({ ...selectedInst, domain: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-logo">URL do Logotipo</Label>
                <Input 
                  id="edit-logo" 
                  placeholder="https://link-da-imagem.png"
                  value={selectedInst?.logo_url || ""} 
                  onChange={(e) => setSelectedInst({ ...selectedInst, logo_url: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-purple-600 border-b pb-2">
                <PaletteIcon className="h-4 w-4" />
                Paleta de Cores
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-10 h-10 p-1 cursor-pointer" 
                      value={selectedInst?.brand_colors?.primary || "#000000"} 
                      onChange={(e) => setSelectedInst({ 
                        ...selectedInst, 
                        brand_colors: { ...selectedInst.brand_colors, primary: e.target.value } 
                      })}
                    />
                    <Input value={selectedInst?.brand_colors?.primary} className="font-mono text-[10px]" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-10 h-10 p-1 cursor-pointer" 
                      value={selectedInst?.brand_colors?.secondary || "#ffffff"} 
                      onChange={(e) => setSelectedInst({ 
                        ...selectedInst, 
                        brand_colors: { ...selectedInst.brand_colors, secondary: e.target.value } 
                      })}
                    />
                    <Input value={selectedInst?.brand_colors?.secondary} className="font-mono text-[10px]" readOnly />
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full gap-2" size="lg" onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
              Salvar Alterações na Instituição
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
