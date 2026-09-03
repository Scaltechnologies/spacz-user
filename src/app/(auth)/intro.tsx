import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function IntroScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>SPACZ</Text>

        <View style={styles.illustration}>
          <Ionicons name="desktop-outline" size={72} color={Colors.primary} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>Book a seat in near by study circle</Text>
          <Text style={styles.subtitle}>
            Find and reserve your spot at the best study centres and meal providers near you.
          </Text>
        </View>

        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map((index) => (
            <View key={index} style={[styles.dot, index === 0 && styles.dotActive]} />
          ))}
        </View>
      </View>

      <Button
        label="Login"
        onPress={() => router.push('/(auth)/mobile-number')}
        icon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
        style={styles.button}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  logo: {
    ...Typography.h2,
    color: Colors.primary,
    letterSpacing: 2,
    position: 'absolute',
    top: Spacing.lg,
    left: 0,
  },
  illustration: {
    width: 180,
    height: 180,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    gap: Spacing.xs,
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  button: {
    marginBottom: Spacing.xl,
  },
});
