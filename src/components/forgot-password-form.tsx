"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="border-none shadow-xl shadow-blue-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">Verifique seu E-mail</CardTitle>
            <CardDescription className="text-blue-600 font-medium">Instruções enviadas com sucesso!</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Enviamos um link de recuperação para o e-mail informado. 
              Por favor, verifique sua caixa de entrada e a pasta de spam.
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/login">Voltar ao Login</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-xl shadow-blue-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">Recuperar Senha</CardTitle>
            <CardDescription>
              Informe seu e-mail para receber as instruções de recuperação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    required
                    className="h-11 border-slate-200 focus-visible:ring-blue-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-xs text-red-600 font-medium">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-200" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar instruções"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-slate-500">
                Já possui uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 font-semibold hover:underline underline-offset-4"
                >
                  Fazer login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
