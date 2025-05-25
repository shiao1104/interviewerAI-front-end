import { FetchQuestionTypes } from "../types/questionsTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/company";

const CompanyAPI = {
  getData: (company_id?: number): Promise<Response<never>> =>
    API.post(`${BASE_URL}/read/`, company_id ? { company_id } : {}),

  create: (data: FetchQuestionTypes[]): Promise<Response<never>> =>
    API.post(`${BASE_URL}/create/`, data),

  getQuestionType: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/question-type/`),

  getOpeningJobs: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/opening-jobs/`),
};

export default CompanyAPI;
