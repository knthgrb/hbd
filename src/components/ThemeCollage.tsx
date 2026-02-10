import type { ThemeId } from "../types";
import "./ThemeCollage.css";

/** Cute cat photos for cat theme */
const CAT_IMAGES = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&q=80",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=120&q=80",
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=120&q=80",
  "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=120&q=80",
  "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=120&q=80",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=120&q=80",
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=120&q=80",
  "https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=120&q=80",
];

/** Junk journaling: scrapbook, journal pages, vintage paper, washi tape */
const JUNK_IMAGES = [
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=120&q=80",
  "https://images.unsplash.com/photo-1596495578065-6e0763fa16b1?w=120&q=80",
  "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=120&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&q=80",
  "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=120&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=120&q=80",
  "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=120&q=80",
];

const COLLAGE_POSITIONS = [
  { top: "4%", left: "2%", width: 72, rotate: -8 },
  { top: "3%", right: "5%", width: 64, rotate: 6 },
  { top: "28%", left: "0%", width: 56, rotate: -5 },
  { top: "25%", right: "0%", width: 60, rotate: 4 },
  { bottom: "22%", left: "3%", width: 68, rotate: 5 },
  { bottom: "20%", right: "2%", width: 58, rotate: -6 },
  { bottom: "2%", left: "18%", width: 52, rotate: -3 },
  { bottom: "4%", right: "15%", width: 56, rotate: 4 },
];

interface ThemeCollageProps {
  theme: ThemeId;
  compact?: boolean;
}

export default function ThemeCollage({ theme, compact }: ThemeCollageProps) {
  if (theme !== "cat" && theme !== "junk") return null;

  const images = theme === "cat" ? CAT_IMAGES : JUNK_IMAGES;
  const className = `theme-collage theme-collage--${theme}${compact ? " theme-collage--compact" : ""}`;

  return (
    <div className={className} aria-hidden="true">
      {COLLAGE_POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="theme-collage-item"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            width: `${compact ? Math.round(pos.width * 0.6) : pos.width}px`,
            transform: `rotate(${pos.rotate}deg)`,
          }}
        >
          <img src={images[i % images.length]} alt="" loading="lazy" />
        </div>
      ))}
    </div>
  );
}
