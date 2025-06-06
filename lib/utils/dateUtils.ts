export function formatTimeLeftToMinutes(ms: number): string {
  if (ms <= 0) return "0 minutes";

  const totalMinutes = Math.floor(ms / 1000 / 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);

  return parts.join(", ");
}

export function getTimeLeftWithGracePeriod(
  deadline: Date,
  graceDays: number = 0
): number {
  const deadlineWithGrace = new Date(deadline);
  deadlineWithGrace.setDate(deadlineWithGrace.getDate() + graceDays);

  const now = new Date();
  const timeLeftMs = deadlineWithGrace.getTime() - now.getTime();

  return timeLeftMs;
}

export function getDateWithGrace(date: Date, grace: number) {
  const dateWithGrace = new Date(date);
  dateWithGrace.setDate(dateWithGrace.getDate() + grace);
  return dateWithGrace;
}
