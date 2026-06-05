import { useTheme } from "@/context/ThemeContext";
import type { AnalyzeResponse } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LocationBannerProps {
  latitude: number;
  longitude: number;
  timestamp: Date;
  onClose: () => void;
  onRetry?: () => void;
  // Estados da mutation
  isPending?: boolean;
  isError?: boolean;
  result?: AnalyzeResponse;
}

function DataItem({ label, value }: { label: string; value: string }) {
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

function RiskResult({
  result,
  onRetry,
  isError,
}: {
  result?: AnalyzeResponse;
  onRetry?: () => void;
  isError?: boolean;
}) {
  const { colors } = useTheme();

  if (isError) {
    return (
      <View
        style={[
          styles.riskRow,
          {
            backgroundColor: colors.accent + "20",
            borderColor: colors.accent + "40",
          },
        ]}
      >
        <Ionicons name="wifi-outline" size={16} color={colors.accent} />
        <Text style={[styles.riskText, { color: colors.accent, flex: 1 }]}>
          Falha ao consultar a API
        </Text>
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.retryText, { color: colors.accent }]}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!result) return null;

  const confidence = result.confidencePercentage ?? 0;
  const riskColor = !result.fireDetected
    ? colors.primary // verde — seguro
    : confidence >= 70
      ? colors.accent
      : colors.accentOrange;

  const riskIcon: "checkmark-circle" | "warning" | "flame" = result.fireDetected
    ? confidence >= 70
      ? "flame"
      : "warning"
    : "checkmark-circle";

  const riskLabel = result.fireDetected
    ? confidence >= 70
      ? "Risco Alto Detectado"
      : "Risco Moderado"
    : "Área sem Risco";

  return (
    <View
      style={[
        styles.riskRow,
        { backgroundColor: riskColor + "22", borderColor: riskColor + "50" },
      ]}
    >
      <Ionicons name={riskIcon} size={18} color={riskColor} />
      <Text style={[styles.riskText, { color: riskColor, fontWeight: "700" }]}>
        {riskLabel}
      </Text>
      <View
        style={[styles.confidencePill, { backgroundColor: riskColor + "30" }]}
      >
        <Text style={[styles.confidenceText, { color: riskColor }]}>
          {confidence.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}

export function LocationBanner({
  latitude,
  longitude,
  timestamp,
  onClose,
  onRetry,
  isPending,
  isError,
  result,
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
        { backgroundColor: colors.bannerBg, borderTopColor: colors.primary },
      ]}
    >
      {/* Cabeçalho */}
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
          accessibilityLabel="Fechar banner"
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

      <View style={styles.riskSection}>
        {isPending ? (
          <View style={[styles.riskRow, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.riskText, { color: colors.textSecondary }]}>
              Analisando risco com IA...
            </Text>
          </View>
        ) : (
          <RiskResult result={result} isError={isError} onRetry={onRetry} />
        )}
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
    marginBottom: 10,
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
  riskSection: {
    marginTop: 2,
  },
  riskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  riskText: {
    fontSize: 13,
    flex: 1,
  },
  confidencePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "800",
  },
  retryText: {
    fontSize: 12,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
