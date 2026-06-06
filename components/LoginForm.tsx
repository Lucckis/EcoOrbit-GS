import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { login } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppButton } from "./AppButton";
import { AppInput } from "./AppInput";

export function LoginForm() {
  const { colors } = useTheme();
  const { setToken } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    senha?: string;
  }>({});

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
      router.replace("/(tabs)");
    },
  });

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

  const clearError = (field: keyof typeof fieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const apiErrorMsg = loginMutation.isError
    ? (loginMutation.error as Error).message.includes("401")
      ? "Email ou senha incorretos."
      : "Não foi possível conectar. Tente novamente."
    : null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Bem-vindo de volta
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Faça login para continuar monitorando
      </Text>

      {/* Campos */}
      <AppInput
        label="Email"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
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

      {/* Banner de erro da API */}
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

      {/* Link para cadastro */}
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
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
  },
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
  apiBannerText: {
    fontSize: 13,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});
