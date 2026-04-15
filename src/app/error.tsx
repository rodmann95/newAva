"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-6">
      <h2 className="text-2xl font-bold text-red-600">Erro fatal na aplicação</h2>
      <div className="bg-red-50 text-red-900 p-4 rounded-md max-w-lg text-left overflow-auto border border-red-200">
        <p className="font-mono text-sm break-all font-semibold break-words">
          Verifique o console do navegador para mais detalhes.
        </p>
        <p className="font-mono text-sm mt-2">{error.message || "Sem mensagem específica"}</p>
        {error.digest && (
          <p className="font-mono text-xs text-red-700 mt-2">
            Digest: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
