import { Badge } from '@/components/ui/Badge';
import { PaymentStatus } from '@/types/booking';

const LABELS: Record<PaymentStatus, { label: string; tone: 'success' | 'error' | 'neutral' }> = {
  PAID: { label: 'Paid', tone: 'success' },
  PENDING: { label: 'Not Paid', tone: 'error' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
  EXPIRED: { label: 'Expired', tone: 'neutral' },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, tone } = LABELS[status];
  return <Badge label={label} tone={tone} />;
}
