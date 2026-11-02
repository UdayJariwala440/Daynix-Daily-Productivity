import { API_ENDPOINTS, axiosInstance } from "@/services";

export interface taskPayload {
  name: string;
  description: string;
  list_id: string;
  start_date: string;
  start_time: string;
  priority: string;
  reminder: string;
  status: string;
  id?:string
}

export interface CreateTaskResponse {
  success: boolean
  message: string
  data: TaskData
}

export interface TaskListResponse {
  success: boolean
  data: TaskData[]
}

export interface TaskData {
  id: string
  list_id: string
  list_name: string
  name: string
  description: string
  start_date: string
  start_time: string
  priority: string
  reminder: string
  status: string
  is_completed: boolean
  created_at: string
  updated_at: string
  reminder_name: string
}


export const createUpdateTask = async (payload: taskPayload) => {
  const response = await axiosInstance.post<CreateTaskResponse>(
    API_ENDPOINTS.task.createupdateTask,
    payload,
  );
  return response.data;
};
export const listAllTask = async (date:string) => {
  const response = await axiosInstance.get<TaskListResponse>(
    API_ENDPOINTS.task.listAllTask,{
      params:{
        date
      }
    }
  );
  return response.data;
};
