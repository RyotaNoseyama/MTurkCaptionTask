export function getJSTDate(utcDate: Date = new Date()): Date {
  const jstOffset = 9 * 60 * 60 * 1000;
  return new Date(utcDate.getTime() + jstOffset);
}

export function getJSTMidnight(jstDate: Date): Date {
  const year = jstDate.getUTCFullYear();
  const month = jstDate.getUTCMonth();
  const day = jstDate.getUTCDate();
  const midnight = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  const jstOffset = 9 * 60 * 60 * 1000;
  return new Date(midnight.getTime() - jstOffset);
}

export function getCurrentDayIdx(): number {
  const now = new Date();
  const jstNow = getJSTDate(now);
  const jstMidnight = getJSTMidnight(jstNow);
  const daysSinceEpoch = Math.floor(jstMidnight.getTime() / (24 * 60 * 60 * 1000));
  return daysSinceEpoch;
}

export function generateCompletionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [4, 4, 4];
  const code = segments.map(len => {
    let segment = '';
    for (let i = 0; i < len; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return segment;
  }).join('-');
  return `COMP-${code}`;
}
