import { DOW_FULL } from "../services/interface"; 
import type { DayRecord } from "../services/interface"; 

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Returns 0 = Mon … 6 = Sun */
export function getDow(year: number, month: number, day: number): number {
  const d = new Date(year, month - 1, day).getDay();
  return d === 0 ? 6 : d - 1;
}

export function padZ(n: number): string {
  return String(n).padStart(2, "0");
}

export function getDowLabel(year: number, month: number, day: number): string {
  return DOW_FULL[getDow(year, month, day)];
}

/**
 * Builds a 2-D grid (weeks × 7 days) for the given month.
 * Empty leading/trailing cells are `null`.
 */
export function buildCalendarWeeks(
  year: number,
  month: number
): (number | null)[][] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow    = getDow(year, month, 1);

  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

/** Aggregate stats from the current month's records */
export function computeStats(records: DayRecord[]) {
  return {
    tongCong: records.filter((r) => r.type === "full" || r.type === "overtime").length,
    lamThem:  records.filter((r) => r.type === "overtime").length,
    diMuon:   records.filter((r) => r.type === "lack").length,
    nghi:     records.filter((r) => r.type === "unpaid_leave" || r.type === "absent").length,
  };
}