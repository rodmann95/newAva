import { getCourseWithDetails } from "@/features/courses/actions";
import { CoursePlayer } from "@/features/courses/components/CoursePlayer";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerPage({ params }: PlayerPageProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <PlayerContent params={params} />
      </Suspense>
    </div>
  );
}

async function PlayerContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: course, error } = await getCourseWithDetails(id);

  if (!course || error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold">Conteúdo não encontrado</h2>
      </div>
    );
  }

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id);

  const completedLessonIds = (progress || []).map(p => p.lesson_id);

  return <CoursePlayer course={course} completedLessonIds={completedLessonIds} />;
}
