import { Config } from '@/constants/config';

export function formatCurrency(amount: number): string {
  return `${Config.currencySymbol}${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length !== 10) return phoneNumber;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function maskPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length < 4) return phoneNumber;
  return `${digits.slice(0, 2)}${'*'.repeat(digits.length - 4)}${digits.slice(-2)}`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}
