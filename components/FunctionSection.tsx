import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

const STEPS = [
  {
    number: '01',
    icon: 'location-outline' as const,
    title: 'Selecione uma Área',
    description:
      'No mapa satelital, toque em qualquer região do mundo que deseja monitorar.',
  },
  {
    number: '02',
    icon: 'cloud-upload-outline' as const,
    title: 'Envio Automático',
    description:
      'As coordenadas GPS e o horário exato são enviados para a API de análise.',
  },
  {
    number: '03',
    icon: 'analytics-outline' as const,
    title: 'Resultado por IA',
    description:
      'O modelo de IA retorna a porcentagem de risco de incêndio da área selecionada.',
  },
];

export function FunctionSection() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceSecondary },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Como Funciona
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.primary }]} />

      {STEPS.map((step, index) => (
        <View key={step.number} style={styles.stepRow}>
          {/* Número + linha conectora */}
          <View style={styles.stepLeft}>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{step.number}</Text>
            </View>
            {index < STEPS.length - 1 && (
              <View style={[styles.connector, { backgroundColor: colors.border }]} />
            )}
          </View>

          {/* Conteúdo */}
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Ionicons
                name={step.icon}
                size={16}
                color={colors.primary}
                style={styles.stepIcon}
              />
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {step.title}
              </Text>
            </View>
            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
              {step.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  divider: {
    height: 3,
    width: 36,
    borderRadius: 2,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  stepLeft: {
    alignItems: 'center',
    marginRight: 14,
    width: 36,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  connector: {
    width: 2,
    height: 24,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 1,
  },
  stepContent: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepIcon: {
    marginRight: 6,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
});
