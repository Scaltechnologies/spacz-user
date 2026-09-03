import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import * as profileService from '@/services/profile.service';

export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    if (rating === 0) {
      Alert.alert('Rating required', 'Please select a star rating before submitting.');
      return;
    }
    setIsSubmitting(true);
    try {
      await profileService.submitFeedback({ rating, message });
      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      setRating(0);
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer title="Share your Feedback" showBackButton scroll>
      <Text style={styles.subtitle}>
        Your feedback helps us improve SPACZ for every aspirant using the app.
      </Text>

      <RatingStars rating={rating} onChange={setRating} size={28} />

      <View style={styles.inputWrap}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Write your feedback here"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={6}
          style={styles.input}
        />
      </View>

      <Button label="Save" onPress={handleSave} loading={isSubmitting} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  inputWrap: {
    marginVertical: Spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    minHeight: 140,
    textAlignVertical: 'top',
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },
});
