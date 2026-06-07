import type { UsuarioResponse } from "@/services/api";
import { setAuthToken } from "@/services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "@eco_token";
const USER_KEY = "@eco_user";

interface AuthContextType {
  token: string | null;
  user: UsuarioResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: UsuarioResponse) => void;
  clearAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setToken: () => {},
  setUser: () => {},
  clearAuth: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<UsuarioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (storedToken) {
          setTokenState(storedToken);
          setAuthToken(storedToken);
        }
        if (storedUser) {
          setUserState(JSON.parse(storedUser) as UsuarioResponse);
        }
      } catch (err) {
        console.warn("[AuthContext] Falha ao ler AsyncStorage:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setToken = (t: string) => {
    setTokenState(t);
    setAuthToken(t);
    AsyncStorage.setItem(TOKEN_KEY, t).catch((e) =>
      console.warn("[AuthContext] Falha ao salvar token:", e),
    );
  };

  const setUser = (u: UsuarioResponse) => {
    setUserState(u);
    AsyncStorage.setItem(USER_KEY, JSON.stringify(u)).catch((e) =>
      console.warn("[AuthContext] Falha ao salvar user:", e),
    );
  };

  const clearAuth = async () => {
    setTokenState(null);
    setUserState(null);
    setAuthToken(null);
    await Promise.allSettled([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        isAuthenticated: !!token,
        setToken,
        setUser,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
