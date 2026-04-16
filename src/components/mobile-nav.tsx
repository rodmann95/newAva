"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

interface MobileNavProps {
  authButton: React.ReactNode;
}

export function MobileNav({ authButton }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 pt-12">
          <div className="flex flex-col gap-4">
            <Link href="/dashboard" onClick={() => setOpen(false)} className="text-lg font-semibold border-b pb-2">
              Meu Painel
            </Link>
            <Link href="/dashboard/courses" onClick={() => setOpen(false)} className="text-lg font-semibold border-b pb-2">
              Meus Cursos
            </Link>
            <Link href="/dashboard/catalog" onClick={() => setOpen(false)} className="text-lg font-semibold border-b pb-2">
              Cursos Disponíveis
            </Link>
            <Link href="/dashboard/certificates" onClick={() => setOpen(false)} className="text-lg font-semibold border-b pb-2">
              Meus Certificados
            </Link>
            <div className="pt-4" onClick={() => setOpen(false)}>
              {authButton}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
