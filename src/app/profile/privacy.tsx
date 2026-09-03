import { ScreenContainer } from '@/components/common/ScreenContainer';
import { LegalDocument } from '@/components/common/LegalDocument';

const SECTIONS = [
  {
    heading: 'Section 1 — Information We Collect',
    body: 'We collect your name, phone number, email address, and identity documents required to verify bookings at partner study centres.',
  },
  {
    heading: 'Section 2 — How We Use Your Data',
    body: 'Your data is used to process bookings, send booking-related notifications, and improve your experience within the app.',
  },
  {
    heading: 'Section 3 — Data Sharing',
    body: 'We share only the minimum required booking details with partner study centres and meal providers to fulfil your reservation.',
  },
  {
    heading: 'Section 4 — Your Rights',
    body: 'You may request access to, correction of, or deletion of your personal data at any time from the Personal Information screen.',
  },
];

export default function PrivacyScreen() {
  return (
    <ScreenContainer title="Privacy Policy" showBackButton scroll>
      <LegalDocument
        intro="This privacy policy explains how SPACZ collects, uses, and protects your personal information."
        sections={SECTIONS}
      />
    </ScreenContainer>
  );
}
