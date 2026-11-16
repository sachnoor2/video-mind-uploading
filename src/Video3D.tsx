import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import manifest from "./manifest3d.json";

const Shot: React.FC<{ id: string; caption: string }> = ({ id, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0E14" }}>
      <Img
        src={staticFile(`frames/${id}/${String(f + 1).padStart(4, "0")}.png`)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: 52 }}>
        <div style={{
          backgroundColor: "rgba(11,14,20,0.74)", borderLeft: "6px solid #FFB020",
          padding: "20px 24px", borderRadius: 6, color: "#FFFFFF",
          fontSize: 32, fontWeight: 800, lineHeight: 1.25,
          fontFamily: "Inter, 'DejaVu Sans', Arial, sans-serif",
        }}>{caption}</div>
      </AbsoluteFill>
      <Audio src={staticFile(`audio3d/${id}.wav`)} />
    </AbsoluteFill>
  );
};

export const Video3D: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0E14" }}>
      {(manifest as any).scenes.map((s: any) => {
        const from = cursor;
        cursor += s.frames;
        return (
          <Sequence key={s.id} from={from} durationInFrames={s.frames}>
            <Shot id={s.id} caption={s.caption} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
