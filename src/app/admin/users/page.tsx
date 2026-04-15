"use client";

import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "@/features/admin/user-actions";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await getUsers();
    if (data) setUsers(data);
    if (error) toast.error("Falha ao carregar usuários");
    setIsLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await updateUserRole(userId, newRole);
    if (!error) {
      toast.success("Cargo atualizado com sucesso");
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      toast.error("Erro ao atualizar cargo: " + error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none uppercase text-[10px]">Admin</Badge>;
      case "professor": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none uppercase text-[10px]">Professor</Badge>;
      case "manager": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none uppercase text-[10px]">Gestor</Badge>;
      default: return <Badge variant="secondary" className="uppercase text-[10px]">Aluno</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Usuários</h1>
          <p className="text-slate-500 text-sm">Gerencie o acesso e os cargos da sua instituição.</p>
        </div>
        <UsersIcon className="h-8 w-8 text-slate-300" />
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle>Colaboradores e Alunos</CardTitle>
          <CardDescription>
            Defina quem pode gerenciar cursos, ver analytics ou apenas estudar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-slate-500">Buscando perfis...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px]">Nome Completo</TableHead>
                  <TableHead>Cargo Atual</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || "Usuário sem nome"}
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {new Date(user.updated_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select 
                          defaultValue={user.role} 
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8 ml-auto text-xs">
                            <SelectValue placeholder="Mudar cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Aluno</SelectItem>
                            <SelectItem value="professor">Professor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
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
