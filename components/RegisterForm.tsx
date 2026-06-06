import { useTheme } from "@/context/ThemeContext";
import { register } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppButton } from "./AppButton";
import { AppInput } from "./AppInput";

export function RegisterForm() {
  const { colors } = useTheme();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
    confirmar?: string;
  }>({});

  const registerMutation = useMutation({
    mutationFn: register,
  });

  const validate = (): boolean => {
    const errs: typeof fieldErrors = {};
    if (!nome.trim()) errs.nome = "Informe seu nome";
    if (!email.trim()) errs.email = "Informe seu email";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email inválido";
    if (!senha) errs.senha = "Informe uma senha";
    else if (senha.length < 6) errs.senha = "Mínimo 6 caracteres";
    if (!confirmar) errs.confirmar = "Confirme sua senha";
    else if (confirmar !== senha) errs.confirmar = "As senhas não coincidem";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    registerMutation.reset();
    registerMutation.mutate({ nome, email, senha });
  };

  const clearError = (field: keyof typeof fieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const apiErrorMsg = registerMutation.isError
    ? (registerMutation.error as Error).message.includes("409") ||
      (registerMutation.error as Error).message.includes("400")
      ? "Este email já está cadastrado."
      : "Não foi possível criar a conta. Tente novamente."
    : null;

  if (registerMutation.isSuccess) {
    return (
      <View style={styles.successContainer}>
        <View
          style={[
            styles.successCircle,
            { backgroundColor: colors.primary + "22" },
          ]}
        >
          <Text style={styles.successEmoji}>✅</Text>
        </View>
        <Text style={[styles.successTitle, { color: colors.text }]}>
          Conta criada!
        </Text>
        <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
          Agora faça login com suas credenciais para começar a monitorar.
        </Text>
        <AppButton
          title="Ir para o Login"
          onPress={() => router.replace("../(auth)")}
          icon="log-in-outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Criar conta</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Junte-se ao EcoOrbit e monitore o planeta
      </Text>

      <AppInput
        label="Nome completo"
        value={nome}
        onChangeText={(v) => {
          setNome(v);
          clearError("nome");
        }}
        placeholder="Seu nome"
        leftIcon="person-outline"
        autoCapitalize="words"
        error={fieldErrors.nome}
      />
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
        placeholder="Mínimo 6 caracteres"
        leftIcon="lock-closed-outline"
        secureToggle
        error={fieldErrors.senha}
      />
      <AppInput
        label="Confirmar senha"
        value={confirmar}
        onChangeText={(v) => {
          setConfirmar(v);
          clearError("confirmar");
        }}
        placeholder="Repita a senha"
        leftIcon="shield-checkmark-outline"
        secureToggle
        error={fieldErrors.confirmar}
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
        title="Criar Conta"
        onPress={handleSubmit}
        loading={registerMutation.isPending}
        icon="person-add-outline"
      />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Já tem uma conta?{"  "}
        </Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={[styles.footerLink, { color: colors.primary }]}>
            Fazer login
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
    marginBottom: 24,
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
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
  },
  successContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: "center",
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successEmoji: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 32,
  },
});
