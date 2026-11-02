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
  id?: string;
}

export interface CreateTaskResponse {
  success: boolean;
  message: string;
  data: TaskData;
}

export interface TaskListResponse {
  success: boolean;
  data: TaskData[];
}

export interface DeleteTaskResponse {
  success: boolean
  message: string
}


export interface TaskData {
  id: string;
  list_id: string;
  list_name: string;
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  priority: string;
  reminder: string;
  status: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  reminder_name: string;
}

export interface StatusResponse {
  success: boolean;
  message: string;
  data: StatusData;
}

export interface StatusData {
  id: string;
  status: string;
  is_completed: boolean;
  updated_at: string;
}

export const createUpdateTask = async (payload: taskPayload) => {
  const response = await axiosInstance.post<CreateTaskResponse>(
    API_ENDPOINTS.task.createupdateTask,
    payload,
  );
  return response.data;
};

export const listAllTask = async (date: string) => {
  const response = await axiosInstance.get<TaskListResponse>(
    API_ENDPOINTS.task.listAllTask,
    {
      params: {
        date,
      },
    },
  );
  return response.data;
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  const url = `${API_ENDPOINTS.task.status}${taskId}/status`;
  const response = await axiosInstance.patch<StatusResponse>(url, {
    status: status,
  });
  return response.data;
};
export const deleteTask = async (taskId: string, ) => {
  const url = `${API_ENDPOINTS.task.deleteTask}${taskId}`;
  const response = await axiosInstance.delete<DeleteTaskResponse>(url);
  return response.data;
};
