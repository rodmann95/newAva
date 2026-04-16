"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Fetch all users with their profile data.
 * This should ideally be a Server Action, but for simplicity in this MVP 
 * we use the client SDK with proper RLS.
 */
export async function getUsers() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      role,
      institution_id,
      updated_at
    `)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Update a user's role.
 */
export async function updateUserRole(userId: string, newRole: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ 
      role: newRole,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);

  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Update a user's institution.
 */
export async function updateUserInstitution(userId: string, institutionId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ 
      institution_id: institutionId,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);

  if (error) return { error: error.message };
  return { error: null };
}
