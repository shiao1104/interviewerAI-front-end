import { CompanyTypes } from "../types/companyTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/company";

const CompanyAPI = {
  getData: (company_id?: number): Promise<Response<never>> =>
    API.post(`${BASE_URL}/read/`, company_id ? { company_id } : {}),

  create: (data: CompanyTypes[]): Promise<Response<never>> =>
    API.post(`${BASE_URL}/create/`, data),

  update: (data: CompanyTypes[]): Promise<Response<never>> =>
    API.post(`${BASE_URL}/update/`, data),

  getIndustryList: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/industry/`),
};

export default CompanyAPI;
