import { File } from 'expo-file-system';
import { Platform } from 'react-native';

import { request, requestDataUri } from '@/services/api';
import { DocumentItem, DocumentType } from '@/types/user';

interface UserDocumentResponse {
  documentType: DocumentType;
  verificationStatus: DocumentItem['verificationStatus'];
  uploadedAt: string;
  fileUrl: string;
}

/** Document slots shown on My Documents, in display order. */
const DOCUMENT_SLOTS: { type: DocumentType; label: string }[] = [
  { type: 'AADHAAR_FRONT', label: 'Aadhaar Front' },
  { type: 'AADHAAR_BACK', label: 'Aadhaar Back' },
];

/** Must match user-service spacz.storage.max-file-bytes. */
export const MAX_DOCUMENT_BYTES = 1.5 * 1024 * 1024;

function toItem(slot: (typeof DOCUMENT_SLOTS)[number], uploaded?: UserDocumentResponse): DocumentItem {
  return {
    type: slot.type,
    label: slot.label,
    uploaded: !!uploaded,
    uploadedAt: uploaded?.uploadedAt ?? null,
    verificationStatus: uploaded?.verificationStatus ?? null,
    fileUrl: uploaded?.fileUrl ?? null,
  };
}

/** GET /api/users/me/documents */
export async function getDocuments(): Promise<DocumentItem[]> {
  const uploaded = await request<UserDocumentResponse[]>('/api/users/me/documents');
  return DOCUMENT_SLOTS.map((slot) => toItem(slot, uploaded.find((doc) => doc.documentType === slot.type)));
}

export interface PickedImage {
  uri: string;
  mimeType: string;
  fileName: string;
}

/** PUT /api/users/me/documents/{type} (multipart, part "file"). */
export async function uploadDocument(type: DocumentType, image: PickedImage): Promise<DocumentItem> {
  const form = new FormData();
  if (Platform.OS === 'web') {
    // On web the picker returns a blob/data URI; FormData needs a real Blob.
    const blob = await (await fetch(image.uri)).blob();
    form.append('file', blob, image.fileName);
  } else {
    // On native, Expo replaces global fetch with expo/fetch, whose FormData encoder rejects React
    // Native's { uri, name, type } parts ("Unsupported FormDataPart implementation"). An
    // expo-file-system File implements Blob (name, type, bytes()) and is encoded correctly.
    form.append('file', new File(image.uri) as unknown as Blob, image.fileName);
  }
  const saved = await request<UserDocumentResponse>(`/api/users/me/documents/${type}`, { method: 'PUT', body: form });
  const slot = DOCUMENT_SLOTS.find((item) => item.type === type) ?? { type, label: type };
  return toItem(slot, saved);
}

/** The private image, fetched with the user's token and returned as a data: URI for preview. */
export async function getDocumentImage(document: DocumentItem): Promise<string | null> {
  return document.fileUrl ? requestDataUri(document.fileUrl) : null;
}
