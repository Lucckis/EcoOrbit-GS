import type { UsuarioResponse } from "@/services/api";
import { setAuthToken } from "@/services/axiosInstance";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  user: UsuarioResponse | null;
  setToken: (token: string) => void;
  setUser: (user: UsuarioResponse) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {},
  clearAuth: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<UsuarioResponse | null>(null);

  const setToken = (t: string) => {
    setTokenState(t);
    setAuthToken(t);
  };

  const setUser = (u: UsuarioResponse) => setUserState(u);

  const clearAuth = () => {
    setTokenState(null);
    setUserState(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setToken,
        setUser,
        clearAuth,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
