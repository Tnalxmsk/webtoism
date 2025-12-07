import { useEffect, useRef } from "react";
import { loadImage } from "../features/frame/loadImage.ts";

const FRAME_WIDTH = 1104;
const FRAME_HEIGHT = 908;

// SoptWebFrame.module.css 기준
const FRAME_PADDING_TOP = 32;
const FRAME_PADDING_LEFT = 32;
const FRAME_PADDING_BOTTOM = 0;

const BOTTOM_AREA_HEIGHT = 70;
const PATTERN_HEIGHT = 28;
const PATTERN_BOTTOM_OFFSET = 10;

export function useSoptWebFrameCanvas(photoUrl: string | null) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!photoUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    (async () => {
      try {
        const [photoImg, patternImg, logoImg] = await Promise.all([
          loadImage(photoUrl),
          loadImage("/img-frame-sopt-web-logo.png"),
          loadImage("/ic-frame-sopt-web-logo.svg"),
        ]);

        if (cancelled) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 캔버스 고정 해상도
        const W = FRAME_WIDTH;
        const H = FRAME_HEIGHT;
        canvas.width = W;
        canvas.height = H;

        // 1) 배경 그라데이션 (CSS 시각 결과에 맞춘 색)
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, "#FAF3F4");
        grad.addColorStop(1, "#F9D6DB");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);


        // 2) 사진 영역 (흰 박스)
        const photoX = FRAME_PADDING_LEFT;
        const photoY = FRAME_PADDING_TOP;
        const photoW = W - FRAME_PADDING_LEFT * 2;
        const photoH =
          H -
          FRAME_PADDING_TOP -
          FRAME_PADDING_BOTTOM -
          BOTTOM_AREA_HEIGHT;

        ctx.fillStyle = "#FFFFFF";
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

        // 4) 사진 안쪽 하단 패턴 바 (CSS: bottom: 10px)
        const patternH = PATTERN_HEIGHT;
        const scale =
          patternH /
          (patternImg.naturalHeight || patternImg.height || patternH);
        const patternW =
          (patternImg.naturalWidth || patternImg.width || patternH) * scale;

        const patternY =
          photoY + photoH - patternH - PATTERN_BOTTOM_OFFSET;
        const patternCount = Math.ceil(photoW / patternW) + 1;

        for (let i = 0; i < patternCount; i++) {
          const x = photoX + i * patternW;
          ctx.drawImage(patternImg, x, patternY, patternW, patternH);
        }

        const bottomTop = H - BOTTOM_AREA_HEIGHT;

        const logoW = 70;
        const logoScale =
          logoW / (logoImg.naturalWidth || logoImg.width || logoW);
        const logoH =
          (logoImg.naturalHeight || logoImg.height || logoW) * logoScale;
        const logoX = W / 2 - logoW / 2;
        const logoY = bottomTop + (BOTTOM_AREA_HEIGHT - logoH) / 2;

        ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
      } catch (e) {
        console.warn("SoptWebFrame 캔버스 합성 실패", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [photoUrl]);

  return { canvasRef };
}
