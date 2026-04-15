export type Question = {
  id: string;
  module_id: string;
  text: string;
  options?: Option[];
};

export type Option = {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  passed: boolean;
  attempt_number: number;
  created_at: string;
};

export type Certificate = {
  id: string;
  user_id: string;
  course_id: string;
  verification_code: string;
  issued_at: string;
};
