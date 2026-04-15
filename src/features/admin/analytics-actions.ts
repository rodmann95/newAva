"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Gets the current admin user's institution ID
 */
async function getInstitutionId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("institution_id")
    .eq("id", user.id)
    .single();

  return profile?.institution_id;
}

/**
 * Fetches institutional KPIs for the management dashboard
 */
export async function getInstitutionalStats() {
  const supabase = await createClient();
  const institutionId = await getInstitutionId();
  if (!institutionId) return { error: "Sem permissão" };

  // 1. Total Students
  const { count: totalStudents } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })
    .eq("institution_id", institutionId);

  // 2. Total Enrollments
  const { count: totalEnrollments } = await supabase
    .from("enrollments")
    .select("*", { count: 'exact', head: true })
    .eq("institution_id", institutionId);

  // 3. Certificates Issued
  const { count: certificatesIssued } = await supabase
    .from("certificates")
    .select("*", { count: 'exact', head: true })
    .eq("institution_id", institutionId);

  // 4. Red Light Students (3+ failed attempts in any module)
  const { data: redLightData } = await supabase
    .from("quiz_attempts")
    .select("user_id, passed")
    .filter("user_id", "in", 
      supabase.from("profiles").select("id").eq("institution_id", institutionId)
    );

  const userAttempts = new Map();
  redLightData?.forEach(attempt => {
    if (!userAttempts.has(attempt.user_id)) {
      userAttempts.set(attempt.user_id, { count: 0, passed: false });
    }
    const current = userAttempts.get(attempt.user_id);
    if (attempt.passed) current.passed = true;
    current.count++;
  });

  let redLightCount = 0;
  userAttempts.forEach(val => {
    if (!val.passed && val.count >= 3) redLightCount++;
  });

  return {
    data: {
      totalStudents: totalStudents || 0,
      totalEnrollments: totalEnrollments || 0,
      certificatesIssued: certificatesIssued || 0,
      redLightCount
    }
  };
}

/**
 * Fetches data for the engagement chart (Enrollments per course)
 */
export async function getCourseEngagement() {
  const supabase = await createClient();
  const institutionId = await getInstitutionId();
  if (!institutionId) return { error: "Sem permissão" };

  const { data } = await supabase
    .from("courses")
    .select("title, enrollments(count)")
    .eq("institution_id", institutionId);

  return {
    data: data?.map(c => ({
      name: c.title,
      value: (c as any).enrollments[0]?.count || 0
    }))
  };
}

/**
 * Fetches specific staff members in "Red Light" status for intervention
 */
export async function getRedLightStaff() {
  const supabase = await createClient();
  const institutionId = await getInstitutionId();
  if (!institutionId) return { error: "Sem permissão" };

  // This would ideally be a complex SQL view or RPC in production
  const { data } = await supabase
    .from("quiz_attempts")
    .select(`
      user_id,
      module_id,
      profiles:user_id ( full_name, role ),
      modules:module_id ( title )
    `)
    .eq("passed", false)
    .filter("user_id", "in", 
      supabase.from("profiles").select("id").eq("institution_id", institutionId)
    );

  return { data };
}
