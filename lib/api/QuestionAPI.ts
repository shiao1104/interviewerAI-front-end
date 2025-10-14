import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/question";

const QuestionAPI = {
  getData: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/questions/`),

  getRecord: (question_id?: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/questions/${question_id}/`),

  create: (data: any): Promise<Response<never>> =>
    API.post(`${BASE_URL}/questions/`, data),

  delete: (question_id: number): Promise<Response<never>> =>
    API.delete(`${BASE_URL}/questions/${question_id}/`),

  update: (question_id: number, data: any): Promise<Response<never>> =>
    API.put(`${BASE_URL}/questions/${question_id}/`, data),

  getQuestionType: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/types/`),

  getOpeningJobs: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/opening-jobs/`),
};

export default QuestionAPI;
