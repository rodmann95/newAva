"use server";

import { createClient } from "@/lib/supabase/server";
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

  // 2. Check if there are passed attempts for ALL modules
  const { data: passedAttempts } = await supabase
    .from("quiz_attempts")
    .select("module_id")
    .eq("user_id", user.id)
    .eq("passed", true)
    .in("module_id", modules.map(m => m.id));

  const uniquePassedModules = new Set(passedAttempts?.map(a => a.module_id));
  const isEligible = uniquePassedModules.size === modules.length;

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

  // Create new certificate
  const verificationCode = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const { data, error } = await supabase
    .from("certificates")
    .insert({
      user_id: user.id,
      course_id: courseId,
      institution_id: profile?.institution_id,
      verification_code: verificationCode
    })
    .select()
    .single();

  if (error) return { error: error.message };
  
  revalidatePath("/dashboard");
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
      courses ( title )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data, error: null };
}

/**
 * Fetches all certificates for admin view
 */
export async function getAllCertificates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certificates")
    .select(`
      *,
      courses ( title ),
      profiles:user_id ( full_name )
    `)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data, error: null };
}
