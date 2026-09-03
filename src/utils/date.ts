const MS_IN_DAY = 24 * 60 * 60 * 1000;

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatDateShort(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  date.setTime(date.getTime() + days * MS_IN_DAY);
  return date.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateRange(fromIso: string, toIso: string): string {
  return `${formatDateShort(fromIso)} - ${formatDateShort(toIso)}`;
}
