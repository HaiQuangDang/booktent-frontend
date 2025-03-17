import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Interceptor triggered:", error.response?.status);
    const originalRequest = error.config;

     // Skip refresh for login endpoint
    if (originalRequest.url.includes("/user/token/") && !originalRequest.url.includes("refresh")) {
      console.log("Skipping refresh for login request");
      return Promise.reject(error); // Let the 401 pass through
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Attempting token refresh...");
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        console.log("Refresh token:", refresh);
        const res = await axios.post(`${import.meta.env.VITE_API_URL}user/token/refresh/`, { refresh });
        console.log("New access token:", res.data.access);
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        // window.location.href = "/login";
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default api;

export const createStripeCheckoutSession = async (orderId) => {
  try {
    const response = await api.post("/orders/stripe/create-checkout-session/", { order_id: orderId });
    return response.data.url; // Return the Stripe Checkout URL
  } catch (error) {
    console.error("Error creating checkout session:", error.response?.data || error.message);
    return null;
  }
};