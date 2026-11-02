/** "13:05" or "13:05:00" -> "1:05 PM". Returns "" for empty values. */
export function formatTime(time?: string | null): string {
  if (!time) return "";

  const [h, m] = time.split(":");
  const hours = Number(h);
  const minutes = Number(m);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "";

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}