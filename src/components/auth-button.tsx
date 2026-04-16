import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    let isStaff = false;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
        
      isStaff = profile?.role === "admin" || profile?.role === "professor";
    }

    return user ? (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-xs sm:text-sm font-medium text-slate-700 truncate max-w-[150px] sm:max-w-none">
             {user.email}
          </span>
          {isStaff ? (
            <Button asChild size="sm" variant="outline" className="h-7 text-[10px] sm:text-xs text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
              <Link href="/admin">Painel Gestor</Link>
            </Button>
          ) : (
            <span className="hidden sm:inline-block text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase tracking-tighter w-fit">
              Perfil Aluno
            </span>
          )}
        </div>
        <div className="w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-none">
          <LogoutButton />
        </div>
      </div>
    ) : (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  } catch (error) {
    console.error("AuthButton error:", error);
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Entrar</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Registrar</Link>
        </Button>
      </div>
    );
  }
}
