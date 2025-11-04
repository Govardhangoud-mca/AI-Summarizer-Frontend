import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth";

export interface RegisterData {
  username: string;
  password: string;
  role?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  return axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (data: LoginData) => {
  const response = await axios.post(`${API_URL}/login`, data);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};
