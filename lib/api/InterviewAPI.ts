import { IntervieweeTypes } from "../types/intervieweeTypes";
import { ReportTypes } from "../types/questionsTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/interview/interviews";

type ResultType = {
  interview_result: string,
  interview_datetime?: string,
}

const InterviewAPI = {
  getData: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/`),

  getRecord: (interview_id?: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/${interview_id}/`),

  getAnswers: (interview_id?: number): Promise<Response<ReportTypes>> =>
    API.get(`/interview/interviews/${interview_id}/report/`),

  updateScore: (interview_id: number, question_id: number, data: { human_score: number, human_comments: string }): Promise<Response<never>> =>
    API.patch(`/interview/answers/update/${interview_id}/${question_id}/`, data),

  create: (data: IntervieweeTypes): Promise<Response<never>> =>
    API.post(`${BASE_URL}/`, data),

  update: (interview_id: number, data: IntervieweeTypes): Promise<Response<never>> =>
    API.patch(`${BASE_URL}/${interview_id}/`, data),

  delete: (interview_id: number): Promise<Response<never>> =>
    API.delete(`${BASE_URL}/${interview_id}/`),

  getReportList: (candidate_id: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/${candidate_id}/history/`),

  result: (interview_id: number, data: ResultType): Promise<Response<never>> =>
    API.post(`${BASE_URL}/${interview_id}/result/`, data),
};

export default InterviewAPI;
