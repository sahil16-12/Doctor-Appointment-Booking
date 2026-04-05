const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7168/api";

import { store } from "../store";

/**
 * Get authentication token from Redux store
 */
const getAuthToken = () => {
  return store.getState().auth.token;
};

/**
 * Generic API fetch wrapper
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 API Request: ${options.method || "GET"} ${fullUrl}`);
  console.log("📦 Request Options:", { ...options, headers });
  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  console.log(`📊 Response Status: ${response.status}`);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    console.error(`❌ API Error: ${response.status}`, error);
    throw new Error(
      error.Message || error.message || `HTTP ${response.status}`,
    );
  }

  const data = await response.json();
  console.log(`✅ Response Data:`, data);
  return data;
};

/**
 * Auth API calls
 */
export const authAPI = {
  login: async (credentials) => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  signup: async (data) => {
    return apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    // Client-side logout: clear auth state and session storage
    // Backend logout is not required as JWT tokens are stateless
    return true;
  },
};

/**
 * Patient API calls
 */
export const patientAPI = {
  getProfile: async () => {
    return apiFetch("/patient/profile", {
      method: "GET",
    });
  },

  updateProfile: async (data) => {
    return apiFetch("/patient/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

/**
 * Appointment API calls
 */
export const appointmentAPI = {
  // Patient endpoints
  getAvailableDoctors: async () => {
    return apiFetch("/appointments/doctors/available", {
      method: "GET",
    });
  },

  getAvailableSlots: async (doctorUserId, clinicId = null) => {
    const query = new URLSearchParams();

    if (doctorUserId) {
      query.append("doctorUserId", doctorUserId);
    }
    if (clinicId) {
      query.append("clinicId", clinicId);
    }

    const endpoint = `/appointments/slots/available${query.toString() ? `?${query}` : ""}`;

    return apiFetch(endpoint, {
      method: "GET",
    });
  },

  createAppointment: async (data) => {
    return apiFetch("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Doctor endpoints
  getPendingAppointments: async () => {
    return apiFetch("/appointments/pending", {
      method: "GET",
    });
  },

  getApprovedAppointments: async () => {
    return apiFetch("/appointments/approved", {
      method: "GET",
    });
  },

  getDeclinedAppointments: async () => {
    return apiFetch("/appointments/declined", {
      method: "GET",
    });
  },

  getCancelledAppointments: async () => {
    return apiFetch("/appointments/cancelled", {
      method: "GET",
    });
  },

  getCompletedAppointments: async () => {
    return apiFetch("/appointments/completed", {
      method: "GET",
    });
  },

  decideAppointment: async (appointmentId, data) => {
    return apiFetch(`/appointments/${appointmentId}/decision`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  cancelAppointment: async (appointmentId, data) => {
    return apiFetch(`/appointments/${appointmentId}/cancel`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  completeAppointment: async (appointmentId, data) => {
    return apiFetch(`/appointments/${appointmentId}/complete`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  createSlot: async (data) => {
    return apiFetch("/appointments/doctor/slots", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getDoctorSlots: async (clinicId = null, includeBooked = true) => {
    const query = new URLSearchParams({
      includeBooked,
      ...(clinicId && { clinicId }),
    });
    return apiFetch(`/appointments/doctor/slots?${query}`, {
      method: "GET",
    });
  },

  deleteSlot: async (slotId) => {
    return apiFetch(`/appointments/doctor/slots/${slotId}`, {
      method: "DELETE",
    });
  },

  // Prescription endpoints
  createPrescription: async (data) => {
    return apiFetch("/prescriptions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getPrescriptions: async () => {
    return apiFetch("/prescriptions", {
      method: "GET",
    });
  },

  getPrescriptionById: async (prescriptionId) => {
    return apiFetch(`/prescriptions/${prescriptionId}`, {
      method: "GET",
    });
  },

  updatePrescription: async (prescriptionId, data) => {
    return apiFetch(`/prescriptions/${prescriptionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deletePrescription: async (prescriptionId) => {
    return apiFetch(`/prescriptions/${prescriptionId}`, {
      method: "DELETE",
    });
  },
};

/**
 * Medical Documents API calls
 */
export const medicalDocumentAPI = {
  // Patient endpoints
  uploadDocument: async (formData) => {
    const token = store.getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/medicaldocuments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new Error(
        error.Message || error.message || `HTTP ${response.status}`,
      );
    }

    return response.json();
  },

  getMyDocuments: async () => {
    return apiFetch("/medicaldocuments/patient/my-documents", {
      method: "GET",
    });
  },

  getPatientDocuments: async (patientUserId) => {
    return apiFetch(`/medicaldocuments/patient/${patientUserId}`, {
      method: "GET",
    });
  },

  downloadDocument: async (documentId) => {
    const token = store.getState().auth.token;
    const response = await fetch(
      `${API_BASE_URL}/medicaldocuments/${documentId}/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Download failed");
    }

    return response;
  },

  deleteDocument: async (documentId) => {
    return apiFetch(`/medicaldocuments/${documentId}`, {
      method: "DELETE",
    });
  },
};

/**
 * Payment API calls
 */
export const paymentAPI = {
  getConfig: async () => {
    return apiFetch("/payments/config", {
      method: "GET",
    });
  },

  createPaymentIntent: async (data) => {
    return apiFetch("/payments/create-intent", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  confirmPayment: async (data) => {
    return apiFetch("/payments/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getPaymentByAppointment: async (appointmentId) => {
    return apiFetch(`/payments/appointment/${appointmentId}`, {
      method: "GET",
    });
  },

  getMyPayments: async () => {
    return apiFetch("/payments/my-payments", {
      method: "GET",
    });
  },

  refundPayment: async (appointmentId, reason) => {
    return apiFetch(`/payments/refund/${appointmentId}`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
};

/**
 * Doctor API calls
 */
export const doctorAPI = {
  getProfile: async () => {
    return apiFetch("/doctor/profile", {
      method: "GET",
    });
  },

  updateProfile: async (data) => {
    return apiFetch("/doctor/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getAppointments: async (status = null) => {
    const query = new URLSearchParams();
    if (status) {
      query.append("status", status);
    }
    const endpoint = `/doctor/appointments${query.toString() ? `?${query}` : ""}`;
    return apiFetch(endpoint, {
      method: "GET",
    });
  },

  getPatients: async () => {
    return apiFetch("/doctor/patients", {
      method: "GET",
    });
  },

  getEarnings: async () => {
    return apiFetch("/doctor/earnings", {
      method: "GET",
    });
  },

  // Clinic Management
  createClinic: async (data) => {
    return apiFetch("/doctor/clinic", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getClinics: async () => {
    return apiFetch("/doctor/clinics", {
      method: "GET",
    });
  },

  // Schedule management
  getSchedule: async () => {
    return apiFetch("/doctor/schedule", {
      method: "GET",
    });
  },

  updateSchedule: async (data) => {
    return apiFetch("/doctor/schedule", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
