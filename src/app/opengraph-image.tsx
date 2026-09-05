import { ImageResponse } from "next/og";

/**
 * The link preview card for WhatsApp, Facebook, LinkedIn and X.
 *
 * Generated rather than shipped as a binary: the previous setup pointed
 * og:image at /og-cover.png, which did not exist, so every share of the site
 * rendered with no image at all. A generated card cannot drift out of sync
 * with the brand and cannot 404.
 *
 * Satori (what renders this) supports a subset of CSS: flexbox only, no grid,
 * no CSS variables, and every element with more than one child needs an
 * explicit display. Colours are the dark-theme tokens written out by hand.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "CeyagMark — we build the site and run the marketing on it";

/**
 * Deterministic star field. A seeded generator, not Math.random, so the card
 * is byte-identical on every build and CDN caches stay valid.
 */
function stars(count: number) {
  let seed = 0x9e3779b9;
  const next = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed >>> 0) % 100000) / 100000;
  };
  return Array.from({ length: count }, () => {
    const r = next();
    return {
      left: next() * 100,
      top: next() * 100,
      // Most stars are faint; a few carry the image. Mirrors the magnitude
      // curve on the site's canvas sky.
      size: r < 0.82 ? 2 : r < 0.96 ? 3 : 4,
      opacity: r < 0.82 ? 0.28 : r < 0.96 ? 0.55 : 0.9,
    };
  });
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 76px",
          backgroundColor: "#050a16",
          backgroundImage:
            "radial-gradient(1000px 620px at 78% 8%, rgba(46,134,255,0.20), transparent 62%), radial-gradient(760px 520px at 8% 96%, rgba(70,211,154,0.10), transparent 60%)",
          position: "relative",
        }}
      >
        {stars(110).map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              borderRadius: s.size,
              backgroundColor: "#dce9ff",
              opacity: s.opacity,
            }}
          />
        ))}

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#eef3fc",
              display: "flex",
            }}
          >
            Ceyag<span style={{ color: "#2e86ff" }}>mark</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#eef3fc",
              maxWidth: 900,
              display: "flex",
            }}
          >
            We build the site and run the marketing on it.
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 29,
              lineHeight: 1.45,
              color: "#b3c0db",
              maxWidth: 820,
              display: "flex",
            }}
          >
            So the conversions are ours to prove.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1e2c4a",
            paddingTop: 26,
          }}
        >
          <div style={{ fontSize: 24, color: "#74829f", display: "flex" }}>
            ceyagmark.com
          </div>
          <div style={{ fontSize: 24, color: "#46d39a", display: "flex" }}>
            Web · Paid ads · SEO · CRO
          </div>
        </div>
      </div>
    ),
    size
  );
}
