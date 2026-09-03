import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { AppNotification } from '@/types/notification';

export function NotificationItem({ notification }: { notification: AppNotification }) {
  return (
    <View style={[styles.container, !notification.isRead && styles.unread]}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.message}>{notification.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    gap: 4,
  },
  unread: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  title: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  message: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
