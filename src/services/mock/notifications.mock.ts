import { AppNotification } from '@/types/notification';

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'OFFERS',
    title: 'Flat 50% off',
    message: 'Get 50% off on your first booking. Hurry up offer is valid till 27th March.',
    postedOn: '2026-03-01',
    isRead: false,
  },
  {
    id: 'notif-2',
    category: 'OFFERS',
    title: 'Flat 50% off',
    message: 'Get 50% off on your first booking. Hurry up offer is valid till 27th March.',
    postedOn: '2026-02-24',
    isRead: false,
  },
  {
    id: 'notif-3',
    category: 'UPDATES',
    title: 'Your booking is getting expired',
    message: 'Lorem ipsum dolor sit amet consectetur. Curabitur non hac imperdiet sed tempor pulvinar.',
    postedOn: '2026-02-20',
    isRead: true,
  },
  {
    id: 'notif-4',
    category: 'UPDATES',
    title: 'Your booking is getting expired',
    message: 'Lorem ipsum dolor sit amet consectetur. Curabitur non hac imperdiet sed tempor pulvinar.',
    postedOn: '2026-02-18',
    isRead: true,
  },
];
