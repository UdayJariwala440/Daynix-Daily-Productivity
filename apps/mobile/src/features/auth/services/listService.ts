import { API_ENDPOINTS, axiosInstance } from "@/services"

interface createList{
  name: string
  color: string
  sub_color: string
id?: string;
}

export interface listAllResponse {
  success: boolean
  data: listData[]
}


interface createListResponse {
  success: boolean
  message: string
  data: listData
}

export interface listData {
  id: string
  name: string
  color: string
  sub_color: string
  created_at: string
  updated_at: string
}


export const getListAll = async() =>{
    const response = await axiosInstance.get<listAllResponse>(API_ENDPOINTS.list.listAll);
    return response.data
}



export const createList = async(payload:createList) =>{
    const response = await axiosInstance.post<createListResponse>(API_ENDPOINTS.list.createList,payload);
    return response.data
}