import { useEffect, useState } from "react";
import { getCountdown } from "../lib/countdown";
import ThemeCollage from "./ThemeCollage";
import { CAKE_LAYERS, MONTH_NAMES, type ThemeId } from "../types";

interface CakePreviewProps {
  name: string;
  month: number;
  day: number;
  layers: string[];
  theme: ThemeId;
}

export default function CakePreview({ name, month, day, layers, theme }: CakePreviewProps) {
  const [countdown, setCountdown] = useState(() => getCountdown(month, day));

  useEffect(() => {
    const t = setInterval(() => setCountdown(getCountdown(month, day)), 1000);
    return () => clearInterval(t);
  }, [month, day]);

  const nameRaw = name.trim();
  const displayName = nameRaw ? `${nameRaw}'s` : "";
  const cd = countdown;
  const isToday = cd.isToday && cd.days === 0 && cd.hours < 24;
  const layerColors = layers.slice(0, CAKE_LAYERS);
  const themeClass = theme !== "default" ? `birthday-page--${theme}` : "";

  return (
    <div className={`creator-preview-inner birthday-page ${themeClass}`.trim()}>
      {(theme === "cat" || theme === "junk") && (
        <ThemeCollage theme={theme} compact />
      )}
      <div className="birthday-countdown">
        {isToday ? (
          <h2 className="birthday-countdown-title">🎉 It's {displayName || "birthday"} today!</h2>
        ) : (
          <>
            <h2 className="birthday-countdown-title">
              Countdown to {displayName ? `${displayName} ` : ""}birthday
            </h2>
            <p className="birthday-date">
              {MONTH_NAMES[month - 1]} {day}
            </p>
            <div className="birthday-countdown-grid">
              <div className="birthday-countdown-item">
                <span className="birthday-countdown-value">{cd.days}</span>
                <span className="birthday-countdown-label">Days</span>
              </div>
              <div className="birthday-countdown-item">
                <span className="birthday-countdown-value">{String(cd.hours).padStart(2, "0")}</span>
                <span className="birthday-countdown-label">Hours</span>
              </div>
              <div className="birthday-countdown-item">
                <span className="birthday-countdown-value">{String(cd.minutes).padStart(2, "0")}</span>
                <span className="birthday-countdown-label">Min</span>
              </div>
              <div className="birthday-countdown-item">
                <span className="birthday-countdown-value">{String(cd.seconds).padStart(2, "0")}</span>
                <span className="birthday-countdown-label">Sec</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="cake-container">
        <div className="cake">
          {layerColors.map((color, i) => (
            <div
              key={i}
              className="cake-layer"
              style={{
                backgroundColor: color,
                boxShadow: `inset 0 -8px 0 rgba(0,0,0,0.1), 0 6px 0 rgba(0,0,0,0.08)`,
              }}
            />
          ))}
          <div className="candle-wrap">
            <div className="candle" />
            <div className="flame-wrap">
              <div className="flame" />
            </div>
          </div>
        </div>
        <div className="cake-plate" />
      </div>
      <p className="creator-preview-hint">Preview — this is how the link will look</p>
    </div>
  );
}
