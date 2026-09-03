import { DocumentItem, User } from '@/types/user';

export const mockUser: User = {
  id: 'user-1',
  fullName: 'Ranjit Kodipyaka',
  phoneNumber: '9177859785',
  email: 'ranjitkodipyaka@gmail.com',
  dateOfBirth: null,
  emergencyContact: null,
  address: null,
  avatarUrl: null,
  aspiringFor: ['Groups', 'Banking'],
  isRegistered: true,
};

export const mockDocuments: DocumentItem[] = [
  { id: 'doc-1', type: 'AADHAAR_FRONT', label: 'Aadhaar Front', imageUrl: '', uploaded: true },
  { id: 'doc-2', type: 'AADHAAR_BACK', label: 'Aadhaar Back', imageUrl: null, uploaded: false },
];
