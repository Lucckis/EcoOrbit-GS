import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { theme } = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 2,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
