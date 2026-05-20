const TIME_STEP = 15;

export function snapMinutes(m: number): number {
  return Math.round(m / TIME_STEP) * TIME_STEP;
}

export function parseTimeLabel(label: string): number {
  const [h, m] = label.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return 9 * 60;
  return h * 60 + m;
}

export function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function formatTimeRange(start: number, end: number): string {
  return `${formatMinutes(start)} – ${formatMinutes(end)}`;
}

export function durationHours(start: number, end: number): string {
  const hrs = (end - start) / 60;
  if (hrs === Math.floor(hrs)) return `${hrs}hr${hrs === 1 ? "" : "s"}`;
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  if (h === 0) return `${m}min`;
  return m > 0 ? `${h}h ${m}m` : `${h}hr${h === 1 ? "" : "s"}`;
}

export function countOpenSlots(start: number, end: number, slotLengthMin: number): number {
  if (slotLengthMin <= 0 || end <= start) return 0;
  return Math.floor((end - start) / slotLengthMin);
}

export function timeOptions(stepMin = TIME_STEP, from = 7 * 60, to = 21 * 60): string[] {
  const out: string[] = [];
  for (let m = from; m <= to; m += stepMin) {
    out.push(formatMinutes(m));
  }
  return out;
}

export function nextRoundHourMinutes(now = new Date()): number {
  const m = now.getHours() * 60 + now.getMinutes();
  return snapMinutes(m + TIME_STEP);
}

export function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}
