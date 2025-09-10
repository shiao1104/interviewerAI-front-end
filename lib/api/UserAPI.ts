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

export interface Profile {
  name: string;
  email: string;
  phone_number: string;
  location: string;
  company: string;
  position: string;
  joinDate: string;       
  avatar_url?: string;    
}

export type MeData = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  role: "面試者" | "管理者";
};


const UserAPI = {
  access: (data: Params): Promise<Response<TokenData>> =>
    API.post(`/user/login/`, data),

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

  // ＝＝＝＝＝＝＝ Profile API ＝＝＝＝＝＝＝

  // 取得個人資料
  getProfile: (): Promise<Response<Profile>> =>
    API.get(`/user/profile/`),

  // 更新個人資料（文字欄位）
  updateProfile: (data: Partial<Profile>): Promise<Response<Profile>> =>
    API.put(`/user/profile/`, data),

  // 上傳頭像
  uploadAvatar: (file: File): Promise<Response<{ avatar_url: string }>> => {
    const fd = new FormData();
    fd.append("avatar", file);
    return API.post(`/user/profile/avatar/`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  me: (): Promise<Response<MeData>> => API.get(`/user/me/`),
};

export default UserAPI;
