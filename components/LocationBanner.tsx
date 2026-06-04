import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LocationBannerProps {
  latitude: number;
  longitude: number;
  timestamp: Date;
  onClose: () => void;
}

interface DataItemProps {
  label: string;
  value: string;
}

function DataItem({ label, value }: DataItemProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.dataItem}>
      <Text style={[styles.dataLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
      <Text style={[styles.dataValue, { color: colors.bannerText }]}>
        {value}
      </Text>
    </View>
  );
}

export function LocationBanner({
  latitude,
  longitude,
  timestamp,
  onClose,
}: LocationBannerProps) {
  const { colors } = useTheme();

  const formattedDate = timestamp.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = timestamp.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bannerBg,
          borderTopColor: colors.primary,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.headerLabel, { color: colors.bannerAccent }]}>
            Localização Selecionada
          </Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Fechar"
        >
          <Ionicons
            name="close-circle-outline"
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <DataItem label="Latitude" value={`${latitude.toFixed(6)}°`} />
        <DataItem label="Longitude" value={`${longitude.toFixed(6)}°`} />
        <DataItem label="Data" value={formattedDate} />
        <DataItem label="Horário" value={formattedTime} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    columnGap: 0,
  },
  dataItem: {
    width: "50%",
  },
  dataLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "700",
  },
});
