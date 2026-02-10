const KEY_PREFIX = "hbd_blown_";

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getBlownKey(name: string, month: number, day: number): string {
  return `${KEY_PREFIX}${name}_${month}_${day}_${todayString()}`;
}

export function isBlownToday(name: string, month: number, day: number): boolean {
  try {
    return !!localStorage.getItem(getBlownKey(name, month, day));
  } catch {
    return false;
  }
}

export function setBlownToday(name: string, month: number, day: number): void {
  try {
    localStorage.setItem(getBlownKey(name, month, day), "1");
  } catch {
    // ignore
  }
}
