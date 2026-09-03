import { Booking } from '@/types/booking';
import { addDays, todayIso } from '@/utils/date';

const validFrom = addDays(todayIso(), -20);
const validTo = addDays(validFrom, 30);

export const mockBookings: Booking[] = [
  {
    id: '20300393dJGHSsis90',
    type: 'STUDY_CIRCLE',
    studyCentreId: 'sc-1',
    studyCentreName: 'The Next Level Study Zone',
    studyCentreLocation: 'Ameerpet, Hyderabad',
    studyCentreImageUrl: '',
    seatNumbers: ['C2'],
    validFrom,
    validTo,
    durationDays: 30,
    amount: 2000,
    priceBreakup: {
      seatSubtotal: 2000,
      discount: 0,
      platformCharges: 0,
      taxes: 0,
      total: 2000,
    },
    paymentStatus: 'PAID',
    createdAt: validFrom,
  },
  {
    id: '10200191aBCdef4521',
    type: 'STUDY_CIRCLE',
    studyCentreId: 'sc-2',
    studyCentreName: 'SR Study Zone',
    studyCentreLocation: 'SR Nagar, Hyderabad',
    studyCentreImageUrl: '',
    seatNumbers: ['C11', 'C12'],
    validFrom: todayIso(),
    validTo: addDays(todayIso(), 15),
    durationDays: 15,
    amount: 3500,
    priceBreakup: {
      seatSubtotal: 4000,
      discount: 500,
      platformCharges: 0,
      taxes: 0,
      total: 3500,
    },
    paymentStatus: 'PENDING',
    createdAt: todayIso(),
  },
];
