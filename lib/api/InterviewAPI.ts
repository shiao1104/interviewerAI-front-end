import { IntervieweeTypes } from "../types/intervieweeTypes";
import { QuestionsTypes } from "../types/questionsTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/interview/interviews";

type ResultType = {
  interview_result: string,
  interview_datetime: string,
}

const InterviewAPI = {
  getData: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/`),

  getRecord: (interview_id?: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/${interview_id}/`),

  getAnswers: (interview_id?: number): Promise<Response<QuestionsTypes[]>> =>
    API.get(`/interview/answers/${interview_id}/`),

  create: (data: IntervieweeTypes): Promise<Response<never>> =>
    API.post(`${BASE_URL}/`, data),

  update: (interview_id: number, data: IntervieweeTypes): Promise<Response<never>> =>
    API.patch(`${BASE_URL}/${interview_id}/`, data),

  delete: (interview_id: number): Promise<Response<never>> =>
    API.delete(`${BASE_URL}/${interview_id}/`),

  getAllReport: (interview_id: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/${interview_id}/`),

  result: (interview_id: number, data: ResultType): Promise<Response<never>> =>
    API.post(`${BASE_URL}/${interview_id}/result/`, data),
};

export default InterviewAPI;
