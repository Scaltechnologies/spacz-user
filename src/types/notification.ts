export type NotificationCategory = 'OFFERS' | 'UPDATES';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  postedOn: string;
  isRead: boolean;
}
