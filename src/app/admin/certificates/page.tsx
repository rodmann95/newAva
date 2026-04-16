"use client";

import { useEffect, useState } from "react";
import { getAllCertificates } from "@/features/certificates/actions";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AwardIcon, Loader2Icon, ExternalLinkIcon, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    const { data, error } = await getAllCertificates();
    if (data) setCertificates(data);
    if (error) toast.error("Falha ao carregar certificados");
    setIsLoading(false);
  };

  const filtered = certificates.filter(cert => 
    (cert.profiles?.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (cert.courses?.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (cert.verification_code?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificados Emitidos</h1>
          <p className="text-slate-500 text-sm">Visualize e gerencie todos os certificados conquistados pelos alunos.</p>
        </div>
        
        <div className="relative w-full sm:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <Input 
             placeholder="Filtrar por aluno, curso ou código..." 
             className="pl-9 h-10"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden text-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle>Histórico de Conclusões</CardTitle>
          <CardDescription>
            Exibindo {filtered.length} registro(s) encontrados.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-slate-500">Buscando certificados...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Código de Verificação</TableHead>
                    <TableHead>Data de Emissão</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {cert.profiles?.full_name || "Usuário desconhecido"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {cert.courses?.title}
                        </TableCell>
                        <TableCell className="font-mono text-[10px] text-blue-600">
                          {cert.verification_code}
                        </TableCell>
                        <TableCell className="text-slate-500 text-[10px]">
                          {new Date(cert.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 gap-2 text-[10px] sm:text-xs">
                            <ExternalLinkIcon className="h-3 w-3" />
                            Visualizar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                        Nenhum certificado corresponde aos filtros aplicados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
