import { request } from '@/services/api';
import { PageResponse } from '@/types/common';
import {
  FeedbackItem,
  UpdateUserProfileRequest,
  User,
  UserProfile,
  UserProfilePatch,
  UserProgram,
} from '@/types/user';

export function toUser(profile: UserProfile): User {
  return {
    id: String(profile.userId),
    fullName: [profile.firstName, profile.lastName].filter(Boolean).join(' '),
    phoneNumber: profile.phone,
    email: profile.email,
    dateOfBirth: profile.dateOfBirth,
    city: profile.city,
    state: profile.state,
    avatarUrl: profile.profileImageUrl,
    isRegistered: true,
    profile,
  };
}

export function splitFullName(fullName: string): { firstName: string; lastName: string | null } {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  return { firstName: firstName ?? '', lastName: rest.length ? rest.join(' ') : null };
}

function emptyToNull(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toUpdateRequest(profile: UserProfile): UpdateUserProfileRequest {
  const { id, userId, email, createdAt, updatedAt, ...editable } = profile;
  return editable;
}

/** GET /api/users/me */
export async function getProfile(): Promise<User> {
  return toUser(await request<UserProfile>('/api/users/me'));
}

/** PUT /api/users/me — the backend expects a full replacement, so unchanged fields are sent back as-is. */
async function saveProfile(next: UpdateUserProfileRequest): Promise<User> {
  return toUser(await request<UserProfile>('/api/users/me', { method: 'PUT', body: next }));
}

export async function updateProfile(current: UserProfile, patch: UserProfilePatch): Promise<User> {
  const next = toUpdateRequest(current);
  if (patch.fullName !== undefined) Object.assign(next, splitFullName(patch.fullName));
  if (patch.phoneNumber !== undefined) next.phone = emptyToNull(patch.phoneNumber);
  if (patch.city !== undefined) next.city = emptyToNull(patch.city);
  if (patch.state !== undefined) next.state = emptyToNull(patch.state);
  return saveProfile(next);
}

export async function setDateOfBirth(current: UserProfile, dateOfBirth: string): Promise<User> {
  return saveProfile({ ...toUpdateRequest(current), dateOfBirth });
}

/** POST /api/users/me/programs — an exam/course the student is preparing for. */
export async function addProgram(programId: number): Promise<void> {
  await request('/api/users/me/programs', { method: 'POST', body: { programId } });
}

/** GET /api/users/me/programs — exams the student is preparing for (chosen at registration). */
export async function getMyPrograms(): Promise<UserProgram[]> {
  return request<UserProgram[]>('/api/users/me/programs');
}

export interface FeedbackInput {
  rating: number;
  message: string;
}

/** POST /api/users/me/feedback — an identical re-submit within a minute is absorbed by the backend. */
export async function submitFeedback(input: FeedbackInput): Promise<FeedbackItem> {
  return request<FeedbackItem>('/api/users/me/feedback', {
    method: 'POST',
    body: { rating: input.rating, comment: input.message.trim() || undefined },
  });
}

/** GET /api/users/me/feedback */
export async function getMyFeedback(): Promise<FeedbackItem[]> {
  const page = await request<PageResponse<FeedbackItem>>('/api/users/me/feedback', { query: { size: 20 } });
  return page.content;
}
