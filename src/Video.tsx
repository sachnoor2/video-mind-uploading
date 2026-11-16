import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import manifest from "./manifest.json";
import { SCENES } from "./scenes";

export const Video: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0E14" }}>
      {(manifest as any).scenes.map((s: any) => {
        const from = cursor;
        cursor += s.frames;
        const Scene = SCENES[s.id] ?? SCENES["01-hook"];
        return (
          <Sequence key={s.id} from={from} durationInFrames={s.frames}>
            <Scene dur={s.frames} caption={s.caption} />
            <Audio src={staticFile(`audio/${s.id}.wav`)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
