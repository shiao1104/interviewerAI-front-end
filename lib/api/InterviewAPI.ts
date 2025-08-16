import { IntervieweeTypes } from "../types/intervieweeTypes";
import { QuestionsTypes } from "../types/questionsTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/interview/interviews";

const InterviewAPI = {
  getData: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/`),

  getRecord: (interview_id?: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/${interview_id}/`),

  create: (data: IntervieweeTypes): Promise<Response<never>> =>
    API.post(`${BASE_URL}/`, data),

  delete: (question_id: number): Promise<Response<never>> =>
    API.delete(`${BASE_URL}/questions/${question_id}/`),

  update: (interview_id: number, data: IntervieweeTypes): Promise<Response<never>> =>
    API.put(`${BASE_URL}/${interview_id}/`, data),

  getQuestionType: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/types/`),

  getOpeningJobs: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/opening-jobs/`),

  getRandom: (opening_id: number): Promise<Response<never>> =>
    API.post(`${BASE_URL}/start-interview/`, opening_id ? { opening_id } : {}),
};

export default InterviewAPI;
