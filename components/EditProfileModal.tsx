import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  updateUsuario,
  type AtualizarUsuarioRequest,
  type UsuarioResponse,
} from "@/services/api";
import { getErrorMessage } from "@/services/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppButton } from "./AppButton";
import { AppInput } from "./AppInput";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: UsuarioResponse;
}

export function EditProfileModal({
  visible,
  onClose,
  user,
}: EditProfileModalProps) {
  const { colors } = useTheme();
  const { setUser } = useAuth();
  const qc = useQueryClient();

  const [nome, setNome] = useState(user.nome);
  const [email, setEmail] = useState(user.email);
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
  }>({});

  useEffect(() => {
    if (visible) {
      setNome(user.nome);
      setEmail(user.email);
      setSenha("");
      setErrors({});
      updateMutation.reset();
    }
  }, [visible]);

  const updateMutation = useMutation({
    mutationFn: (payload: AtualizarUsuarioRequest) =>
      updateUsuario(user.id, payload),
    onSuccess: (updated) => {
      setUser(updated);
      qc.invalidateQueries({ queryKey: ["user", user.id] });
      onClose();
    },
  });

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!nome.trim()) e.nome = "Informe seu nome";
    if (!email.trim()) e.email = "Informe seu email";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Email inválido";
    if (senha && senha.length < 6) e.senha = "Mínimo 6 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload: AtualizarUsuarioRequest = {};
    if (nome.trim() !== user.nome) payload.nome = nome.trim();
    if (email.trim() !== user.email) payload.email = email.trim();
    if (senha) payload.senha = senha;
    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }
    updateMutation.reset();
    updateMutation.mutate(payload);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Editar perfil
              </Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
            >
              <AppInput
                label="Nome completo"
                value={nome}
                onChangeText={(v) => {
                  setNome(v);
                  setErrors((e) => ({ ...e, nome: undefined }));
                }}
                leftIcon="person-outline"
                autoCapitalize="words"
                error={errors.nome}
              />
              <AppInput
                label="Email"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setErrors((e) => ({ ...e, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
                error={errors.email}
              />
              <AppInput
                label="Nova senha (opcional)"
                value={senha}
                onChangeText={(v) => {
                  setSenha(v);
                  setErrors((e) => ({ ...e, senha: undefined }));
                }}
                placeholder="Deixe em branco para manter"
                leftIcon="lock-closed-outline"
                secureToggle
                error={errors.senha}
              />

              {updateMutation.isError && (
                <View
                  style={[
                    styles.errorBanner,
                    {
                      backgroundColor: colors.accent + "18",
                      borderColor: colors.accent + "40",
                    },
                  ]}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color={colors.accent}
                  />
                  <Text style={[styles.errorText, { color: colors.accent }]}>
                    {getErrorMessage(updateMutation.error)}
                  </Text>
                </View>
              )}

              <AppButton
                title="Salvar alterações"
                onPress={handleSave}
                loading={updateMutation.isPending}
                icon="checkmark-outline"
              />
              <AppButton
                title="Cancelar"
                onPress={onClose}
                variant="ghost"
                fullWidth
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: "flex-end" },
  overlay: { flex: 1 },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 32,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  body: { padding: 20, paddingBottom: 8 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: { fontSize: 13, flex: 1 },
});
