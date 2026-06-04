import { FeatureCard } from "@/components/FeatureCard";
import { HeroSection } from "@/components/HeroSection";
import { FunctionSection } from "@/components/FunctionSection";
import { useTheme } from "@/context/ThemeContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <HeroSection />

      <View
        style={[styles.aboutSection, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.sectionLabel, { color: colors.primaryLight }]}>
          Sobre o EcoOrbit
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Protegendo o Planeta com Tecnologia
        </Text>
        <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
          O EcoOrbit combina imagens satelitais de alta resolução com modelos de
          inteligência artificial para identificar e quantificar o risco de
          incêndio em qualquer ponto do globo — de forma rápida, precisa e
          acessível de qualquer dispositivo.
        </Text>
      </View>

      <View style={styles.featuresSection}>
        <Text style={[styles.featuresSectionTitle, { color: colors.text }]}>
          Recursos
        </Text>

        <View style={styles.cardsRow}>
          <FeatureCard
            icon="radio-outline"
            title="Visão Satelital"
            description="Mapa em tempo real com imagens de satélite de alta resolução."
          />
          <FeatureCard
            icon="flash-outline"
            title="IA em Tempo Real"
            description="Modelo treinado para detectar padrões de risco com alta precisão."
            accentColor="#F4A261"
          />
        </View>

        <View style={[styles.cardsRow, { marginTop: 12 }]}>
          <FeatureCard
            icon="shield-checkmark-outline"
            title="Alerta de Risco"
            description="Receba a porcentagem de risco de incêndio para qualquer área."
            accentColor="#E84855"
          />
          <FeatureCard
            icon="earth-outline"
            title="Cobertura Global"
            description="Monitore qualquer região do planeta diretamente do celular."
            accentColor="#74C69D"
          />
        </View>
      </View>

      <FunctionSection />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          EcoOrbit © 2025 — Tecnologia a serviço do meio ambiente 
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 16,
  },
  aboutSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
    lineHeight: 28,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  featuresSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  featuresSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    textAlign: "center",
  },
});
