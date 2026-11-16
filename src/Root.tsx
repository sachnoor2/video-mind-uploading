import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import manifest from "./manifest.json";

const total = (manifest as any).scenes.reduce((a: number, s: any) => a + s.frames, 0);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    durationInFrames={total}
    fps={(manifest as any).fps ?? 30}
    width={720}
    height={1280}
  />
);
