"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Course, Module, Lesson, CourseWithModules } from "./types";

/**
 * Gets the current user's profile to retrieve the institution_id
 */
async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
    
  return profile;
}

/**
 * Fetches all courses for the current user's institution
 */
export async function getCourses(): Promise<{ data: Course[] | null; error: string | null }> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  
  if (!profile?.institution_id) {
    return { data: null, error: "Usuário não vinculado a uma instituição." };
  }
  
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("institution_id", profile.institution_id)
    .order("created_at", { ascending: false });
    
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/**
 * Creates a new course
 */
export async function createCourse(title: string, description: string) {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  
  if (!profile?.institution_id) {
    return { data: null, error: "Permissão negada." };
  }
  
  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      description,
      institution_id: profile.institution_id,
      is_published: false
    })
    .select()
    .single();
    
  if (error) return { data: null, error: error.message };
  
  revalidatePath("/admin/courses");
  return { data, error: null };
}

/**
 * Updates an existing course
 */
export async function updateCourse(id: string, updates: Partial<Course>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
    
  if (error) return { data: null, error: error.message };
  
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
  return { data, error: null };
}

/**
 * Fetches a course with its modules and lessons
 */
export async function getCourseWithDetails(id: string): Promise<{ data: CourseWithModules | null; error: string | null }> {
  const supabase = await createClient();
  
  console.log(`[COURSE_DEBUG] Fetching course with manual assembly: ${id}`);
  
  // 1. Fetch the main course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
    
  if (courseError) {
    console.error(`[COURSE_DEBUG] Error fetching course ${id}:`, courseError.message);
    return { data: null, error: courseError.message };
  }

  // 2. Fetch the modules
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", id)
    .order("order_index", { ascending: true });

  if (modulesError) {
    console.warn(`[COURSE_DEBUG] Error fetching modules:`, modulesError.message);
  }

  // 3. Fetch lessons for these modules
  const moduleIds = modules?.map(m => m.id) || [];
  let lessons: any[] = [];
  let questions: any[] = [];

  if (moduleIds.length > 0) {
    const { data: lessonsData } = await supabase
      .from("lessons")
      .select("*")
      .in("module_id", moduleIds)
      .order("order_index", { ascending: true });
    
    lessons = lessonsData || [];

    const { data: questionsData } = await supabase
      .from("questions")
      .select("*, options(*)")
      .in("module_id", moduleIds);
    
    questions = questionsData || [];
  }

  // 4. Assemble the CourseWithModules object
  const fullCourse: CourseWithModules = {
    ...course,
    modules: (modules || []).map(mod => ({
      ...mod,
      lessons: lessons.filter(l => l.module_id === mod.id),
      questions: questions.filter(q => q.module_id === mod.id)
    }))
  };

  console.log(`[COURSE_DEBUG] Successfully assembled course: ${fullCourse.title}`);
  return { data: fullCourse, error: null };
}

/**
 * Creates a new module in a course
 */
export async function createModule(courseId: string, title: string, orderIndex: number) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("modules")
    .insert({
      course_id: courseId,
      title,
      order_index: orderIndex
    })
    .select()
    .single();
    
  if (error) return { data: null, error: error.message };
  
  revalidatePath(`/admin/courses/${courseId}`);
  return { data, error: null };
}

/**
 * Updates a module's information
 */
export async function updateModule(id: string, updates: Partial<Module>, courseId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("modules")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
    
  if (error) return { data: null, error: error.message };
  
  revalidatePath(`/admin/courses/${courseId}`);
  return { data, error: null };
}

/**
 * Deletes a module
 */
export async function deleteModule(id: string, courseId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("modules")
    .delete()
    .eq("id", id);
    
  if (error) return { error: error.message };
  
  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}

/**
 * Creates a new lesson in a module
 */
export async function createLesson(moduleId: string, courseId: string, payload: Partial<Lesson>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      title: payload.title,
      content_type: payload.content_type || 'video',
      content_url: payload.content_url,
      content_body: payload.content_body,
      order_index: payload.order_index || 0
    })
    .select()
    .single();
    
  if (error) return { data: null, error: error.message };
  
  revalidatePath(`/admin/courses/${courseId}`);
  return { data, error: null };
}

/**
 * Deletes a lesson
 */
export async function deleteLesson(id: string, courseId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", id);
    
  if (error) return { error: error.message };
  
  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}
