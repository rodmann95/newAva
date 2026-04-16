import { Navbar } from "@/components/navbar";
import { GraduationCapIcon, ShieldCheckIcon, BarChart3Icon } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = profile?.role === "admin" || profile?.role === "professor" || profile?.role === "master";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section - A cara do nosso sistema */}
      <div className="max-w-5xl mx-auto pt-20 pb-16 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          Capacitação Digital para o <br />
          <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Ensino</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Plataforma completa para gestão de cursos, avaliações automáticas e certificação com validade jurídica para municípios e instituições.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href={user ? "/dashboard" : "/auth/login"} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 transition-all hover:scale-105"
          >
            Acessar Meu Painel
          </Link>
          <Link 
            href={isAdmin ? "/admin" : "/auth/login"} 
            className="bg-white border-2 border-slate-200 hover:border-blue-600 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all"
          >
            Área do Gestor
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
            <GraduationCapIcon className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-3">Ambiente do Aluno</h3>
          <p className="text-slate-600">Player focado, progresso em tempo real e material didático integrado.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
            <ShieldCheckIcon className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-3">Certificação Segura</h3>
          <p className="text-slate-600">Geração de certificados em PDF com QR Code de verificação pública.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
            <BarChart3Icon className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-3">Analytics para Gestores</h3>
          <p className="text-slate-600">Dashboard de BI com mapa de calor e alertas de desempenho ("Luz Vermelha").</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center">
        <p className="text-sm">© 2026 Plataforma SkillHub AVA - Desenvolvido para Gestão Educacional Moderna.</p>
      </footer>
    </main>
  );
}
