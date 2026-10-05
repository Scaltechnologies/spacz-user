import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { AppNotification } from '@/types/notification';
import { formatDisplayDate } from '@/utils/date';

export function NotificationItem({ notification }: { notification: AppNotification }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{notification.title}</Text>
      {notification.message ? <Text style={styles.message}>{notification.message}</Text> : null}
      <Text style={styles.meta}>
        {notification.validTill
          ? `Valid till ${formatDisplayDate(notification.validTill)}`
          : formatDisplayDate(notification.postedOn)}
      </Text>
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
  title: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  message: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  meta: {
    ...Typography.small,
    color: Colors.textMuted,
  },
});
