"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Course, CourseWithModules } from "./types";

/**
 * Fetches courses published in the institution that the student is NOT enrolled in
 */
export async function getAvailableCourses() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { data: [], error: "Sessão inválida. Logue novamente." };

    // Fetch student's institution
    const { data: profile } = await supabase
      .from("profiles")
      .select("institution_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.institution_id) return { data: [], error: "Sua conta ainda não foi vinculada a uma instituição." };

    // Fetch enrolled course IDs to exclude them from the catalog
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", user.id);
    
    const enrolledIds = (enrollments || [])
      .map(e => e.course_id)
      .filter(id => id !== null);

    // Fetch published courses in the user's institution
    let query = supabase
      .from("courses")
      .select("*")
      .eq("institution_id", profile.institution_id)
      .eq("is_published", true);
    
    if (enrolledIds.length > 0) {
      query = query.not("id", "in", `(${enrolledIds.join(',')})`);
    }

    const { data: availableCourses, error } = await query.order("created_at", { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: availableCourses || [], error: null };
  } catch (err: any) {
    console.error("Critical error in getAvailableCourses:", err);
    return { data: [], error: "Erro interno ao buscar cursos." };
  }
}

/**
 * Fetches a course with its modules and lessons for public preview (no enrollment required)
 */
export async function getCourseCurriculum(courseId: string) {
  const supabase = await createClient();

  // Course info
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .eq("is_published", true)
    .single();

  if (courseError || !course) return { data: null, error: "Curso não encontrado." };

  // Modules
  const { data: modules } = await supabase
    .from("modules")
    .select("id, title, order_index")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  // Lessons for all modules
  const moduleIds = modules?.map(m => m.id) || [];
  let lessons: any[] = [];

  if (moduleIds.length > 0) {
    const { data: lessonsData } = await supabase
      .from("lessons")
      .select("id, title, content_type, module_id, order_index")
      .in("module_id", moduleIds)
      .order("order_index", { ascending: true });
    lessons = lessonsData || [];
  }

  const curriculum = (modules || []).map(mod => ({
    ...mod,
    lessons: lessons.filter(l => l.module_id === mod.id),
  }));

  return { data: { course, curriculum }, error: null };
}


/**
 * Gets courses the student is enrolled in, including progress calculation
 */
export async function getStudentDashboard() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { data: [], error: "Usuário não autenticado." };

    // Fetch enrolled courses and their total lesson counts vs completed count
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        course_id,
        courses:course_id (
          id,
          title,
          description
        )
      `)
      .eq("user_id", user.id);

    if (error) return { data: [], error: error.message };

    // Calculate progress for each course
    const coursesWithProgress = await Promise.all(
      (data || [])
        .filter((item: any) => item && item.courses) // Pular matrículas sem curso correspondente
        .map(async (item: any) => {
          const course = item.courses;
          
          try {
            // 1. Get module IDs for this course
            const { data: modules } = await supabase
              .from("modules")
              .select("id")
              .eq("course_id", course.id);
              
            const moduleIds = (modules || []).map(m => m.id);

            let totalLessons = 0;
            let completedLessons = 0;

            if (moduleIds.length > 0) {
              // Get total lessons in this course
              const { count: tLessons } = await supabase
                .from("lessons")
                .select("id", { count: "exact", head: true })
                .in("module_id", moduleIds);
                
              totalLessons = tLessons || 0;

              // Get lessons IDs for this course
              const { data: lessons } = await supabase
                .from("lessons")
                .select("id")
                .in("module_id", moduleIds);
                
              const lessonIds = (lessons || []).map(l => l.id);

              if (lessonIds.length > 0) {
                // Get completed lessons by this user
                const { count: cLessons } = await supabase
                  .from("lesson_progress")
                  .select("id", { count: "exact", head: true })
                  .eq("user_id", user.id)
                  .in("lesson_id", lessonIds);
                  
                completedLessons = cLessons || 0;
              }
            }

            const progress = totalLessons > 0 
              ? Math.round((completedLessons / totalLessons) * 100) 
              : 0;

            return {
              ...course,
              progress
            };
          } catch (e) {
            console.error(`Error calculating progress for course ${course.id}:`, e);
            return { ...course, progress: 0 };
          }
        })
    );

    return { data: coursesWithProgress, error: null };
  } catch (err: any) {
    console.error("Critical error in getStudentDashboard:", err);
    return { data: [], error: "Erro ao processar dashboard." };
  }
}

/**
 * Marks a lesson as completed or removes completion
 */
export async function toggleLessonProgress(lessonId: string, courseId: string, completed: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Não autenticado" };

  if (completed) {
    const { error } = await supabase
      .from("lesson_progress")
      .upsert({ user_id: user.id, lesson_id: lessonId });
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .match({ user_id: user.id, lesson_id: lessonId });
    if (error) return { error: error.message };
  }

  revalidatePath(`/courses/${courseId}/player`);
  revalidatePath("/dashboard");
  return { error: null };
}

/**
 * Enrolls a user in a course
 */
export async function enrollInCourse(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("institution_id")
    .eq("id", user.id)
    .single();

  if (!profile?.institution_id) return { error: "Instituição não encontrada" };

  const { error } = await supabase
    .from("enrollments")
    .insert({
      user_id: user.id,
      course_id: courseId,
      institution_id: profile.institution_id
    });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

/**
 * Gets student profile with institution name
 */
export async function getStudentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null };

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      institutions ( name )
    `)
    .eq("id", user.id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
