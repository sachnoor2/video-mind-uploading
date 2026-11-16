import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const INK = "#0B0E14";
const AMBER = "#FFB020";
const TEAL = "#35D0BA";
const GREY = "#8A94A6";

const HEAD = "Inter, 'DejaVu Sans', Arial, sans-serif";

type P = { dur: number; caption?: string };

const inOut = (f: number, dur: number, a = 12, b = 14) => {
  const i = interpolate(f, [0, a], [0, 1], { extrapolateRight: "clamp" });
  const o = interpolate(f, [dur - b, dur], [1, 0], { extrapolateLeft: "clamp" });
  return Math.min(i, o);
};

const Frame: React.FC<{ caption?: string; kicker?: string; children: React.ReactNode; p: number }> = ({
  caption, kicker, children, p,
}) => (
  <AbsoluteFill style={{ backgroundColor: INK, fontFamily: HEAD, padding: 56, opacity: p }}>
    <div style={{ color: TEAL, fontSize: 22, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase" }}>
      {kicker ?? "Mind Uploading"}
    </div>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 56 }}>{children}</AbsoluteFill>
    <div
      style={{
        backgroundColor: "rgba(255,176,32,0.10)",
        borderLeft: `6px solid ${AMBER}`,
        padding: "22px 26px",
        borderRadius: 6,
        color: "#FFFFFF",
        fontSize: 34,
        fontWeight: 700,
        lineHeight: 1.25,
      }}
    >
      {caption ?? ""}
    </div>
  </AbsoluteFill>
);

const Brain: React.FC<{ p: number; color?: string }> = ({ p, color = AMBER }) => (
  <svg width={340} height={340} viewBox="0 0 100 100" style={{ transform: `scale(${0.9 + p * 0.1})` }}>
    <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth={2.5} opacity={0.9} />
    <path d="M50 22 C34 22 26 32 26 42 C18 48 20 62 30 66 C34 76 46 80 50 78" fill="none" stroke={color} strokeWidth={2.5} />
    <path d="M50 22 C66 22 74 32 74 42 C82 48 80 62 70 66 C66 76 54 80 50 78" fill="none" stroke={color} strokeWidth={2.5} />
    <line x1="50" y1="24" x2="50" y2="76" stroke={color} strokeWidth={2} opacity={0.55} />
    <circle cx="38" cy="44" r="3" fill={TEAL} />
    <circle cx="62" cy="52" r="3" fill={TEAL} />
    <circle cx="50" cy="66" r="3" fill={TEAL} />
  </svg>
);

const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children, size = 84, color = "#FFFFFF",
}) => (
  <div style={{ fontSize: size, fontWeight: 900, color, lineHeight: 1.05, textAlign: "center", letterSpacing: -1 }}>
    {children}
  </div>
);

const Hook: React.FC<P> = ({ dur, caption }) => {
  const f = useCurrentFrame();
  const p = inOut(f, dur);
  const s = spring({ frame: f, fps: 30, config: { damping: 14 } });
  return (
    <Frame caption={caption} p={p}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <Brain p={s} />
        <Big size={92}>IMMORTAL?</Big>
        <div style={{ color: GREY, fontSize: 30, letterSpacing: 2 }}>brain -&gt; computer</div>
      </div>
    </Frame>
  );
};

const Setup: React.FC<P> = ({ dur, caption }) => {
  const f = useCurrentFrame();
  const p = inOut(f, dur);
  return (
    <Frame caption={caption} p={p}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 56, height: 56, borderRadius: 8,
                backgroundColor: f % 40 > i * 6 ? AMBER : "rgba(255,176,32,0.16)",
              }}
            />
          ))}
        </div>
        <Big size={70}>MIND{"\n"}UPLOADING</Big>
        <div style={{ color: GREY, fontSize: 28, textAlign: "center", maxWidth: 560 }}>
          copy every neuron, run it on silicon
        </div>
      </div>
    </Frame>
  );
};

const Numbers: React.FC<P> = ({ dur, caption }) => {
  const f = useCurrentFrame();
  const p = inOut(f, dur);
  const n = Math.round(interpolate(f, [0, Math.min(70, dur - 20)], [0, 86], { extrapolateRight: "clamp" }));
  return (
    <Frame caption={caption} p={p}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <Big size={150} color={AMBER}>{n}</Big>
        <Big size={54}>BILLION</Big>
        <div style={{ color: GREY, fontSize: 28 }}>neurons, each with thousands of links</div>
      </div>
    </Frame>
  );
};

