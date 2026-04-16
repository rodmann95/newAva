"use client";

import { useEffect, useState } from "react";
import { getInstitutions, createInstitution } from "@/features/institutions/actions";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandmarkIcon, Loader2Icon, PlusIcon, GlobeIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";

export default function InstitutionsManagementPage() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
      setIsOpen(false);
      fetchInstitutions();
    } else {
      toast.error("Erro ao criar: " + error);
    }
    setIsCreating(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Instituições</h1>
          <p className="text-slate-500 text-sm">Gerencie todas as prefeituras e organizações da plataforma.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Nova Instituição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Instituição</DialogTitle>
              <DialogDescription>
                Adicione uma nova prefeitura ou organização ao sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Instituição</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Prefeitura de São Paulo" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={isCreating || !newName}>
                {isCreating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Confirmar Cadastro"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-sm font-medium">Instituições Ativas</CardTitle>
          <CardDescription>
            Total de {institutions.length} instituições cadastradas.
          </CardDescription>
        </CardHeader>
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
                  <TableHead>Identificador (ID)</TableHead>
                  <TableHead>Data de Criação</TableHead>
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
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(inst.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
                {institutions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                      Nenhuma instituição encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
