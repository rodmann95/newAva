import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenIcon, UsersIcon, AwardIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch some stats
  const { count: coursesCount } = await supabase.from("courses").select("*", { count: 'exact', head: true });
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
  const { count: certificatesCount } = await supabase.from("certificates").select("*", { count: 'exact', head: true });

  const stats = [
    { name: "Total de Cursos", value: coursesCount || 0, icon: BookOpenIcon, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Alunos Ativos", value: usersCount || 0, icon: UsersIcon, color: "text-green-600", bg: "bg-green-100" },
    { name: "Diplomas Gerados", value: certificatesCount || 0, icon: AwardIcon, color: "text-purple-600", bg: "bg-purple-100" },
    { name: "Engajamento Geral", value: "84%", icon: TrendingUpIcon, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visão Geral do Gestor</h1>
        <p className="text-slate-500">Bem-vindo ao centro de controle da capacitação municipal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm overflow-hidden flex items-center p-6 gap-4">
             <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
             </div>
             <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Ações Prioritárias</CardTitle>
            <CardDescription>O que precisa da sua atenção agora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-red-500" />
                   <p className="text-sm font-medium">3 Alunos em curso crítico (Luz Vermelha)</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/analytics">Ver Detalhes</Link>
                </Button>
             </div>
             <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-blue-500" />
                   <p className="text-sm font-medium">Novo curso rascunho aguardando publicação</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/courses">Editar</Link>
                </Button>
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Dica GovTech</CardTitle>
            <CardDescription className="text-slate-400">Maximize o engajamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-300">
              Cursos com vídeos curtos (máx 10min) e questionários frequentes aumentam a taxa de conclusão em até 40% no setor público. 
              Experimente gamificar a próxima trilha de capacitação.
            </p>
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white">
              Ler Guia de Boas Práticas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
