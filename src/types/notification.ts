/** admin-service NotificationResponse.type */
export type NotificationCategory = 'OFFER' | 'UPDATE';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string | null;
  postedOn: string;
  /** OFFER only */
  validTill: string | null;
}
