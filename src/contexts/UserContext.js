// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (storedUser && storedToken && userId) {
        try {
          const parsedToken = JSON.parse(storedToken);
          const response = await fetch(
            `https://lotusproject.azurewebsites.net/api/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${parsedToken.accessToken}`,
              },
            }
          );
          if (response.ok) {
            setUser(JSON.parse(storedUser));
            setToken(parsedToken);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Failed to verify user", error);
          logout();
        }
      }
    };

    verifyUser();
  }, []);

  const login = async (loginResponse) => {
    const { tokenDto, id } = loginResponse;
    const firstLogin = !localStorage.getItem("hasLoggedInBefore");

    localStorage.setItem("token", JSON.stringify(tokenDto));
    localStorage.setItem("userId", id);
    if (firstLogin) {
      localStorage.setItem("hasLoggedInBefore", "true");
    }

    try {
      const response = await fetch(
        `https://lotusproject.azurewebsites.net/api/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${tokenDto.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await response.json();
      setUser(userData);
      setToken(tokenDto);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to fetch user details", error);
      logout();
    }

    return firstLogin;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
