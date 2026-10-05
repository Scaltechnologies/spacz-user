import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useProfile } from '@/hooks/useProfile';
import { errorMessage } from '@/services/api';
import { User, UserProfilePatch } from '@/types/user';

type EditableField = keyof UserProfilePatch;
type Field = EditableField | 'email';

// Only fields stored by user-service. Email is managed by auth-service and is read-only here.
const FIELD_LABELS: Record<Field, string> = {
  fullName: 'Full Name',
  phoneNumber: 'Phone Number',
  email: 'Email Id',
  city: 'City',
  state: 'State',
};

function fieldValue(user: User, field: Field): string | null {
  return (user[field] as string | null) || null;
}

export default function PersonalInformationScreen() {
  const { profile, status, error, refresh, update } = useProfile();
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (status === 'error') return <ErrorMessage message={error ?? 'Failed to load profile'} onRetry={refresh} />;
  if (status === 'loading' || !profile) return <Loader fullScreen />;

  function startEditing(field: EditableField, currentValue: string | null) {
    setEditingField(field);
    setDraftValue(currentValue ?? '');
    setSaveError(null);
  }

  async function saveField(field: EditableField) {
    if (field === 'fullName' && !draftValue.trim()) {
      setSaveError('Full name is required');
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await update({ [field]: draftValue });
      setEditingField(null);
    } catch (err) {
      setSaveError(errorMessage(err, 'Could not save'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScreenContainer title="Personal Information" showBackButton scroll>
      {(Object.keys(FIELD_LABELS) as Field[]).map((field) => {
        const value = fieldValue(profile, field);
        const isEditing = editingField === field;
        return (
          <View key={field} style={styles.row}>
            <View style={styles.rowHeader}>
              <Text style={styles.label}>{FIELD_LABELS[field]}</Text>
              {field === 'email' ? null : isEditing ? (
                <Pressable onPress={() => saveField(field)} disabled={isSaving}>
                  <Text style={styles.action}>{isSaving ? 'Saving…' : 'Save'}</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => startEditing(field, value)}>
                  <Text style={styles.action}>{value ? 'Edit' : 'Add'}</Text>
                </Pressable>
              )}
            </View>
            {isEditing ? (
              <TextInput value={draftValue} onChangeText={setDraftValue} style={styles.input} autoFocus />
            ) : (
              <Text style={styles.value}>{value ?? 'Not Provided'}</Text>
            )}
            {isEditing && saveError ? <Text style={styles.error}>{saveError}</Text> : null}
          </View>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  action: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
  value: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginTop: 2,
  },
  input: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginTop: 2,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 2,
  },
});
