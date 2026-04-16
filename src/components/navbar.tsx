import { AuthButton } from "./auth-button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { MobileNav } from "./mobile-nav";

export function Navbar() {
  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6 h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="tracking-tight text-lg sm:text-xl">SkillHub <span className="text-blue-600">AVA</span></span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
           <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">Início</Link>
           <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600 transition-colors">Meus Cursos</Link>
          <Suspense fallback={<div className="h-8 w-20 bg-slate-100 animate-pulse rounded-md" />}>
            <AuthButton />
          </Suspense>
        </div>

        {/* Mobile Nav */}
        <Suspense fallback={<div className="md:hidden h-8 w-8 bg-slate-100 animate-pulse rounded-md" />}>
           <MobileNavWrapper />
        </Suspense>
      </div>
    </nav>
  );
}

async function MobileNavWrapper() {
  return <MobileNav authButton={<AuthButton />} />;
}
