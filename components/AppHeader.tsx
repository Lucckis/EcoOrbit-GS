import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

export function AppHeader() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.headerBg,
          paddingTop: insets.top + 6,
        },
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.logoArea}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.toggleBtn, { borderColor: colors.primaryLight + '60' }]}
          activeOpacity={0.7}
          accessibilityLabel="Alternar tema"
          accessibilityRole="button"
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={19}
            color={colors.headerText}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoArea: {
    flex: 1,
  },
  logo: {
    height: 50,
    width: 170,
  },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
