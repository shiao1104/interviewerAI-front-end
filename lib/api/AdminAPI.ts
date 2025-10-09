import API from "./api";
import { Response } from "@/lib/types/requestType";

const BASE_URL = "/admin";

const AdminAPI = {
  getData: (): Promise<Response<never>> =>
    API.get(`/user${BASE_URL}/users/`),

};

export default AdminAPI;
