// - Import Dependencies
import React, { createContext, useState } from "react";

// - Import Services
import { verify, deleteUniqueToken } from "../api/2fa";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ================== States ==================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================== Functions ==================

  // - Delete unique token
  const deleteToken = async ({ jwtToken }) => {
    try {
      await deleteUniqueToken({ jwtToken });
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const verifyCode = async ({ code, jwtToken }) => {
    try {
      setLoading(true);
      await verify({ code, jwtToken });
      setError(null);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // ================== Effects ==================

  return (
    <AuthContext.Provider value={{ loading, error, deleteToken, verifyCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
