export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    resendOtp: "/auth/resend-otp",
    verifyOtp: "/auth/verify-otp",
    refresh: "/auth/refresh",
    sessions: "/auth/sessions",
    otherSessions: "/auth/sessions/others",
    session: (sessionId: string) => `/auth/sessions/${sessionId}`,
  },
  list: {
    listAll: '/lists',
    listById: '/lists/',
    createList: '/lists',
  },
  task: {
    createupdateTask: '/tasks/create-update',
    listAllTask: '/tasks/list',
    singleTask: '/tasks/',
    deleteTask: '/tasks/'
  }
} as const;
