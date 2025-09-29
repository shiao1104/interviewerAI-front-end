import API from "./api";
import { Response } from "@/lib/types/requestType";
import axios from 'axios';

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
  is_staff: boolean;
  is_superuser: boolean;
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


  findUserByEmail: async (email: string) => {
    try {
      // 使用既有的 API instance（會帶上正確的 baseURL），避免打到 3000
      const res: any = await API.get(`/user/find-by-email/`, {
        params: { email },
      });

      // 你的 API instance 可能回的是 data；也可能回完整 response.data
      const data = (res && (res as any).data) ? (res as any).data : res;

      // 同時支援兩種結構：
      // 1) { user: {...} }
      // 2) { result: true, data: { user: {...} } }
      const user =
        (data && (data as any).user) ??
        (data && (data as any).data && (data as any).data.user) ??
        null;

      return user; // 找到→物件；若後端回 200 但 user 為 null → null
    } catch (error: any) {
      // 404（找不到）會進到這裡
      if (error?.response?.status === 404) return null;

      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.message ||
        "未知錯誤";
      console.error("Error finding user by email:", error);
      throw new Error(msg);
    }
  },

  getDjangoJWT: async (email: string) => {
    try {
      const response = await API.post(`/user/google-login/`, { email });
      return response.data;
    } catch (error) {
      console.error("Error during google login:", error);
      throw error;
    }
  },
};

export default UserAPI;
