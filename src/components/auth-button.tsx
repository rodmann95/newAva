import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let isStaff = false;
  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
      
    console.log(`[AUTH_DEBUG] User: ${user.email}, Role: ${profile?.role}, Error: ${error?.message || 'none'}`);
    isStaff = profile?.role === "admin" || profile?.role === "professor";
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-slate-700">Olá, {user.email}!</span>
      {isStaff ? (
        <Button asChild size="sm" variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
          <Link href="/admin">Painel Gestor</Link>
        </Button>
      ) : (
        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase tracking-tighter">Perfil Aluno</span>
      )}
      <LogoutButton />
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
}
