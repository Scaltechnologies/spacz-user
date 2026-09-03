import { AspiringCategory } from '@/types/common';

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  dateOfBirth: string | null;
  emergencyContact: string | null;
  address: string | null;
  avatarUrl: string | null;
  aspiringFor: AspiringCategory[];
  isRegistered: boolean;
}

export interface DocumentItem {
  id: string;
  type: 'AADHAAR_FRONT' | 'AADHAAR_BACK';
  label: string;
  imageUrl: string | null;
  uploaded: boolean;
}
