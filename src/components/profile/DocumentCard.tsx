import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { DocumentItem } from '@/types/user';

interface DocumentCardProps {
  document: DocumentItem;
  onPress: () => void;
  isUploading?: boolean;
}

export function DocumentCard({ document, onPress, isUploading }: DocumentCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{document.label}</Text>
        {document.uploaded ? (
          <Pressable onPress={onPress} hitSlop={6}>
            <Text style={styles.action}>Reupload</Text>
          </Pressable>
        ) : null}
      </View>

      {document.uploaded ? (
        <View style={styles.imageWrap}>
          <ImagePlaceholder uri={document.imageUrl} icon="card-outline" />
        </View>
      ) : (
        <Pressable onPress={onPress} style={styles.uploadBox}>
          <Ionicons name="cloud-upload-outline" size={26} color={Colors.textMuted} />
          <Text style={styles.uploadTitle}>
            {isUploading ? 'Uploading…' : `Upload ${document.label}`}
          </Text>
          <Text style={styles.uploadHint}>*JPEG, PNG only</Text>
        </Pressable>
      )}
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
});
