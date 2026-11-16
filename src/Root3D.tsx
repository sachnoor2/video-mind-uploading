import React from "react";
import { Composition } from "remotion";
import { Video3D } from "./Video3D";
import manifest from "./manifest3d.json";

const total = (manifest as any).scenes.reduce((a: number, s: any) => a + s.frames, 0);

export const Root3D: React.FC = () => (
  <Composition id="Video3D" component={Video3D} durationInFrames={total}
    fps={(manifest as any).fps ?? 30} width={720} height={1280} />
);
