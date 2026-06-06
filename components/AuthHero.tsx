import { useTheme } from "@/context/ThemeContext";
import { Image, StyleSheet, Text, View } from "react-native";

interface AuthHeroProps {
  subtitle: string;
}

export function AuthHero({ subtitle }: AuthHeroProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.heroBackground }]}
    >
      <View
        style={[
          styles.ring,
          styles.ringOuter,
          { borderColor: colors.orbitRing },
        ]}
      />
      <View
        style={[
          styles.ring,
          styles.ringInner,
          { borderColor: colors.orbitRing },
        ]}
      />

      <View
        style={[
          styles.dot,
          styles.dotA,
          { backgroundColor: colors.orbitSatellite },
        ]}
      />
      <View
        style={[
          styles.dot,
          styles.dotB,
          { backgroundColor: colors.accentOrange },
        ]}
      />
      <View
        style={[
          styles.dot,
          styles.dotC,
          { backgroundColor: colors.orbitSatellite },
        ]}
      />
      <View
        style={[
          styles.dot,
          styles.dotD,
          { backgroundColor: colors.orbitSatellite },
        ]}
      />

      <Image
        source={require("../assets/images/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View
        style={[styles.pill, { backgroundColor: colors.primaryLight + "28" }]}
      >
        <Text style={[styles.pillText, { color: colors.primaryLight }]}>
          🌍 {subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 52,
    paddingBottom: 48,
    overflow: "hidden",
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
  },
  ringOuter: {
    width: 280,
    height: 280,
    top: -120,
    right: -80,
    borderStyle: "dashed",
    opacity: 0.8,
  },
  ringInner: {
    width: 180,
    height: 180,
    bottom: -80,
    left: -50,
    opacity: 0.5,
  },
  dot: {
    position: "absolute",
    borderRadius: 999,
  },
  dotA: { width: 10, height: 10, top: 28, right: 36 },
  dotB: { width: 7, height: 7, bottom: 22, right: 70 },
  dotC: { width: 5, height: 5, top: 55, left: 28 },
  dotD: { width: 4, height: 4, bottom: 36, left: 110 },
  logo: {
    width: 200,
    height: 88,
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
    textAlign: "center",
  },
});
