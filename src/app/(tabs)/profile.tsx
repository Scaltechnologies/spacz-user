import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileMenuItem } from '@/components/profile/ProfileMenuItem';
import { Divider } from '@/components/ui/Divider';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace('/(auth)/intro');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileHeader name={user?.fullName ?? 'Aspirant'} verified={user?.isRegistered} />
        <Divider style={styles.divider} />

        <View style={styles.menu}>
          <ProfileMenuItem icon="person-outline" label="Personal Information" onPress={() => router.push('/profile/personal')} />
          <ProfileMenuItem icon="calendar-outline" label="My Bookings" onPress={() => router.push('/bookings')} />
          <ProfileMenuItem icon="document-text-outline" label="My Documents" onPress={() => router.push('/profile/documents')} />
          <ProfileMenuItem icon="notifications-outline" label="Notifications" onPress={() => router.push('/profile/notifications')} />
          <ProfileMenuItem icon="help-circle-outline" label="Visit Help Center" onPress={() => router.push('/profile/help-center')} />
          <ProfileMenuItem icon="chatbubble-ellipses-outline" label="Give us feedback" onPress={() => router.push('/profile/feedback')} />
          <ProfileMenuItem icon="document-outline" label="Terms and Conditions" onPress={() => router.push('/profile/terms')} />
          <ProfileMenuItem icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => router.push('/profile/privacy')} />
        </View>

        <Divider style={styles.divider} />
        <View style={styles.menu}>
          <ProfileMenuItem icon="log-out-outline" label="Logout" onPress={handleLogout} destructive />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  divider: {
    marginVertical: Spacing.sm,
  },
  menu: {
    gap: 2,
  },
});
