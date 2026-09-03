import { mockDelay } from '@/services/api';
import { mockNotifications } from '@/services/mock/notifications.mock';
import { AppNotification, NotificationCategory } from '@/types/notification';

const notificationsStore: AppNotification[] = mockNotifications.map((item) => ({ ...item }));

export async function getNotifications(category?: NotificationCategory): Promise<AppNotification[]> {
  const results = category
    ? notificationsStore.filter((item) => item.category === category)
    : [...notificationsStore];
  return mockDelay(results);
}

export async function markNotificationRead(id: string): Promise<void> {
  const notification = notificationsStore.find((item) => item.id === id);
  if (notification) notification.isRead = true;
  return mockDelay(undefined);
}
