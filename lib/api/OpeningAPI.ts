import { OpeningTypes } from "../types/openingTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/opening";

const OpeningAPI = {
  getData: (company: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/openings/`, { params: { company } }),

  getRecord: (opening_id: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/openings/${opening_id}/`),

  create: (data: OpeningTypes): Promise<Response<never>> =>
    API.post(`${BASE_URL}/openings/`, data),

  update: (opening_id: number, data: OpeningTypes): Promise<Response<never>> =>
    API.put(`${BASE_URL}/openings/${opening_id}/`, data),

  delete: (opening_id: number): Promise<Response<never>> =>
    API.delete(`${BASE_URL}/openings/${opening_id}/`),

  getQuestionType: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/question-type/`),

  getOpeningJobs: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/opening-jobs/`),

  getRandom: (opening_id: number): Promise<Response<never>> =>
    API.post(`${BASE_URL}/start-interview/`, opening_id ? { opening_id } : {}),

  getMyApplied: (user_id: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/openings/my-applied/`, user_id ? { params: { user_id } } : {}),
};

export default OpeningAPI;
