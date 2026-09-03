import { Badge } from '@/components/ui/Badge';
import { PaymentStatus } from '@/types/booking';

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge label={status === 'PAID' ? 'Paid' : 'Not Paid'} tone={status === 'PAID' ? 'success' : 'error'} />;
}
