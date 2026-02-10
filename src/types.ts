/** Number of cake layers (fixed at 3). */
export const CAKE_LAYERS = 3;

export type ThemeId = "default" | "cat" | "junk";

export interface BirthdayData {
  name: string;
  month: number; // 1-12
  day: number;   // 1-31
  layers: string[]; // hex colors, CAKE_LAYERS only
  created?: string; // YYYY-MM-DD when link was generated
  theme?: ThemeId;
}

export const DEFAULT_LAYER_COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#ffe66d",
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
