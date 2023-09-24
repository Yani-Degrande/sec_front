// ========== Users API ==========
// This file contains the API calls for the users

// === Imports ===

//import axios
import axios from "axios";

// === Constants ===
const baseUrl = `${process.env.REACT_APP_API_URL}/users`;

// === Functions ===

// - Login
export const login = async (credentials) => {
  console.log("credentials", credentials);
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${baseUrl}/forgot-password`, email);
  return response.data;
};
