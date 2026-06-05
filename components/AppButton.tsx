import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Variant = "primary" | "outline" | "ghost";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

export function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  icon,
  fullWidth = true,
}: AppButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const configs: Record<Variant, { bg: string; text: string; border: string }> =
    {
      primary: {
        bg: isDisabled ? colors.primaryLight + "70" : colors.primary,
        text: "#FFFFFF",
        border: "transparent",
      },
      outline: {
        bg: "transparent",
        text: colors.primary,
        border: colors.primary,
      },
      ghost: {
        bg: "transparent",
        text: colors.textSecondary,
        border: "transparent",
      },
    };

  const { bg, text, border } = configs[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === "outline" ? 1.5 : 0,
          width: fullWidth ? "100%" : undefined,
          opacity: isDisabled ? 0.75 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator size="small" color={text} />
      ) : (
        <View style={styles.inner}>
          {icon && (
            <Ionicons name={icon} size={18} color={text} style={styles.icon} />
          )}
          <Text style={[styles.label, { color: text }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
