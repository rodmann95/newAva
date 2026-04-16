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
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

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
       case "master": return <Badge className="bg-purple-100 text-purple-700 border-none uppercase text-[10px]">Master</Badge>;
      default: return <Badge variant="secondary" className="uppercase text-[10px]">Aluno</Badge>;
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Usuários</h1>
          <p className="text-slate-500 text-sm">Gerencie o acesso e o vínculo com as instituições.</p>
        </div>
        <div className="relative w-full sm:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <Input 
             placeholder="Buscar por nome ou email..." 
             className="pl-9 h-10"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden text-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Nome</TableHead>
                    <TableHead className="whitespace-nowrap">Vínculo (Instituição)</TableHead>
                    <TableHead className="whitespace-nowrap">Cargo</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex flex-col">
                            <span>{user.full_name || "Sem nome"}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
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
                      <TableCell className="whitespace-nowrap">{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
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
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                        Nenhum usuário encontrado.
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
