import type { Frame } from "../types/frame.ts";
import { composeSoptWebFrame } from "./frame/composeSoptWebFrame.ts";

export type FrameComposerResult = {
  canvas: HTMLCanvasElement;
  dataUrl: string;
};

export type FrameComposer = (photoUrl: string) => Promise<FrameComposerResult>;

// 프레임 id 기준으로 매핑
const frameComposerMap: Record<Frame["id"], FrameComposer> = {
  "gradient-top": composeSoptWebFrame, // 지금은 이 프레임만
  // "dive-soft": composeDiveSoftFrame,
  // "ufo": composeUfoFrame,
};

export function getFrameComposer(frame: Frame | null): FrameComposer | null {
  if (!frame) return null;
  return frameComposerMap[frame.id] ?? null;
}
