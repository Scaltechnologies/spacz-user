export type StudySlot = 'EARLY_MORNING' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' | 'FLEXIBLE';

/** user-service UserProfileResponse (GET/PUT /api/users/me). */
export interface UserProfile {
  id: number;
  userId: number;
  email: string | null;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  profileImageUrl: string | null;
  dateOfBirth: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  educationLevel: string | null;
  preferredCity: string | null;
  preferredStudySlot: StudySlot | null;
  dailyStudyHoursGoal: number | null;
  createdAt: string;
  updatedAt: string;
}

/** user-service UpdateUserProfileRequest — a full replacement of the editable fields. */
export type UpdateUserProfileRequest = Omit<UserProfile, 'id' | 'userId' | 'email' | 'createdAt' | 'updatedAt'>;

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string | null;
  email: string | null;
  dateOfBirth: string | null;
  city: string | null;
  state: string | null;
  avatarUrl: string | null;
  isRegistered: boolean;
  profile: UserProfile;
}

/** Editable fields exposed by the Personal Information screen. */
export interface UserProfilePatch {
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
}

export type DocumentType = 'AADHAAR_FRONT' | 'AADHAAR_BACK';

/** One document slot on My Documents; uploaded = user-service has a file for it. */
export interface DocumentItem {
  type: DocumentType;
  label: string;
  uploaded: boolean;
  uploadedAt: string | null;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
  /** Authenticated gateway path of the image (never a public URL). */
  fileUrl: string | null;
}

/** user-service FeedbackResponse */
export interface FeedbackItem {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
}

/** user-service UserProgramResponse (exams the student is preparing for). */
export interface UserProgram {
  id: number;
  programId: number;
  programName: string;
}
