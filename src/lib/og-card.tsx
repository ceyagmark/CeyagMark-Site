/**
 * Shared layout for the per-case-study link-preview cards.
 *
 * Split out of src/app/opengraph-image.tsx so the four case-study routes (and
 * any future one) don't each carry their own copy of the star field and
 * frame. Each route still owns its own generated PNG at its own URL — this
 * only shares the JSX that builds it.
 */

export const OG_CARD_SIZE = { width: 1200, height: 630 };

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
      size: r < 0.82 ? 2 : r < 0.96 ? 3 : 4,
      opacity: r < 0.82 ? 0.28 : r < 0.96 ? 0.55 : 0.9,
    };
  });
}

export function CaseStudyCard({
  eyebrow,
  stat,
  statColor = "#6aa6ff",
  sub,
}: {
  eyebrow: string;
  stat: string;
  statColor?: string;
  sub: string;
}) {
  return (
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
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", color: "#eef3fc", display: "flex" }}>
          Ceyag<span style={{ color: "#2e86ff" }}>mark</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 26, fontWeight: 600, color: "#46d39a", display: "flex" }}>{eyebrow}</div>
        <div
          style={{
            marginTop: 18,
            fontSize: 148,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: statColor,
            display: "flex",
          }}
        >
          {stat}
        </div>
        <div style={{ marginTop: 22, fontSize: 32, lineHeight: 1.4, color: "#b3c0db", maxWidth: 920, display: "flex" }}>
          {sub}
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
        <div style={{ fontSize: 24, color: "#74829f", display: "flex" }}>ceyagmark.com</div>
        <div style={{ fontSize: 24, color: "#74829f", display: "flex" }}>Case study</div>
      </div>
    </div>
  );
}