const Problem: React.FC<P> = ({ dur, caption }) => {
  const f = useCurrentFrame();
  const p = inOut(f, dur);
  const drift = interpolate(f, [0, dur], [0, 40]);
  return (
    <Frame caption={caption} p={p}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <svg width={300} height={300} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(138,148,166,0.3)" strokeWidth={1} />
          <circle cx="50" cy="50" r="4" fill={AMBER} transform={`translate(${drift * 0.2} ${drift * 0.1})`} />
          <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(138,148,166,0.2)" strokeWidth={1} />
          <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(138,148,166,0.2)" strokeWidth={1} />
        </svg>
        <Big size={56}>a fly is still{"\n"}too much</Big>
      </div>
    </Frame>
  );
};

const Swap: React.FC<P> = ({ dur, caption }) => {
  const f = useCurrentFrame();
  const p = inOut(f, dur);
  const slide = interpolate(f, [0, dur * 0.6], [0, 40], { extrapolateRight: "clamp" });
  const Sil: React.FC<{ color: string; x: number }> = ({ color, x }) => (
    <svg width={120} height={260} viewBox="0 0 60 130" style={{ transform: `translateX(${x}px)` }}>
      <circle cx="30" cy="24" r="16" fill="none" stroke={color} strokeWidth={3} />
      <path d="M30 42 L30 92 M30 56 L10 76 M30 56 L50 76 M30 92 L14 126 M30 92 L46 126"
        fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
  return (
    <Frame caption={caption} p={p}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <Sil color={GREY} x={-slide} />
        <div style={{ color: AMBER, fontSize: 56, fontWeight: 900 }}>-&gt;</div>
        <Sil color={TEAL} x={slide} />
      </div>
    </Frame>
  );
};

const Copy: React.FC<P> = ({ dur, caption }) => {
  const f = useCurrentFrame();
  const p = inOut(f, dur);
  const split = interpolate(f, [8, dur * 0.55], [0, 150], { extrapolateRight: "clamp" });
  const Card: React.FC<{ label: string; color: string; x: number; op: number }> = ({ label, color, x, op }) => (
    <div
      style={{
        position: "absolute", width: 190, height: 240, borderRadius: 14,
        border: `3px solid ${color}`, backgroundColor: "rgba(255,255,255,0.03)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color, fontSize: 26, fontWeight: 800, transform: `translateX(${x}px)`, opacity: op,
      }}
    >
      {label}
    </div>
  );
  return (
    <Frame caption={caption} p={p}>
      <div style={{ position: "relative", width: 480, height: 260 }}>
        <Card label="YOU" color={AMBER} x={-split} op={1} />
        <Card label="COPY" color={TEAL} x={split} op={interpolate(f, [10, 26], [0, 1], { extrapolateRight: "clamp" })} />
      </div>
    </Frame>
  );
};

const Resolve: React.FC<P> = ({ dur, caption }) => {
  const f = useCurrentFrame();
  const p = inOut(f, dur);
  const away = interpolate(f, [10, dur - 16], [0, 220], { extrapolateRight: "clamp" });
  return (
    <Frame caption={caption} p={p}>
      <div style={{ position: "relative", width: 520, height: 260 }}>
        <div style={{
          position: "absolute", left: 40, top: 60, width: 150, height: 150, borderRadius: "50%",
          border: `4px solid ${AMBER}`, display: "flex", alignItems: "center", justifyContent: "center",
          color: AMBER, fontSize: 24, fontWeight: 800,
        }}>YOU</div>
        <div style={{
          position: "absolute", left: 215 + away * 0.55, top: 60, width: 150, height: 150, borderRadius: "50%",
          border: `4px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center",
          color: TEAL, fontSize: 22, fontWeight: 800,
        }}>COPY</div>
      </div>
    </Frame>
  );
};

const Recap: React.FC<P> = ({ dur, caption }) => {
  const f = useCurrentFrame();
  const p = inOut(f, dur);
  return (
    <Frame caption={caption} p={p}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ width: 120, height: 6, backgroundColor: AMBER, borderRadius: 3 }} />
        <Big size={64}>NOT A DEVICE.{"\n"}A QUESTION.</Big>
      </div>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<P>> = {
  "01-hook": Hook,
  "02-setup": Setup,
  "03-numbers": Numbers,
  "04-problem": Problem,
  "05-swap": Swap,
  "06-copy": Copy,
  "07-resolve": Resolve,
  "08-recap": Recap,
};
