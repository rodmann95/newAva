"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { revalidatePath } from "next/cache";

/**
 * Checks if the user is eligible for a certificate and generates it if so
 */
export async function getCertificateEligibility(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { eligible: false };

  // 1. Get all modules for this course
  const { data: modules } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", courseId);

  if (!modules || modules.length === 0) return { eligible: false };

  // Check if there are ANY passed attempts for ANY module in this course
  const { data: passedAttempts } = await supabase
    .from("quiz_attempts")
    .select("module_id")
    .eq("user_id", user.id)
    .eq("passed", true)
    .in("module_id", modules.map(m => m.id));

  // Simplified rule: If the student has passed at least ONE quiz in the course
  // OR if there are no modules/quizzes (though usually there should be)
  const isEligible = (passedAttempts && passedAttempts.length > 0) || modules.length === 0;

  return { eligible: isEligible };
}

/**
 * Generates a public verification code and returns certificate data
 */
export async function issueCertificate(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { eligible } = await getCertificateEligibility(courseId);
  if (!eligible) return { error: "Curso ainda não concluído" };

  // Check if already issued
  const { data: existing } = await supabase
    .from("certificates")
    .select("*")
    .match({ user_id: user.id, course_id: courseId })
    .single();

  if (existing) return { data: existing };

  // Get institution_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("institution_id")
    .eq("id", user.id)
    .single();

  // Create or get existing certificate using upsert with the unique constraint
  const verificationCode = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const { data, error } = await supabase
    .from("certificates")
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        institution_id: profile?.institution_id,
        verification_code: verificationCode
      },
      { 
        onConflict: 'user_id,course_id',
        ignoreDuplicates: false // We want to get the data back even if it exists
      }
    )
    .select(`
      *,
      institutions ( name )
    `)
    .single();

  if (error) {
    console.error("Erro ao emitir certificado:", error);
    return { error: "Erro ao registrar certificado no banco de dados." };
  }
  
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/certificates");
  return { data };
}

/**
 * Fetches all certificates for the current user
 */
export async function getStudentCertificates() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Não autenticado" };

  const { data, error } = await supabase
    .from("certificates")
    .select(`
      *,
      courses ( title ),
      institutions ( name )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getStudentCertificates] Error:", error);
    return { data: [], error: error.message };
  }
  return { data, error: null };
}

/**
 * Fetches all certificates for admin view.
 * Uses the service role client to bypass RLS entirely.
 */
export async function getAllCertificates() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("certificates")
      .select(`
        *,
        courses ( title ),
        profiles ( full_name ),
        institutions ( name )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getAllCertificates] Error:", error.code, error.message, error.details);
      return { data: [], error: error.message };
    }
    return { data, error: null };
  } catch (err: any) {
    console.error("[getAllCertificates] Client error:", err.message);
    return { data: [], error: err.message };
  }
}
