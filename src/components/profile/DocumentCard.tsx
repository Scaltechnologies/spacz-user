import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { DocumentItem } from '@/types/user';

interface DocumentCardProps {
  document: DocumentItem;
  /** The private image loaded with the user's token (data: URI); null while loading. */
  previewUri: string | null;
  onPress: () => void;
  isUploading?: boolean;
  error?: string | null;
}

const VERIFICATION_LABELS: Record<NonNullable<DocumentItem['verificationStatus']>, string> = {
  PENDING: 'Verification pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected — please reupload',
};

export function DocumentCard({ document, previewUri, onPress, isUploading, error }: DocumentCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{document.label}</Text>
        {document.uploaded ? (
          <Pressable onPress={onPress} hitSlop={6} disabled={isUploading}>
            <Text style={styles.action}>{isUploading ? 'Uploading…' : 'Reupload'}</Text>
          </Pressable>
        ) : null}
      </View>

      {document.uploaded ? (
        <>
          <View style={styles.imageWrap}>
            <ImagePlaceholder uri={previewUri} icon="card-outline" />
            {isUploading ? (
              <View style={styles.overlay}>
                <ActivityIndicator color={Colors.white} />
              </View>
            ) : null}
          </View>
          {document.verificationStatus ? (
            <Text style={styles.status}>{VERIFICATION_LABELS[document.verificationStatus]}</Text>
          ) : null}
        </>
      ) : (
        <Pressable onPress={onPress} style={styles.uploadBox} disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Ionicons name="cloud-upload-outline" size={26} color={Colors.textMuted} />
          )}
          <Text style={styles.uploadTitle}>{isUploading ? 'Uploading…' : `Upload ${document.label}`}</Text>
          <Text style={styles.uploadHint}>*JPEG, PNG only</Text>
        </Pressable>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  action: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
  imageWrap: {
    width: '100%',
    height: 150,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    width: '100%',
    height: 150,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadTitle: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  uploadHint: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  status: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
  },
});
