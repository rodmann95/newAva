"use client";

import { AuthButton } from "./auth-button";
import { GraduationCapIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6 h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <GraduationCapIcon className="h-8 w-8 text-blue-600" />
          <span className="tracking-tight text-lg sm:text-xl">AVA <span className="text-blue-600">GovTech</span></span>
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
        <div className="md:hidden flex items-center gap-2">
           <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                 <Button variant="ghost" size="icon">
                    <MenuIcon className="h-6 w-6" />
                 </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-12">
                 <div className="flex flex-col gap-4">
                    <Link href="/" onClick={() => setOpen(false)} className="text-lg font-semibold border-b pb-2">Início</Link>
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="text-lg font-semibold border-b pb-2">Meus Cursos</Link>
                    <div className="pt-4" onClick={() => setOpen(false)}>
                       <AuthButton />
                    </div>
                 </div>
              </SheetContent>
           </Sheet>
        </div>
      </div>
    </nav>
  );
}
