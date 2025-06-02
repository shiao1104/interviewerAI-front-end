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
    API.post(`/api/send-email/`, data)

};

export default UserAPI;
