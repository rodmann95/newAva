"use client";

import { useEffect, useState } from "react";
import { getUsers, updateUserRole, updateUserInstitution } from "@/features/admin/user-actions";
import { getInstitutions } from "@/features/institutions/actions";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [usersRes, instRes] = await Promise.all([
      getUsers(),
      getInstitutions()
    ]);
    
    if (usersRes.data) setUsers(usersRes.data);
    if (instRes.data) setInstitutions(instRes.data);
    
    if (usersRes.error) toast.error("Falha ao carregar usuários");
    setIsLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await updateUserRole(userId, newRole);
    if (!error) {
      toast.success("Cargo atualizado");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleInstitutionChange = async (userId: string, instId: string) => {
    const { error } = await updateUserInstitution(userId, instId);
    if (!error) {
      toast.success("Instituição atualizada");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, institution_id: instId } : u));
    } else {
      toast.error("Erro: " + error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return <Badge className="bg-red-100 text-red-700 border-none uppercase text-[10px]">Admin</Badge>;
      case "professor": return <Badge className="bg-blue-100 text-blue-700 border-none uppercase text-[10px]">Prof</Badge>;
      default: return <Badge variant="secondary" className="uppercase text-[10px]">Aluno</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Usuários</h1>
          <p className="text-slate-500 text-sm">Gerencie o acesso e o vínculo com as prefeituras.</p>
        </div>
        <UsersIcon className="h-8 w-8 text-slate-300" />
      </div>

      <Card className="border-none shadow-sm overflow-hidden text-sm">
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
                  <TableHead>Vínculo (Prefeitura)</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || "Sem nome"}
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={user.institution_id || undefined} 
                        onValueChange={(val) => handleInstitutionChange(user.id, val)}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Sem Instituição" />
                        </SelectTrigger>
                        <SelectContent>
                          {institutions.map(i => (
                            <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-right">
                      <Select 
                        defaultValue={user.role} 
                        onValueChange={(val) => handleRoleChange(user.id, val)}
                      >
                        <SelectTrigger className="w-[100px] h-8 ml-auto text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Aluno</SelectItem>
                          <SelectItem value="professor">Prof</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                      Nenhum usuário encontrado.
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
