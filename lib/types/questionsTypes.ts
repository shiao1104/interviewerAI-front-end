export interface QuestionDetail {
  question: string;
  question_id?: number;
  question_type?: number;
  question_type_detail: string;
  time_allowed?: string;
  difficulty?: string;
  
}

export interface AnswerType {
  question: number;
  question_detail: QuestionDetail;
  answer_text: string;
  ai_score: number;
  ai_comments: string;
  human_score: number;
  human_comments: string;
  audio_file_path?: string;
  video_file_path?: string;
}

export interface InfoTypes {
  remark?: string;
  interview_id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  interviewDate: string;
  interviewTime: string;
  interview_result: string | null;
  interview_status: string;
  resumeUrl: string;
  candidate_detail?: {
    username: string;
    email: string;
    phone_number: string;
  };
  opening_detail?: {
    opening_name: string;
    company_name?: string;
  };
  interview_datetime?: string;
  total_score?: number;
  score_expression?: number;
  score_attitude?: number;
  score_technical?: number;
  score_collaboration?: number;
  result_abstract?: string;
  scores: {
    overall: number;
    language: number;
    attitude: number;
    technical: number;
    teamwork: number;
  };
  comments: {
    overall: string;
    language: string;
    attitude: string;
    technical: string;
    teamwork: string;
  };
}

export interface ReportTypes {
  answers: AnswerType[];
  interview_info: InfoTypes;
}
