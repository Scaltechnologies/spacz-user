import { mockDelay } from '@/services/api';
import { mockDocuments } from '@/services/mock/user.mock';
import { DocumentItem } from '@/types/user';

const documentsStore: DocumentItem[] = mockDocuments.map((doc) => ({ ...doc }));

export async function getDocuments(): Promise<DocumentItem[]> {
  return mockDelay([...documentsStore]);
}

export async function uploadDocument(id: string, localImageUri: string): Promise<DocumentItem> {
  const doc = documentsStore.find((item) => item.id === id);
  if (!doc) throw new Error('Document not found');
  doc.imageUrl = localImageUri;
  doc.uploaded = true;
  return mockDelay({ ...doc }, 800);
}
