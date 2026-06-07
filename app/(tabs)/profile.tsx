import { EditProfileModal } from "@/components/EditProfileModal";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { deleteUsuario, getUsuarioById } from "@/services/api";
import { getErrorMessage } from "@/services/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, clearAuth } = useAuth();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const userQuery = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUsuarioById(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutos
    initialData: user ?? undefined,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUsuario(user!.id),
    onSuccess: () => {
      clearAuth();
      router.replace("/(auth)");
    },
    onError: (err) => {
      Alert.alert("Erro ao excluir", getErrorMessage(err), [{ text: "OK" }]);
    },
  });

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: clearAuth },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir conta",
      "Esta ação é irreversível. Todos os seus dados serão removidos permanentemente.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteMutation.mutate(),
        },
      ],
    );
  };

  if (userQuery.isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando perfil...
        </Text>
      </View>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color={colors.textMuted}
        />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Erro ao carregar perfil
        </Text>
        <Text style={[styles.errorSub, { color: colors.textSecondary }]}>
          {getErrorMessage(userQuery.error)}
        </Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          onPress={() => userQuery.refetch()}
        >
          <Text style={styles.retryBtnText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentUser = userQuery.data;

  return (
    <>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.heroSection,
            { backgroundColor: colors.heroBackground },
          ]}
        >
          <ProfileAvatar
            nome={currentUser.nome}
            email={currentUser.email}
            role={currentUser.role}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Informações da conta
          </Text>

          <InfoCard
            icon="person-outline"
            label="Nome"
            value={currentUser.nome}
          />
          <InfoCard
            icon="mail-outline"
            label="Email"
            value={currentUser.email}
          />
          <InfoCard
            icon="shield-outline"
            label="Perfil de acesso"
            value={currentUser.role}
          />
          <InfoCard
            icon="key-outline"
            label="ID da conta"
            value={String(currentUser.id)}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Conta
          </Text>

          <ActionRow
            icon="create-outline"
            label="Editar perfil"
            onPress={() => setEditOpen(true)}
          />
          <ActionRow
            icon="log-out-outline"
            label="Sair da conta"
            onPress={handleLogout}
          />
        </View>

        <View
          style={[styles.dangerSection, { borderColor: colors.accent + "40" }]}
        >
          <Text style={[styles.dangerLabel, { color: colors.accent }]}>
            Zona de perigo
          </Text>
          <TouchableOpacity
            style={[
              styles.deleteBtn,
              {
                borderColor: colors.accent + "60",
                backgroundColor: colors.accent + "10",
              },
            ]}
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
            activeOpacity={0.75}
          >
            {deleteMutation.isPending ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Ionicons name="trash-outline" size={18} color={colors.accent} />
            )}
            <Text style={[styles.deleteBtnText, { color: colors.accent }]}>
              {deleteMutation.isPending
                ? "Excluindo..."
                : "Excluir minha conta"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>

      <EditProfileModal
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        user={currentUser}
      />
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.infoCard,
        { backgroundColor: colors.surface, borderColor: colors.cardBorder },
      ]}
    >
      <View
        style={[
          styles.infoIconWrap,
          { backgroundColor: colors.primary + "18" },
        ]}
      >
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.actionRow,
        { backgroundColor: colors.surface, borderColor: colors.cardBorder },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.infoIconWrap,
          { backgroundColor: colors.primary + "18" },
        ]}
      >
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },
  heroSection: { paddingBottom: 8 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  infoText: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: { fontSize: 15, fontWeight: "600" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: "500", marginLeft: 0 },
  dangerSection: {
    marginHorizontal: 16,
    marginTop: 28,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  dangerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deleteBtnText: { fontSize: 14, fontWeight: "600" },
  footer: { height: 20 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  loadingText: { fontSize: 14 },
  errorTitle: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  errorSub: { fontSize: 13, textAlign: "center", lineHeight: 19 },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
