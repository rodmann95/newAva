"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboardIcon, 
  BookOpenIcon, 
  BarChart3Icon, 
  UsersIcon, 
  ArrowLeftIcon,
  GraduationCapIcon,
  SettingsIcon,
  AwardIcon,
  LandmarkIcon
} from "lucide-react";

const navigation = [
  { name: "Visão Geral", href: "/admin", icon: LayoutDashboardIcon },
  { name: "Cursos", href: "/admin/courses", icon: BookOpenIcon },
  { name: "Instituições", href: "/admin/institutions", icon: LandmarkIcon },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3Icon },
  { name: "Usuários", href: "/admin/users", icon: UsersIcon },
  { name: "Certificados", href: "/admin/certificates", icon: AwardIcon },
  { name: "Configurações", href: "/admin/settings", icon: SettingsIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4 h-full">
      <div className="flex h-16 shrink-0 items-center gap-2">
        <GraduationCapIcon className="h-8 w-8 text-blue-600" />
        <span className="font-bold text-xl tracking-tight">AVA <span className="text-blue-600">Gestor</span></span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:text-blue-600 hover:bg-slate-50",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600",
                          "h-6 w-6 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-400 uppercase tracking-wider">Ações Rápidas</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                >
                  <ArrowLeftIcon className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-blue-600" />
                  Voltar ao Portal Aluno
                </Link>
              </li>
            </ul>
          </li>
          <li className="mt-auto">
            <div className="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-slate-900 border-t border-slate-100">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                GE
              </div>
              <span aria-hidden="true">Gabrielle Elias</span>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
