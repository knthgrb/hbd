/** Next occurrence of month/day from a given date. */
export function getNextBirthdayFrom(from: Date, month: number, day: number): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  let next = new Date(d.getFullYear(), month - 1, day, 0, 0, 0, 0);
  if (next < d) {
    next = new Date(d.getFullYear() + 1, month - 1, day, 0, 0, 0, 0);
  }
  return next;
}

/** Days until birthday from a given date (e.g. link creation date). */
export function getDaysUntilBirthdayFrom(from: Date, month: number, day: number): number {
  const next = getNextBirthdayFrom(from, month, day);
  const fromMs = new Date(from).setHours(0, 0, 0, 0);
  const diff = next.getTime() - fromMs;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

/** Next occurrence of month/day from today. If today is the day, that's the target. */
export function getNextBirthday(month: number, day: number): Date {
  return getNextBirthdayFrom(new Date(), month, day);
}

export function getCountdown(month: number, day: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
} {
  const now = new Date();
  const next = getNextBirthday(month, day);
  const diff = next.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const isToday =
    next.getDate() === now.getDate() &&
    next.getMonth() === now.getMonth() &&
    next.getFullYear() === now.getFullYear();

  return { days, hours, minutes, seconds, isToday };
}
