import { ScreenContainer } from '@/components/common/ScreenContainer';
import { LegalDocument } from '@/components/common/LegalDocument';

const SECTIONS = [
  {
    heading: 'Section 1 — Acceptance of Terms',
    body: 'By creating an account and using the SPACZ app, you agree to be bound by these terms and conditions and our booking policies for study centres and meal providers.',
  },
  {
    heading: 'Section 2 — Bookings',
    body: 'All seat and meal card bookings are subject to availability. Prices, discounts, and slot availability shown in the app may change without prior notice.',
  },
  {
    heading: 'Section 3 — Cancellations & Refunds',
    body: 'Cancellation and refund eligibility depends on the individual study centre or meal provider policy. Please review the specific centre details before booking.',
  },
  {
    heading: 'Section 4 — User Conduct',
    body: 'Users are expected to maintain decorum at partner study centres and follow the rules laid out by each venue.',
  },
];

export default function TermsScreen() {
  return (
    <ScreenContainer title="Terms and Conditions" showBackButton scroll>
      <LegalDocument
        intro="These terms and conditions govern your use of the SPACZ application and its services."
        sections={SECTIONS}
      />
    </ScreenContainer>
  );
}
