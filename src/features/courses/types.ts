import { Question } from "../assessment/types";

export type Course = {
  id: string;
  institution_id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
};

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  content_type: 'video' | 'pdf' | 'text';
  content_url: string | null;
  content_body: string | null;
  order_index: number;
  created_at: string;
};

export type CourseWithModules = Course & {
  modules: (Module & {
    lessons: Lesson[];
    questions: Question[];
  })[];
};
