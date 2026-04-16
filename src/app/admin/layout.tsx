import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminMobileNav } from "@/components/admin-mobile-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0 w-72">
        <Suspense fallback={<div className="w-72 bg-white border-r h-full animate-pulse" />}>
          <AdminSidebar />
        </Suspense>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Header Mobile / Admin Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10">
          <div className="flex items-center gap-2">
            <AdminMobileNav />
            <h2 className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider truncate">
              Gestão Municipal
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 p-1 px-3 rounded-full">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Sincronizado
             </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          <Suspense fallback={
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            <AdminGuard>{children}</AdminGuard>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function AdminGuard({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Check user role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAllowed = profile?.role === "admin" || profile?.role === "professor" || profile?.role === "master";

  if (!isAllowed) {
    return redirect("/dashboard");
  }

  return <>{children}</>;
}
