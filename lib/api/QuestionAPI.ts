import { QuestionsTypes } from "../types/questionsTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/question";

const QuestionAPI = {
  getData: (question_id?: string): Promise<Response<never>> =>
    API.post(`${BASE_URL}/read/`, question_id ? { question_id } : {}),

  create: (data: QuestionsTypes): Promise<Response<never>> =>
    API.post(`${BASE_URL}/create/`, data),

  getQuestionType: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/question-type/`),

  getOpeningJobs: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/opening-jobs/`),
};

export default QuestionAPI;
