import { getDaysUntilBirthdayFrom } from "./countdown";

/** created and today in YYYY-MM-DD; birthday month (1-12), day (1-31). */
export function getDaysSinceCreated(created: string | undefined): number | null {
  if (!created) return null;
  try {
    const [y, m, d] = created.split("-").map(Number);
    const createdDate = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    createdDate.setHours(0, 0, 0, 0);
    const diff = today.getTime() - createdDate.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  } catch {
    return null;
  }
}

export interface MilestoneItem {
  id: string;
  label: string;
  day: number;
  unlocked: boolean;
  isGift?: boolean;
}

const MAX_DAYS_LEFT = 60;

/** How many days until birthday on the day the link was created. */
function getInitialDaysLeft(created: string | undefined, month: number, day: number): number | null {
  if (!created) return null;
  try {
    const [y, m, d] = created.split("-").map(Number);
    const createdDate = new Date(y, m - 1, d);
    return getDaysUntilBirthdayFrom(createdDate, month, day);
  } catch {
    return null;
  }
}

/** Milestones: all days left (from creation to birthday). Each day that passes is checked. Gift is checked when blown (localStorage). */
export function getMilestones(
  created: string | undefined,
  month: number,
  day: number,
  daysLeft: number,
  blownOut: boolean
): MilestoneItem[] {
  const initialDaysLeft = getInitialDaysLeft(created, month, day);
  // Show all days from start (when link was created) or from current countdown; always at least current days left
  const total = Math.min(
    Math.max(initialDaysLeft ?? daysLeft, daysLeft, 1),
    MAX_DAYS_LEFT
  );
  const list: MilestoneItem[] = [];
  for (let n = total; n >= 1; n--) {
    const unlocked = daysLeft < n; // checked when that day is in the past
    list.push({
      id: `left-${n}`,
      label: n === 1 ? "1 day left" : `${n} days left`,
      day: n,
      unlocked,
    });
  }
  list.push({ id: "gift", label: "Gift", day: -1, unlocked: blownOut, isGift: true });
  return list;
}
