import { useEffect, useRef } from "react";
import { loadImage } from "../features/frame/composeSoptWebFrame";

// Frame 전체 크기 (디자인 고정값)
const FRAME_WIDTH = 1104;
const FRAME_HEIGHT = 908;

// CSS padding 과 동일하게
const PADDING_TOP = 32;
const PADDING_BOTTOM = 16;
const PADDING_LEFT = 32;
const PADDING_RIGHT = 32;

// bottomArea 높이 (CSS .bottomArea height)
const BOTTOM_AREA_HEIGHT = 70;

export function useDiveSoptFrameCanvas(photoUrl: string | null) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!photoUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    (async () => {
      try {
        const [photoImg, logoImg] = await Promise.all([
          loadImage(photoUrl),
          loadImage("/ic-frame-dive-sopt-logo.svg"),
        ]);

        if (cancelled) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 캔버스 크기 고정
        const W = FRAME_WIDTH;
        const H = FRAME_HEIGHT;
        canvas.width = W;
        canvas.height = H;

        // 1) 배경 그라데이션 (240deg 대충 맞추기)
        // 오른쪽 위 -> 왼쪽 아래
        const grad = ctx.createLinearGradient(W, 0, 0, H);
        grad.addColorStop(0.3202, "#4B222A");
        grad.addColorStop(0.981, "#0F1010");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // 2) 사진 영역 (CSS 레이아웃 그대로)
        const photoX = PADDING_LEFT;
        const photoY = PADDING_TOP;
        const photoW = W - PADDING_LEFT - PADDING_RIGHT;
        const photoH =
          H -
          PADDING_TOP -
          PADDING_BOTTOM -
          BOTTOM_AREA_HEIGHT; // ← 패딩/바텀영역 다 빼줌

        // 검은 배경 박스
        ctx.fillStyle = "#000000";
        ctx.fillRect(photoX, photoY, photoW, photoH);

        // 3) 사진 그리기 (object-fit: cover)
        const vW = photoImg.naturalWidth || photoImg.width;
        const vH = photoImg.naturalHeight || photoImg.height;
        const srcAspect = vW / vH;
        const dstAspect = photoW / photoH;

        let sx = 0;
        let sy = 0;
        let sWidth = vW;
        let sHeight = vH;

        if (srcAspect > dstAspect) {
          // 좌우 자르기
          sHeight = vH;
          sWidth = vH * dstAspect;
          sx = (vW - sWidth) / 2;
        } else {
          // 상하 자르기
          sWidth = vW;
          sHeight = vW / dstAspect;
          sy = (vH - sHeight) / 2;
        }

        ctx.drawImage(
          photoImg,
          sx,
          sy,
          sWidth,
          sHeight,
          photoX,
          photoY,
          photoW,
          photoH,
        );

        // 4) 로고: bottomArea 중앙에 오도록 (CSS align-items: center와 동일)
        const bottomAreaTop = H - PADDING_BOTTOM - BOTTOM_AREA_HEIGHT;
        const bottomAreaCenterY = bottomAreaTop + BOTTOM_AREA_HEIGHT / 2;

        const logoW = 92;
        const logoScale = logoW / (logoImg.naturalWidth || logoW);
        const logoH = (logoImg.naturalHeight || logoW) * logoScale;

        const logoX = W / 2 - logoW / 2;
        const logoY = bottomAreaCenterY - logoH / 2; // ← 진짜 중앙

        ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
      } catch (e) {
        console.warn("DiveSoptFrame 캔버스 합성 실패", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [photoUrl]);

  return { canvasRef };
}
