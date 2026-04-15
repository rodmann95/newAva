import { AuthButton } from "./auth-button";
import { GraduationCapIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export function Navbar() {
  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <GraduationCapIcon className="h-8 w-8 text-blue-600" />
          <span className="tracking-tight">AVA <span className="text-blue-600">GovTech</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="h-8 w-20 bg-slate-100 animate-pulse rounded-md" />}>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
