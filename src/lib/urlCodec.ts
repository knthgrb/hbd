import { CAKE_LAYERS, type BirthdayData } from "../types";

const PREFIX = "b";

/** Encode birthday data into a URL path + search params. Returns path like /b?n=...&m=2&d=26&c=...&created=... */
export function encodeBirthdayUrl(data: BirthdayData, baseUrl: string): string {
  const params = new URLSearchParams();
  params.set("n", data.name.trim());
  params.set("m", String(data.month));
  params.set("d", String(data.day));
  params.set("c", data.layers.slice(0, CAKE_LAYERS).map((c) => c.replace("#", "")).join(","));
  if (data.created) params.set("created", data.created);
  if (data.theme && data.theme !== "default") params.set("theme", data.theme);
  const path = `/${PREFIX}?${params.toString()}`;
  try {
    const url = new URL(path, baseUrl);
    return url.pathname + url.search;
  } catch {
    return path;
  }
}

/** Decode birthday data from current window location (path /b with query). */
export function decodeBirthdayUrl(): BirthdayData | null {
  const params = new URLSearchParams(window.location.search);
  const name = (params.get("n") ?? "").trim();
  const m = params.get("m");
  const d = params.get("d");
  const c = params.get("c");
  if (!m || !d) return null;
  const month = parseInt(m, 10);
  const day = parseInt(d, 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const rawLayers = c
    ? c.split(",").map((hex) => (hex.startsWith("#") ? hex : `#${hex}`))
    : ["#ff6b6b", "#4ecdc4", "#ffe66d"];
  const layers = rawLayers.slice(0, CAKE_LAYERS);
  const created = params.get("created") ?? undefined;
  const theme = (params.get("theme") as BirthdayData["theme"]) ?? "default";
  const themeId = theme === "cat" || theme === "junk" ? theme : "default";
  return { name, month, day, layers, created, theme: themeId };
}

/** Check if current route is the birthday card view. */
export function isBirthdayRoute(): boolean {
  return window.location.pathname === `/${PREFIX}`;
}
