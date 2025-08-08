import API from "./api";
import { Response } from "@/lib/types/requestType";

interface Params {
  username: string;
  password: string;
}

export type TokenData = {
  access: string;
  refresh: string;
};

const UserAPI = {
  access: (data: Params): Promise<Response<TokenData>> =>
    API.post(`/api/token/`, data),

  test: (): Promise<Response<unknown>> => API.post(`/test/fetch/`),

  test2: (): Promise<Response<unknown>> => API.post(`/gpt/evaluate/`),

  sendVerificationCode: (data: { to_email: string, subject: string, message: string }): Promise<Response<unknown>> =>
    API.post(`/user/send-email/`, data),

  verifyEmail: (data: { email: string; code: string }): Promise<Response<unknown>> =>
    API.post(`/user/verify-email/`, data),


  register: (data: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    verification_code?: string;
  }): Promise<Response<unknown>> =>
    API.post(`/user/register/`, data),
};

export default UserAPI;
