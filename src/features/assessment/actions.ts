"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Question, Option, QuizAttempt } from "./types";

const PASSING_SCORE = 70;
const MAX_ATTEMPTS = 3;

/**
 * Fetches a randomized quiz for a specific module
 */
export async function getModuleQuiz(moduleId: string, limit: number = 5): Promise<{ data: Question[] | null; error: string | null }> {
  const supabase = await createClient();
  
  // Use RPC or direct query with random shuffle (simple version: fetch all and shuffle here)
  const { data: questions, error } = await supabase
    .from("questions")
    .select(`
      id,
      text,
      options (id, text)
    `)
    .eq("module_id", moduleId);
    
  if (error) return { data: null, error: error.message };
  
  // Shuffle and limit
  const randomized = (questions || [])
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
    
  return { data: randomized as Question[], error: null };
}

/**
 * Checks if a user can attempt a quiz
 */
export async function getRemainingAttempts(moduleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("quiz_attempts")
    .select("*", { count: 'exact', head: true })
    .match({ user_id: user.id, module_id: moduleId });

  return Math.max(0, MAX_ATTEMPTS - (count || 0));
}

/**
 * Submits a quiz attempt and grades it
 */
export async function submitQuizAttempt(
  moduleId: string, 
  answers: { questionId: string, optionId: string }[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  // 1. Fetch correct answers for these questions
  const { data: correctOptions } = await supabase
    .from("options")
    .select("id, question_id")
    .in("question_id", answers.map(a => a.questionId))
    .eq("is_correct", true);

  if (!correctOptions) return { error: "Erro ao validar respostas" };

  // 2. Map correct answers for fast lookup
  const correctMap = new Map(correctOptions.map(o => [o.question_id, o.id]));

  // 3. Calculate score
  let correctCount = 0;
  answers.forEach(ans => {
    if (correctMap.get(ans.questionId) === ans.optionId) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / answers.length) * 100);
  const passed = score >= PASSING_SCORE;

  // 4. Get current attempt number
  const { count: attemptCount } = await supabase
    .from("quiz_attempts")
    .select("*", { count: 'exact', head: true })
    .match({ user_id: user.id, module_id: moduleId });

  const attemptNumber = (attemptCount || 0) + 1;

  // 5. Save attempt
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: user.id,
      module_id: moduleId,
      score,
      passed,
      attempt_number: attemptNumber
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath(`/admin/courses/${moduleId}`); // Might need courseId
  
  return { data, error: null };
}

/**
 * Creates a new question with options
 */
export async function createQuestion(moduleId: string, courseId: string, text: string, options: { text: string, is_correct: boolean }[]) {
  const supabase = await createClient();
  
  console.log(`[QUESTION_DEBUG] Creating question for moduleId: ${moduleId}, courseId: ${courseId}`);

  // Verify module exists first
  const { data: moduleCheck, error: moduleCheckError } = await supabase
    .from("modules")
    .select("id, title")
    .eq("id", moduleId)
    .single();

  console.log(`[QUESTION_DEBUG] Module check:`, moduleCheck, moduleCheckError);

  if (!moduleCheck) {
    return { error: `Módulo não encontrado no banco: ${moduleId}. Erro: ${moduleCheckError?.message}` };
  }
  
  // 1. Insert question
  const { data: question, error: qError } = await supabase
    .from("questions")
    .insert({
      module_id: moduleId,
      text
    })
    .select()
    .single();
    
  if (qError) return { error: qError.message };
  
  // 2. Insert options
  const optionsWithQid = options.map(o => ({
    question_id: question.id,
    text: o.text,
    is_correct: o.is_correct
  }));
  
  const { error: oError } = await supabase
    .from("options")
    .insert(optionsWithQid);
    
  if (oError) return { error: oError.message };
  
  revalidatePath(`/admin/courses/${courseId}`);
  return { data: question, error: null };
}

/**
 * Deletes a question
 */
export async function deleteQuestion(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id);
    
  if (error) return { error: error.message };
  
  revalidatePath(`/admin/courses`);
  return { error: null };
}
