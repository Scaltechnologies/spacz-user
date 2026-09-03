import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { LegalDocument } from '@/components/common/LegalDocument';
import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

const FAQS = [
  {
    heading: 'How do I book a seat?',
    body: 'Open Study Centre, choose a centre, tap Book Now, then select seats, dates, and confirm payment.',
  },
  {
    heading: 'How do I cancel a booking?',
    body: 'Go to My Bookings, open the booking, and contact support to process a cancellation or refund.',
  },
  {
    heading: 'My payment is pending, what do I do?',
    body: 'Open the booking from My Bookings and tap Pay Now to complete the payment.',
  },
];

export default function HelpCenterScreen() {
  return (
    <ScreenContainer title="Help Center" showBackButton scroll>
      <View style={styles.contactRow}>
        <Ionicons name="mail-outline" size={18} color={Colors.primary} />
        <Text style={styles.contactText}>{Config.supportEmail}</Text>
      </View>
      <LegalDocument intro="Frequently asked questions" sections={FAQS} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  contactText: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
});
