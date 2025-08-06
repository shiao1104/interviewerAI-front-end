import { FetchQuestionTypes } from "../types/questionsTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/question";

const QuestionAPI = {
  getData: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/questions/`),

  getRecord: (question_id?: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/questions/${question_id}/`),

  create: (data: FetchQuestionTypes[]): Promise<Response<never>> =>
    API.post(`${BASE_URL}/create/`, data),

  getQuestionType: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/types/`),

  getOpeningJobs: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/opening-jobs/`),

  getRandom: (opening_id: number): Promise<Response<never>> =>
    API.post(`${BASE_URL}/start-interview/`, opening_id ? { opening_id } : {}),
};

export default QuestionAPI;
