import { OpeningTypes } from "../types/openingTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/opening";

const OpeningAPI = {
  getData: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/openings/`),

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
};

export default OpeningAPI;
