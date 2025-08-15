export type QuestionsTypes = {
  question_type: number;
  question: string;
  time_allowed: number;
  difficulty: string;
};

export type QuestionDataType = {
  company_id?: number | string;
  question_type_detail: { question_type_id: number | string };
  question: string;
  time_allowed: number;
  difficulty: string;
  valid: boolean;
};

export type FetchQuestionTypes = {
  question_type: number;
  question: string;
  time_allowed: number;
  difficulty: string;
};
