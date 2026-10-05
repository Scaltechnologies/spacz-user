const MS_IN_DAY = 24 * 60 * 60 * 1000;

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/** "27 Mar 2027" — for timestamps such as offer validity and notification dates. */
export function formatDisplayDate(isoDateOrTimestamp: string): string {
  const date = new Date(isoDateOrTimestamp);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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

/** Today's date on the device clock (local, not UTC) as YYYY-MM-DD. */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Same as Java's LocalDate.plusMonths: clamps to the last day of the target month. */
export function addMonths(isoDate: string, months: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}

export function daysBetweenInclusive(fromIso: string, toIso: string): number {
  return Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / MS_IN_DAY) + 1;
}

export function formatDateRange(fromIso: string, toIso: string): string {
  return `${formatDateShort(fromIso)} - ${formatDateShort(toIso)}`;
}
