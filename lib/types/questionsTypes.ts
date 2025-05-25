export type QuestionsTypes = {
  id: number;
  questionType: number;
  questionContent: string;
  applicablePositions: string;
  timeLimit: number;
  questionlevel: string;
  status: string;
};

export type FetchQuestionTypes = {
  question_type_id: number;
  question: string;
  company_id: number;
  position: string;
  time_allowed: number;
  difficulty: string;
  valid: string;
};
