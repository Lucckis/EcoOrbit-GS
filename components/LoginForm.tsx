import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { decodeJwtPayload, getUsuarios, login } from "@/services/api";
import { getErrorMessage } from "@/services/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppButton } from "./AppButton";
import { AppInput } from "./AppInput";

export function LoginForm() {
  const { colors } = useTheme();
  const { setToken, setUser } = useAuth();
  const router = useRouter();

  const [email, setSenhaEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    senha?: string;
  }>({});

  // ── Mutation ────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; senha: string }) => {
      // 1. Faz o login → recebe o token
      const loginData = await login(payload);

      // 2. Sincroniza o token com o interceptor do axios
      setToken(loginData.token);

      // 3. Decodifica o JWT para pegar o email do usuário (campo "sub")
      const jwtPayload = decodeJwtPayload(loginData.token);
      const userEmail = jwtPayload?.sub as string | undefined;

      // 4. Busca lista de usuários e localiza o atual
      if (userEmail) {
        const usuarios = await getUsuarios();
        const found = usuarios.find((u) => u.email === userEmail);
        if (found) setUser(found);
      }

      return loginData;
    },
    onSuccess: () => {
      router.replace("/(tabs)");
    },
  });

  // ── Validação local ──────────────────────────────────────────
  const validate = (): boolean => {
    const errs: typeof fieldErrors = {};
    if (!email.trim()) errs.email = "Informe seu email";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email inválido";
    if (!senha) errs.senha = "Informe sua senha";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    loginMutation.reset();
    loginMutation.mutate({ email: email.trim(), senha });
  };

  const clearError = (f: keyof typeof fieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [f]: undefined }));

  const apiErrorMsg = loginMutation.isError
    ? getErrorMessage(loginMutation.error)
    : null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Bem-vindo de volta
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Faça login para continuar monitorando
      </Text>

      <AppInput
        label="Email"
        value={email}
        onChangeText={(v) => {
          setSenhaEmail(v);
          clearError("email");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="seu@email.com"
        leftIcon="mail-outline"
        error={fieldErrors.email}
      />
      <AppInput
        label="Senha"
        value={senha}
        onChangeText={(v) => {
          setSenha(v);
          clearError("senha");
        }}
        placeholder="••••••••"
        leftIcon="lock-closed-outline"
        secureToggle
        error={fieldErrors.senha}
      />

      {apiErrorMsg && (
        <View
          style={[
            styles.apiBanner,
            {
              backgroundColor: colors.accent + "18",
              borderColor: colors.accent + "50",
            },
          ]}
        >
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={colors.accent}
          />
          <Text style={[styles.apiBannerText, { color: colors.accent }]}>
            {apiErrorMsg}
          </Text>
        </View>
      )}

      <AppButton
        title="Entrar"
        onPress={handleSubmit}
        loading={loginMutation.isPending}
        icon="log-in-outline"
      />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Não tem uma conta?{"  "}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/cadastro")}
          activeOpacity={0.7}
        >
          <Text style={[styles.footerLink, { color: colors.primary }]}>
            Criar conta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 28 },
  apiBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  apiBannerText: { fontSize: 13, flex: 1 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: "700" },
});
