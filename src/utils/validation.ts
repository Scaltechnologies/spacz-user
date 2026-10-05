export function validateMobileNumber(value: string): string | null {
  if (!value.trim()) return 'Mobile number is required';
  if (!/^\d{10}$/.test(value.trim())) return 'Enter a valid 10-digit mobile number';
  return null;
}

export function validateOtp(value: string, length = 6): string | null {
  if (!value.trim()) return 'OTP is required';
  if (!new RegExp(`^\\d{${length}}$`).test(value.trim())) return `Enter the ${length}-digit OTP`;
  return null;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address';
  return null;
}

export function validateFullName(value: string): string | null {
  if (!value.trim()) return 'Full name is required';
  if (value.trim().length < 2) return 'Full name is too short';
  return null;
}

/** Parses a DD-MM-YYYY date as typed in the app into ISO YYYY-MM-DD, or null when invalid. */
export function parseDisplayDate(value: string): string | null {
  const match = value.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) return null;
  return iso;
}

export function validateRequired(value: string, fieldLabel: string): string | null {
  if (!value.trim()) return `${fieldLabel} is required`;
  return null;
}
