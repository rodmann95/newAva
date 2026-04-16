"use server";

import { createClient } from "@/lib/supabase/server";

export async function getInstitutions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("institutions")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updateInstitutionSettings(id: string, updates: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("institutions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
