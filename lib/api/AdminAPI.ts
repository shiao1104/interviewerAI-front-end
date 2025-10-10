import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/user/admin/users/";

type UpdateType = {
    username: string;
    email: string;
    firstname: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
}

const AdminAPI = {
    getData: (): Promise<Response<never>> =>
        API.get(`${BASE_URL}`),

    getRecord: (id?: string): Promise<Response<never>> =>
        API.get(`${BASE_URL}${id}/`),

    delete: (id: string): Promise<Response<never>> =>
        API.delete(`${BASE_URL}${id}/`),

    update: (id: string, data: UpdateType): Promise<Response<never>> =>
        API.put(`${BASE_URL}${id}/`, data),

    create: (data: UpdateType): Promise<Response<never>> =>
        API.post(`${BASE_URL}`, data),
};

export default AdminAPI;
