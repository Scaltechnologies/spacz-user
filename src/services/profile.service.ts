import { mockDelay } from '@/services/api';
import { mockUser } from '@/services/mock/user.mock';
import { User } from '@/types/user';

let profileStore: User = { ...mockUser };

export async function getProfile(): Promise<User> {
  return mockDelay({ ...profileStore });
}

export async function updateProfile(patch: Partial<User>): Promise<User> {
  profileStore = { ...profileStore, ...patch };
  return mockDelay({ ...profileStore });
}

export interface FeedbackInput {
  rating: number;
  message: string;
}

export async function submitFeedback(input: FeedbackInput): Promise<{ submitted: true }> {
  return mockDelay({ submitted: true }, 600);
}
