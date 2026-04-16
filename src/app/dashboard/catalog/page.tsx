import { getAvailableCourses } from "@/features/courses/student-actions";
import { Navbar } from "@/components/navbar";
import { Suspense } from "react";
import { PlusIcon, SearchIcon, Loader2 } from "lucide-react";
import { CourseCatalogList } from "./catalog-list";

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <PlusIcon className="h-8 w-8 text-blue-600" />
            Cursos Disponíveis
          </h1>
          <p className="text-slate-500 mt-2">
            Explore novas capacitações e inscreva-se para expandir seus conhecimentos.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        }>
          <CatalogDataWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function CatalogDataWrapper() {
  const { data: courses, error } = await getAvailableCourses();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
        Erro ao carregar catálogo: {error}
      </div>
    );
  }

  return <CourseCatalogList courses={courses || []} />;
}
