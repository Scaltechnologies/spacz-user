import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useProfile } from '@/hooks/useProfile';
import { User } from '@/types/user';

type EditableField = 'fullName' | 'phoneNumber' | 'emergencyContact' | 'email' | 'address';

const FIELD_LABELS: Record<EditableField, string> = {
  fullName: 'Full Name',
  phoneNumber: 'Phone Number',
  emergencyContact: 'Emergency Contact',
  email: 'Email Id',
  address: 'Address',
};

export default function PersonalInformationScreen() {
  const { profile, status, error, update } = useProfile();
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState('');

  if (status === 'loading' || !profile) return <Loader fullScreen />;
  if (status === 'error') return <ErrorMessage message={error ?? 'Failed to load profile'} />;

  function startEditing(field: EditableField, currentValue: string | null) {
    setEditingField(field);
    setDraftValue(currentValue ?? '');
  }

  async function saveField(field: EditableField) {
    await update({ [field]: draftValue } as Partial<User>);
    setEditingField(null);
  }

  return (
    <ScreenContainer title="Personal Information" showBackButton scroll>
      {(Object.keys(FIELD_LABELS) as EditableField[]).map((field) => {
        const value = profile[field] as string | null;
        const isEditing = editingField === field;
        return (
          <View key={field} style={styles.row}>
            <View style={styles.rowHeader}>
              <Text style={styles.label}>{FIELD_LABELS[field]}</Text>
              {isEditing ? (
                <Pressable onPress={() => saveField(field)}>
                  <Text style={styles.action}>Save</Text>
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
});
