import { getStudentCertificates } from "@/features/certificates/actions";
import { getStudentProfile } from "@/features/courses/student-actions";
import { Navbar } from "@/components/navbar";
import { Suspense } from "react";
import { Award, Loader2 } from "lucide-react";
import { CertificatesList } from "./certificates-list";

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Award className="h-8 w-8 text-yellow-600" />
            Meus Certificados
          </h1>
          <p className="text-slate-500 mt-2">
            Acesse e faça o download de suas conquistas acadêmicas.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        }>
          <CertificatesDataWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function CertificatesDataWrapper() {
  const [certsResponse, profileResponse] = await Promise.all([
    getStudentCertificates(),
    getStudentProfile()
  ]);

  if (certsResponse.error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
        Erro ao carregar certificados: {certsResponse.error}
      </div>
    );
  }

  return (
    <CertificatesList 
      certificates={certsResponse.data || []} 
      userName={profileResponse.data?.full_name || "Aluno"}
    />
  );
}
