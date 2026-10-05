import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { DocumentCard } from '@/components/profile/DocumentCard';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { errorMessage } from '@/services/api';
import * as documentService from '@/services/document.service';
import { AsyncStatus } from '@/types/common';
import { DocumentItem, DocumentType } from '@/types/user';

/** Longest side after resizing; keeps phone photos well under the 1.5 MB upload limit. */
const MAX_IMAGE_SIDE = 1600;

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [previews, setPreviews] = useState<Partial<Record<DocumentType, string>>>({});
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  const [uploadErrors, setUploadErrors] = useState<Partial<Record<DocumentType, string>>>({});

  const loadPreview = useCallback((document: DocumentItem) => {
    documentService
      .getDocumentImage(document)
      .then((uri) => uri && setPreviews((current) => ({ ...current, [document.type]: uri })))
      .catch(() => undefined);
  }, []);

  const load = useCallback(() => {
    setStatus('loading');
    setError(null);
    documentService
      .getDocuments()
      .then((results) => {
        setDocuments(results);
        setStatus('success');
        results.filter((doc) => doc.uploaded).forEach(loadPreview);
      })
      .catch((err) => {
        setError(errorMessage(err, 'Unable to load your documents. Please try again.'));
        setStatus('error');
      });
  }, [loadPreview]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  async function handleUpload(type: DocumentType) {
    setUploadErrors((current) => ({ ...current, [type]: undefined }));
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setUploadErrors((current) => ({ ...current, [type]: 'Allow photo access to upload your document.' }));
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (picked.canceled || !picked.assets[0]) return;
    const asset = picked.assets[0];
    if (asset.mimeType && !['image/jpeg', 'image/png'].includes(asset.mimeType)) {
      setUploadErrors((current) => ({ ...current, [type]: 'Only JPEG and PNG images are allowed.' }));
      return;
    }

    setUploadingType(type);
    try {
      // Re-encode as a resized JPEG so large photos fit the upload limit.
      const context = ImageManipulator.manipulate(asset.uri);
      if (Math.max(asset.width, asset.height) > MAX_IMAGE_SIDE) {
        context.resize(asset.width >= asset.height ? { width: MAX_IMAGE_SIDE } : { height: MAX_IMAGE_SIDE });
      }
      const image = await (await context.renderAsync()).saveAsync({ compress: 0.75, format: SaveFormat.JPEG });
      const updated = await documentService.uploadDocument(type, {
        uri: image.uri,
        mimeType: 'image/jpeg',
        fileName: `${type.toLowerCase()}.jpg`,
      });
      setDocuments((current) => current.map((doc) => (doc.type === type ? updated : doc)));
      setPreviews((current) => ({ ...current, [type]: image.uri }));
    } catch (err) {
      setUploadErrors((current) => ({
        ...current,
        [type]: errorMessage(err, 'Something went wrong while uploading your document.'),
      }));
    } finally {
      setUploadingType(null);
    }
  }

  if (status === 'loading' || status === 'idle') return <Loader fullScreen />;
  if (status === 'error') return <ErrorMessage message={error ?? 'Unable to load your documents.'} onRetry={load} />;

  const noneUploaded = documents.every((doc) => !doc.uploaded);

  return (
    <ScreenContainer title="My Documents" showBackButton scroll>
      {noneUploaded ? <Text style={styles.hint}>Upload your Aadhaar documents</Text> : null}
      <View style={styles.section}>
        {documents.map((document) => (
          <DocumentCard
            key={document.type}
            document={document}
            previewUri={previews[document.type] ?? null}
            onPress={() => handleUpload(document.type)}
            isUploading={uploadingType === document.type}
            error={uploadErrors[document.type] ?? null}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  section: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
