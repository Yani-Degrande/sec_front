// - Import Dependencies
import React, { createContext, useEffect, useState } from "react";

// - Import Services
import { verify, deleteUniqueToken, verifyPasswordReset } from "../api/2fa";

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

  const verifyPasswordResetCode = async ({ code, jwtToken }) => {
    try {
      setLoading(true);
      await verifyPasswordReset({ code, jwtToken });
      setError(null);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // ================== Effects ==================

  // Clear error messages after 60 seconds
  useEffect(() => {
    // Set a timeout to clear error messages after 60 seconds (60000 milliseconds)
    const timeoutId = setTimeout(() => {
      setError([]);
    }, 60000);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        error,
        deleteToken,
        verifyCode,
        verifyPasswordResetCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
