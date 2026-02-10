import { useCallback, useEffect, useMemo, useState } from "react";
import { useBlowDetection } from "../hooks/useBlowDetection";
import { isBlownToday, setBlownToday } from "../lib/blownStorage";
import { getCountdown } from "../lib/countdown";
import { decodeBirthdayUrl } from "../lib/urlCodec";
import ThemeCollage from "../components/ThemeCollage";
import Footer from "../components/Footer";
import { CAKE_LAYERS, MONTH_NAMES } from "../types";
import "./BirthdayPage.css";
import "./themes/cat.css";
import "./themes/junk.css";

export default function BirthdayPage() {
  const [data] = useState(() => decodeBirthdayUrl());
  const [countdown, setCountdown] = useState(() =>
    data ? getCountdown(data.month, data.day) : null,
  );
  const [blownOut, setBlownOut] = useState(() => {
    if (!data) return false;
    return isBlownToday(data.name, data.month, data.day);
  });

  const onBlow = useCallback(() => {
    if (!data) return;
    setBlownOut(true);
    setBlownToday(data.name, data.month, data.day);
  }, [data]);

  const { start, stop, error, listening } = useBlowDetection(onBlow);

  useEffect(() => {
    if (!data) return;
    const t = setInterval(() => {
      setCountdown(getCountdown(data.month, data.day));
    }, 1000);
    return () => clearInterval(t);
  }, [data]);

  useEffect(() => {
    if (blownOut) stop();
  }, [blownOut, stop]);

  if (!data) {
    return (
      <div className="birthday-page birthday-page--error">
        <p>Invalid or missing birthday link.</p>
        <a href="/">Create your own link</a>
        <Footer />
      </div>
    );
  }

  const nameRaw = data.name.trim();
  const name = nameRaw ? `${nameRaw}'s` : "";
  const nameForCake = nameRaw || "";
  const cd = countdown!;
  const isToday = cd.isToday && cd.days === 0 && cd.hours < 24;
  const layers = data.layers.slice(0, CAKE_LAYERS);

  const themeClass =
    data.theme && data.theme !== "default"
      ? `birthday-page--${data.theme}`
      : "";

  const blowTexts = useMemo(
    () => [
      { text: "blow", left: 8, top: 12, rot: -12 },
      { text: "blow", left: 88, top: 18, rot: 8 },
      { text: "blow", left: 15, top: 45, rot: 5 },
      { text: "blow", left: 82, top: 38, rot: -18 },
      { text: "blow", left: 72, top: 72, rot: 3 },
      { text: "blow", left: 22, top: 78, rot: -8 },
      { text: "blow", left: 92, top: 55, rot: 14 },
      { text: "blow", left: 5, top: 62, rot: -5 },
      { text: "blow", left: 78, top: 88, rot: 10 },
      { text: "blow", left: 45, top: 25, rot: -3 },
      { text: "blow", left: 55, top: 82, rot: 7 },
    ],
    [],
  );

  return (
    <div className={`birthday-page ${themeClass}`.trim()}>
      <div className="blow-texts-layer" aria-hidden>
        {blowTexts.map((item, i) => (
          <span
            key={i}
            className="cake-blow-text"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              transform: `translate(-50%, -50%) rotate(${item.rot}deg)`,
            }}
          >
            {item.text}
          </span>
        ))}
      </div>
      {(data.theme === "cat" || data.theme === "junk") && (
        <ThemeCollage theme={data.theme} />
      )}

      <div className="birthday-countdown">
        {isToday ? (
          <h2 className="birthday-countdown-title">
            🎉 It's {name || "birthday"} today!
          </h2>
        ) : (
          <>
            <h2 className="birthday-countdown-title">
              Countdown to {name ? `${name} ` : ""}birthday
            </h2>
            <p className="birthday-date">
              {MONTH_NAMES[data.month - 1]} {data.day}
            </p>
            <div className="birthday-countdown-grid">
              <div className="birthday-countdown-item">
                <span className="birthday-countdown-value">{cd.days}</span>
                <span className="birthday-countdown-label">Days</span>
              </div>
              <div className="birthday-countdown-item">
                <span className="birthday-countdown-value">
                  {String(cd.hours).padStart(2, "0")}
                </span>
                <span className="birthday-countdown-label">Hours</span>
              </div>
              <div className="birthday-countdown-item">
                <span className="birthday-countdown-value">
                  {String(cd.minutes).padStart(2, "0")}
                </span>
                <span className="birthday-countdown-label">Min</span>
              </div>
              <div className="birthday-countdown-item">
                <span className="birthday-countdown-value">
                  {String(cd.seconds).padStart(2, "0")}
                </span>
                <span className="birthday-countdown-label">Sec</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="cake-container">
        <div className="cake-wrapper">
          <div className="cake">
            {layers.map((color, i) => (
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
              {!blownOut ? (
                <div className="flame-wrap">
                  <div className="flame" />
                </div>
              ) : (
                <div className="smoke-wrap">
                  <div className="smoke s1" />
                  <div className="smoke s2" />
                  <div className="smoke s3" />
                </div>
              )}
            </div>
          </div>
          <div className="cake-plate" />
        </div>
        <p className="cake-label">cheesecake ni</p>
      </div>

      {!blownOut && (
        <div className="blow-section">
          {!listening ? (
            <button type="button" className="blow-btn" onClick={start}>
              Blow
            </button>
          ) : (
            <p className="blow-hint">
              Blow into your phone or laptop microphone!
            </p>
          )}
          {error && <p className="blow-error">{error}</p>}
        </div>
      )}

      {blownOut && (
        <>
          {isToday ? (
            <>
              <p className="birthday-wish">
                Happy Birthday{nameForCake ? `, ${nameForCake}` : ""}! 🎂✨
              </p>
              <p className="birthday-gift-msg">
                You unlocked the gift! 🎁 (Candle resets tomorrow.)
              </p>
            </>
          ) : (
            <p className="birthday-wish">Yey! 🎉</p>
          )}
        </>
      )}

      <a href="/hbd" className="birthday-back-link">
        Create your own birthday link
      </a>

      <Footer />
    </div>
  );
}
