"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("COURSE ERROR:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-6">
      <h2 className="text-2xl font-bold text-red-600">Erro Interno Detectado!</h2>
      <div className="bg-red-50 text-red-900 p-4 rounded-md max-w-lg text-left overflow-auto border border-red-200">
        <p className="font-mono text-sm break-all font-semibold break-words">
          Message: {error.message || "Erro desconhecido"}
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-red-700 mt-2">
            Digest: {error.digest}
          </p>
        )}
      </div>
      <p className="text-slate-600 max-w-md">
        Isso geralmente significa que a aplicação na nuvem não está conseguindo acessar o banco de dados (Variáveis de Ambiente do Supabase faltando no Heroku) ou que o conteúdo deste curso está quebrado.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
