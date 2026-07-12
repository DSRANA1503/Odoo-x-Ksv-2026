import axiosClient from "./axiosClient";

export const vehicleService = {
  getAll: () => axiosClient.get("/vehicles"),
  create: (data: any) => axiosClient.post("/vehicles", data),
  update: (id: string, data: any) => axiosClient.put(`/vehicles/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/vehicles/${id}`),
  getDocuments: (id: string) => axiosClient.get(`/vehicles/${id}/documents`),
  uploadDocument: (id: string, formData: FormData) => axiosClient.post(`/vehicles/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const driverService = {
  getAll: () => axiosClient.get("/drivers"),
  create: (data: any) => axiosClient.post("/drivers", data),
  update: (id: string, data: any) => axiosClient.put(`/drivers/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/drivers/${id}`),
};

export const tripService = {
  getAll: () => axiosClient.get("/trips"),
  create: (data: any) => axiosClient.post("/trips", data),
  dispatch: (id: string) => axiosClient.post(`/trips/${id}/dispatch`),
  complete: (id: string, data?: any) => axiosClient.post(`/trips/${id}/complete`, data),
  cancel: (id: string) => axiosClient.post(`/trips/${id}/cancel`),
};

export const maintenanceService = {
  getAll: () => axiosClient.get("/maintenance"),
  create: (data: any) => axiosClient.post("/maintenance", data),
  complete: (id: string) => axiosClient.post(`/maintenance/${id}/complete`),
};

export const financeService = {
  getFuel: () => axiosClient.get("/finance/fuel"),
  getExpenses: () => axiosClient.get("/finance/expense"),
  logFuel: (data: any) => axiosClient.post("/finance/fuel", data),
  logExpense: (data: any) => axiosClient.post("/finance/expense", data),
};

export const analyticsService = {
  getKPIs: (query?: string) => axiosClient.get(`/analytics/kpis${query ? `?${query}` : ''}`),
  getVehicles: () => axiosClient.get("/analytics/vehicles"),
  export: () => axiosClient.get("/analytics/export", { responseType: 'blob' }),
  exportPDF: () => axiosClient.get("/analytics/export/pdf", { responseType: 'blob' }),
  getTripsTrend: (days: number) => axiosClient.get(`/analytics/trips-trend?days=${days}`),
  getRevenueTrend: () => axiosClient.get("/analytics/revenue-trend"),
};

export const authService = {
  login: (data: any) => axiosClient.post("/auth/login", data),
  register: (data: any) => axiosClient.post("/auth/register", data),
};
