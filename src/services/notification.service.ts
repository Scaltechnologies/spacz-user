import { request } from '@/services/api';
import { AppNotification, NotificationCategory } from '@/types/notification';

interface NotificationResponse {
  id: number;
  type: NotificationCategory;
  title: string;
  description: string | null;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
}

/** GET /api/notifications?type= — OFFER = live admin offers, UPDATE = published admin updates. */
export async function getNotifications(category?: NotificationCategory): Promise<AppNotification[]> {
  const items = await request<NotificationResponse[]>('/api/notifications', { query: { type: category } });
  return items.map((item) => ({
    id: `${item.type}-${item.id}`,
    category: item.type,
    title: item.title,
    message: item.description,
    postedOn: item.createdAt,
    validTill: item.endAt,
  }));
}
