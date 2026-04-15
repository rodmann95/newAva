import { getCourseWithDetails } from "@/features/courses/actions";
import { CourseEditor } from "@/features/courses/components/CourseEditor";
import { PublishToggle } from "@/features/courses/components/PublishToggle";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CourseEditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseEditorPage({ params }: CourseEditorPageProps) {
  const { id } = await params;
  const { data: course, error } = await getCourseWithDetails(id);

  if (!course || error) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/courses">
              <ChevronLeftIcon className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground">Editor de Conteúdo e Estrutura</p>
          </div>
        </div>
        <PublishToggle courseId={course.id} isPublished={course.is_published ?? false} />
      </div>

      <CourseEditor course={course} />
    </div>
  );
}
