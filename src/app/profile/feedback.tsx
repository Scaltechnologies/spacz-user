import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { errorMessage } from '@/services/api';
import * as profileService from '@/services/profile.service';
import { AsyncStatus } from '@/types/common';
import { FeedbackItem } from '@/types/user';
import { formatDisplayDate } from '@/utils/date';

const MAX_COMMENT_LENGTH = 1000;

export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [historyStatus, setHistoryStatus] = useState<AsyncStatus>('idle');

  const loadHistory = useCallback(() => {
    setHistoryStatus('loading');
    profileService
      .getMyFeedback()
      .then((items) => {
        setHistory(items);
        setHistoryStatus('success');
      })
      .catch(() => setHistoryStatus('error'));
  }, []);

  useEffect(() => {
    Promise.resolve().then(loadHistory);
  }, [loadHistory]);

  async function handleSave() {
    if (rating === 0) {
      setNotice({ tone: 'error', text: 'Please select a star rating before submitting.' });
      return;
    }
    setIsSubmitting(true);
    setNotice(null);
    try {
      await profileService.submitFeedback({ rating, message });
      setNotice({ tone: 'success', text: 'Thank you! Your feedback has been submitted.' });
      setRating(0);
      setMessage('');
      loadHistory();
    } catch (err) {
      setNotice({ tone: 'error', text: errorMessage(err, 'Unable to submit feedback. Please try again.') });
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
          maxLength={MAX_COMMENT_LENGTH}
          style={styles.input}
        />
        <Text style={styles.counter}>
          {message.length}/{MAX_COMMENT_LENGTH}
        </Text>
      </View>

      {notice ? (
        <Text style={[styles.notice, notice.tone === 'error' ? styles.noticeError : styles.noticeSuccess]}>
          {notice.text}
        </Text>
      ) : null}

      <Button label="Save" onPress={handleSave} loading={isSubmitting} disabled={isSubmitting} />

      <View style={styles.history}>
        <Text style={styles.historyTitle}>Your feedback</Text>
        {historyStatus === 'loading' && <Loader />}
        {historyStatus === 'error' && <Text style={styles.muted}>Unable to load your previous feedback.</Text>}
        {historyStatus === 'success' && history.length === 0 && (
          <Text style={styles.muted}>No feedback submitted yet</Text>
        )}
        {historyStatus === 'success' &&
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <RatingStars rating={item.rating} size={14} />
                <Text style={styles.muted}>{formatDisplayDate(item.createdAt)}</Text>
              </View>
              {item.comment ? <Text style={styles.historyComment}>{item.comment}</Text> : null}
            </View>
          ))}
      </View>
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
    gap: Spacing.xxs,
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
  counter: {
    ...Typography.small,
    color: Colors.textMuted,
    alignSelf: 'flex-end',
  },
  notice: {
    ...Typography.caption,
    marginBottom: Spacing.sm,
  },
  noticeSuccess: {
    color: Colors.success,
  },
  noticeError: {
    color: Colors.error,
  },
  history: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  historyTitle: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  historyItem: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: Spacing.xxs,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyComment: {
    ...Typography.caption,
    color: Colors.text,
  },
  muted: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
