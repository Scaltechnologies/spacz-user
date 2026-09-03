import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { DateDurationPicker } from '@/components/booking/DateDurationPicker';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { useBookingStore } from '@/store/bookingStore';
import { DurationOption } from '@/types/booking';
import { todayIso } from '@/utils/date';

export default function SelectDateScreen() {
  const validFrom = useBookingStore((state) => state.validFrom) ?? todayIso();
  const durationDays = useBookingStore((state) => state.durationDays);
  const setDateAndDuration = useBookingStore((state) => state.setDateAndDuration);

  function handleNext() {
    if (!useBookingStore.getState().validFrom) {
      setDateAndDuration(todayIso(), durationDays);
    }
    router.push('/study-centre/seat-map');
  }

  return (
    <ScreenContainer title="Select Date" showBackButton>
      <View style={styles.content}>
        <DateDurationPicker
          validFrom={validFrom}
          duration={durationDays}
          onChangeValidFrom={(date) => setDateAndDuration(date, durationDays)}
          onChangeDuration={(duration) => setDateAndDuration(validFrom, duration as DurationOption)}
        />
      </View>
      <Button label="Next" onPress={handleNext} style={styles.button} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  button: {
    marginBottom: Spacing.lg,
  },
});
