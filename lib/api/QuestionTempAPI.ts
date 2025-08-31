import API from "./api";
import { Response } from "@/lib/types/requestType";

const QuestionTempAPI = {
  getQuestion: (interview_id?: number): Promise<Response<never>> =>
    API.get(`/analyze/temp-question/`, { params: { interview_id } }),

  getNextQuestion: (interview_id: number): Promise<Response<never>> =>
    API.get(`/question/temp/${interview_id}/next/`),
};

export default QuestionTempAPI;
