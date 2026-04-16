"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={logout} 
      className="text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2 w-full sm:w-auto justify-start"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  );
}
