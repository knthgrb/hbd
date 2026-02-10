import { useState } from "react";
import BirthdatePicker from "../components/BirthdatePicker";
import Footer from "../components/Footer";
import CakePreview from "../components/CakePreview";
import { encodeBirthdayUrl } from "../lib/urlCodec";
import { CAKE_LAYERS, DEFAULT_LAYER_COLORS, type BirthdayData, type ThemeId } from "../types";
import "./CreatorPage.css";
import "./BirthdayPage.css";
import "./themes/cat.css";
import "./themes/junk.css";

const THEMES: { id: ThemeId; label: string; description: string }[] = [
  { id: "default", label: "Default", description: "Clean & simple" },
  { id: "cat", label: "🐱 Cat", description: "Cute & cozy" },
  { id: "junk", label: "📓 Junk journal", description: "Paper & tape" },
];

export default function CreatorPage() {
  const [name, setName] = useState("");
  const [month, setMonth] = useState(2);
  const [day, setDay] = useState(26);
  const [theme, setTheme] = useState<ThemeId>("default");
  const [layers, setLayers] = useState<string[]>(() =>
    DEFAULT_LAYER_COLORS.slice(0, CAKE_LAYERS)
  );
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const generateLink = () => {
    const created = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const data: BirthdayData = {
      name: name.trim(),
      month,
      day,
      layers: layers.slice(0, CAKE_LAYERS),
      created,
      theme,
    };
    const path = encodeBirthdayUrl(data, baseUrl);
    setLink(`${baseUrl}${path}`);
  };

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const setLayerColor = (index: number, color: string) => {
    setLayers((prev) => {
      const next = [...prev];
      next[index] = color;
      return next;
    });
  };

  return (
    <div className="creator-page">
      <div className="creator-form">
        <div className="creator-card">
          <h1 className="creator-title">🎂 Create a Birthday Link</h1>
          <p className="creator-subtitle">
            Enter details below. Preview updates as you type.
          </p>

          <label className="creator-label">Name</label>
        <input
          type="text"
          className="creator-input"
          placeholder="e.g. Chuchu"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <BirthdatePicker
          label="Birthday"
          month={month}
          day={day}
          onChange={(m, d) => {
            setMonth(m);
            setDay(d);
          }}
        />

        <label className="creator-label">Theme</label>
        <div className="creator-themes">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`creator-theme-btn ${theme === t.id ? "active" : ""}`}
              onClick={() => setTheme(t.id)}
              title={t.description}
            >
              <span className="creator-theme-label">{t.label}</span>
              <span className="creator-theme-desc">{t.description}</span>
            </button>
          ))}
        </div>

        <label className="creator-label">Cake layer colors</label>
        <div className="creator-colors">
          {layers.map((color, i) => (
            <label key={i} className="creator-color-swatch">
              <span className="creator-layer-num">Layer {i + 1}</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setLayerColor(i, e.target.value)}
                className="creator-color-input"
              />
            </label>
          ))}
        </div>

        <button type="button" className="creator-btn creator-btn-primary" onClick={generateLink}>
          Generate link
        </button>

        {link && (
          <div className="creator-link-box">
            <input readOnly className="creator-link-input" value={link} />
            <button
              type="button"
              className={`creator-btn creator-btn-copy ${copied ? "copied" : ""}`}
              onClick={copyLink}
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        )}
        </div>
      </div>

      <div className="creator-right">
        <div className="creator-preview">
          <p className="creator-preview-title">Preview</p>
          <CakePreview
            name={name}
            month={month}
            day={day}
            layers={layers}
            theme={theme}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}
