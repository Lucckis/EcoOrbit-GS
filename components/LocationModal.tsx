import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LocationModalProps {
  visible: boolean;
  latitude: number;
  longitude: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LocationModal({
  visible,
  latitude,
  longitude,
  onConfirm,
  onCancel,
}: LocationModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: colors.primary + "22" },
            ]}
          >
            <Ionicons name="location" size={30} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            Selecionar Localização?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Deseja salvar este ponto para análise de risco de incêndio?
          </Text>

          <View
            style={[
              styles.coordsBox,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.coordRow}>
              <Text style={[styles.coordLabel, { color: colors.textMuted }]}>
                Latitude
              </Text>
              <Text style={[styles.coordValue, { color: colors.text }]}>
                {latitude.toFixed(6)}°
              </Text>
            </View>
            <View
              style={[styles.coordDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.coordRow}>
              <Text style={[styles.coordLabel, { color: colors.textMuted }]}>
                Longitude
              </Text>
              <Text style={[styles.coordValue, { color: colors.text }]}>
                {longitude.toFixed(6)}°
              </Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnCancel,
                { borderColor: colors.border },
              ]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, { color: colors.textSecondary }]}>
                Não
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnConfirm,
                { backgroundColor: colors.primary },
              ]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Ionicons
                name="checkmark"
                size={16}
                color="#FFF"
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.btnText, { color: "#FFFFFF" }]}>Sim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 18,
  },
  coordsBox: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 22,
  },
  coordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  coordDivider: {
    height: 1,
    marginHorizontal: 14,
  },
  coordLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coordValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancel: {
    borderWidth: 1,
  },
  btnConfirm: {},
  btnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
