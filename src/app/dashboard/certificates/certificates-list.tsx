"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DownloadCertificate } from "@/features/certificates/components/DownloadCertificate";
import { Search, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CertificatesList({ certificates, userName }: { certificates: any[], userName: string }) {
  const [search, setSearch] = useState("");

  const filtered = certificates.filter(cert =>
    cert.courses?.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Filtrar por nome do curso..." 
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((cert: any) => (
            <Card key={cert.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4">
                <CardTitle className="text-sm line-clamp-1">{cert.courses?.title}</CardTitle>
                <CardDescription className="text-[10px]">Emitido em {new Date(cert.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <DownloadCertificate 
                  courseId={cert.course_id} 
                  courseTitle={cert.courses?.title} 
                  userName={userName} 
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 p-20 rounded-2xl text-center space-y-4">
          <Award className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-medium text-slate-900">Nenhum certificado encontrado</h3>
          {search && (
            <Button variant="link" onClick={() => setSearch("")} className="text-blue-600">
              Limpar busca
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
