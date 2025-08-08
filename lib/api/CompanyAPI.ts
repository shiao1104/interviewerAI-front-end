import { CompanyTypes } from "../types/companyTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/company";

const CompanyAPI = {
  getData: (company_id?: number): Promise<Response<never>> =>
    API.get(`${BASE_URL}/companies/${company_id ? `${company_id}/` : ""}`),

  create: (data: CompanyTypes[]): Promise<Response<never>> =>
    API.post(`${BASE_URL}/create/`, data),

  update: (data: CompanyTypes): Promise<Response<never>> =>
    API.put(`${BASE_URL}/companies/${data.company_id}/`, data),

  getIndustryList: (): Promise<Response<never>> =>
    API.get(`${BASE_URL}/industries/`),
};

export default CompanyAPI;
