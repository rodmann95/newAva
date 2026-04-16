export default function DebugPage() {
  const envs = {
    URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "CONFIGURADO (Válido)" : "FALTANDO",
    KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "CONFIGURADO (Válido)" : "FALTANDO",
    NODE_ENV: process.env.NODE_ENV,
  };

  return (
    <div className="p-10 font-sans space-y-6">
      <h1 className="text-2xl font-bold">Diagnóstico de Ambiente (Server Side)</h1>
      <pre className="bg-slate-100 p-6 rounded-lg text-sm border">
        {JSON.stringify(envs, null, 2)}
      </pre>
      <div className="space-y-2">
        <p className="text-sm text-slate-600">
          Nota: Se URL ou KEY estiverem "FALTANDO", o Supabase não irá autenticar ou buscar dados.
        </p>
      </div>
    </div>
  );
}
