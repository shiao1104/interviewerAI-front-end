import { CompanyTypes } from "../types/companyTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/company";

const CompanyAPI = {
  getData: (company_id?: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/companies/${company_id ? `${company_id}/` : ""}`),

  create: (data: CompanyTypes[]): Promise<Response<never>> =>
    API.post(`${BASE_URL}/companies/`, data),

  update: (data: CompanyTypes, id: number): Promise<Response<never>> =>
    API.put(`${BASE_URL}/companies/${id}/`, data),

  getIndustryList: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/industries/`),

  delete: (company_id: number): Promise<Response<never>> =>
    API.delete(`${BASE_URL}/companies/${company_id}/`),
};

export default CompanyAPI;
