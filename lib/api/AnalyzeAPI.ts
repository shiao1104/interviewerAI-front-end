import { CompanyTypes } from "../types/companyTypes";
import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/analyze";

const AnalyzeAPI = {
  uploadMedia: (formData: FormData): Promise<Response<any>> =>
    API.post(`${BASE_URL}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

};

export default AnalyzeAPI;
