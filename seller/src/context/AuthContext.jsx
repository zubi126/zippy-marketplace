import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("sellerUser");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("sellerToken");
  });

  const login = (newToken, newUser) => {
    localStorage.setItem("sellerToken", newToken);
    localStorage.setItem(
      "sellerUser",
      JSON.stringify(newUser)
    );

    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerUser");

    setToken(null);
    setUser(null);
  };

  const isLoggedIn = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}