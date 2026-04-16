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
import { AwardIcon, Loader2Icon, ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificados Emitidos</h1>
          <p className="text-slate-500 text-sm">Visualize e gerencie todos os certificados conquistados pelos alunos.</p>
        </div>
        <AwardIcon className="h-8 w-8 text-yellow-500/20" />
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle>Histórico de Conclusões</CardTitle>
          <CardDescription>
            Lista de alunos que completaram 100% dos requisitos de um curso.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-slate-500">Buscando certificados...</p>
            </div>
          ) : (
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
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">
                        {cert.profiles?.full_name || "Usuário desconhecido"}
                      </TableCell>
                      <TableCell>
                        {cert.courses?.title}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-blue-600">
                        {cert.verification_code}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {new Date(cert.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs">
                          <ExternalLinkIcon className="h-3 w-3" />
                          Visualizar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                      Nenhum certificado emitido até o momento.
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
