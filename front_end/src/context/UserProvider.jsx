// - Import Dependencies
import React, { createContext, useState } from "react";

// - Import Services
import { loginUser } from "../api/users";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // ================== States ==================

  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================== Functions ==================
  const login = async (data) => {
    try {
      const response = await loginUser(data);
      if (response.redirectToVerification) {
        return `/2fa?token=${response.uniqueToken}`;
      }
      setUser(response);
      setError(null);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // - Logout function
  const logout = () => {
    setUser({});
  };

  // ================== Effects ==================

  return (
    <UserContext.Provider value={{ login, logout, user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
