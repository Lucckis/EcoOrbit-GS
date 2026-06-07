import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

interface ProfileAvatarProps {
  nome: string;
  role: string;
  email: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  USER: "Usuário",
  ROLE_ADMIN: "Admin",
  ROLE_USER: "Usuário",
};

export function ProfileAvatar({ nome, role, email }: ProfileAvatarProps) {
  const { colors } = useTheme();
  const initials = getInitials(nome);
  const roleLabel = ROLE_LABELS[role] ?? role;

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: colors.primary }]}>
        <Text style={styles.initials}>{initials}</Text>
      </View>

      <Text style={[styles.nome, { color: colors.text }]}>{nome}</Text>

      <Text style={[styles.email, { color: colors.textSecondary }]}>
        {email}
      </Text>

      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.primary + "22",
            borderColor: colors.primaryLight + "60",
          },
        ]}
      >
        <Text style={[styles.badgeText, { color: colors.primary }]}>
          {roleLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 28 },
  circle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  initials: { fontSize: 34, fontWeight: "800", color: "#FFF" },
  nome: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  email: { fontSize: 14, marginBottom: 12 },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 13, fontWeight: "600" },
});
