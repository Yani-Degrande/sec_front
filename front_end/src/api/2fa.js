// ========== Users API ==========
// This file contains the API calls for the users

// === Imports ===

//import axios
import axios from "axios";

// === Constants ===
const baseUrl = `${process.env.REACT_APP_API_URL}/2fa`;

// === Functions ===

// - Login
export const verify = async (credentials) => {
  const response = await axios.post(`${baseUrl}/verify`, credentials);
  return response.data;
};

export const deleteUniqueToken = async (credentials) => {
  const response = await axios.post(`${baseUrl}/delete`, credentials);
  return response.data;
};

export const verifyPasswordReset = async (credentials) => {
  const response = await axios.post(
    `${baseUrl}/verify-password-reset`,
    credentials
  );
  return response.data;
};
