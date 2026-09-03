import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { DocumentCard } from '@/components/profile/DocumentCard';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Spacing } from '@/constants/spacing';
import * as documentService from '@/services/document.service';
import { AsyncStatus } from '@/types/common';
import { DocumentItem } from '@/types/user';

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => setStatus('loading'));
    documentService
      .getDocuments()
      .then((results) => {
        setDocuments(results);
        setStatus('success');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load documents');
        setStatus('error');
      });
  }, []);

  async function handleUpload(id: string) {
    setUploadingId(id);
    try {
      const updated = await documentService.uploadDocument(id, 'mock://uploaded-document.jpg');
      setDocuments((current) => current.map((doc) => (doc.id === id ? updated : doc)));
    } finally {
      setUploadingId(null);
    }
  }

  if (status === 'loading' || status === 'idle') return <Loader fullScreen />;
  if (status === 'error') return <ErrorMessage message={error ?? 'Failed to load documents'} />;

  return (
    <ScreenContainer title="My Documents" showBackButton scroll>
      <View style={styles.section}>
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onPress={() => handleUpload(document.id)}
            isUploading={uploadingId === document.id}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
