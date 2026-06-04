import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

export function HeroSection() {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.heroBackground }]}
    >
      <View style={styles.orbitWrapper}>
        <View
          style={[
            styles.ring,
            styles.outerRing,
            { borderColor: colors.orbitRing },
          ]}
        />
        <View
          style={[
            styles.ring,
            styles.middleRing,
            { borderColor: colors.orbitRing },
          ]}
        />
        <View
          style={[
            styles.planet,
            {
              backgroundColor: colors.primaryDark,
              borderColor: colors.primaryLight,
            },
          ]}
        >
          <Text style={styles.planetEmoji}>🌍</Text>
        </View>
        <View
          style={[
            styles.satellite,
            styles.satTop,
            { backgroundColor: colors.orbitSatellite },
          ]}
        />
        <View
          style={[
            styles.satellite,
            styles.satBottom,
            { backgroundColor: colors.accentOrange },
          ]}
        />
        <View
          style={[
            styles.star,
            styles.star1,
            { backgroundColor: colors.orbitSatellite },
          ]}
        />
        <View
          style={[
            styles.star,
            styles.star2,
            { backgroundColor: colors.orbitSatellite },
          ]}
        />
        <View
          style={[
            styles.star,
            styles.star3,
            { backgroundColor: colors.accentOrange },
          ]}
        />
      </View>

      <Text style={[styles.appName, { color: colors.heroText }]}>EcoOrbit</Text>
      <View
        style={[styles.pill, { backgroundColor: colors.primaryLight + "30" }]}
      >
        <Text style={[styles.pillText, { color: colors.primaryLight }]}>
          🔥 Monitoramento de Risco de Incêndio
        </Text>
      </View>
      <Text style={[styles.tagline, { color: "rgba(232,245,233,0.70)" }]}>
        Visão satelital + Inteligência Artificial para proteger o meio ambiente.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  orbitWrapper: {
    width: 170,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
  },
  outerRing: {
    width: 168,
    height: 168,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  middleRing: {
    width: 114,
    height: 114,
    borderWidth: 1,
    opacity: 0.7,
  },
  planet: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  planetEmoji: {
    fontSize: 38,
  },
  satellite: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  satTop: {
    top: 4,
    right: 20,
  },
  satBottom: {
    bottom: 8,
    left: 8,
  },
  star: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  star1: { top: 12, left: 30 },
  star2: { bottom: 20, right: 10 },
  star3: { top: 40, right: 4 },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
});
