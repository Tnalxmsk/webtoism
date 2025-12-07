import { useEffect, useRef } from "react";
import { loadImage } from "../features/frame/composeSoptWebFrame";

const W = 1104;
const H = 908;
const PADDING = 32;
const BOTTOM_FRAME = 70;

// ✅ WebAlienFrame.tsx에서 실제 쓰는 src랑 반드시 똑같이 맞춰줘
const UFO_SRC = "/img-frame-web-alien-ufo.png";
const CIRCLE_SRC = "/img-frame-web-alien-circle.png";
const DASH_SRC = "/ic-frame-web-alien-dash.svg";

export function useWebAlienFrameCanvas(photoUrl: string | null) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!photoUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    (async () => {
      try {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = W;
        canvas.height = H;

        // 1) 사진만 먼저 로드
        const photoImg = await loadImage(photoUrl);
        if (cancelled) return;

        // --- 공통 레이아웃 값 ---
        const photoX = PADDING;
        const photoY = PADDING;
        const photoW = W - PADDING * 2;
        const photoH = H - PADDING * 2 - BOTTOM_FRAME;
        const photoBottom = photoY + photoH;

        // 2) 파란 배경
        ctx.fillStyle = "#00ADFF";
        ctx.fillRect(0, 0, W, H);

        // 3) 흰 박스
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(photoX, photoY, photoW, photoH);

        // 4) 사진 object-fit: cover
        const vw = photoImg.naturalWidth || photoImg.width;
        const vh = photoImg.naturalHeight || photoImg.height;
        const srcAsp = vw / vh;
        const dstAsp = photoW / photoH;

        let sx = 0, sy = 0, sw = vw, sh = vh;

        if (srcAsp > dstAsp) {
          sh = vh;
          sw = sh * dstAsp;
          sx = (vw - sw) / 2;
        } else {
          sw = vw;
          sh = sw / dstAsp;
          sy = (vh - sh) / 2;
        }

        ctx.drawImage(photoImg, sx, sy, sw, sh, photoX, photoY, photoW, photoH);

        // ---------------------------
        // 5) 오버레이는 개별적으로 로드 + 실패 허용
        // ---------------------------

        // UFO
        try {
          const ufoImg = await loadImage(UFO_SRC);
          if (!cancelled) {
            const ufoW = 210;
            const ufoScale = ufoW / (ufoImg.naturalWidth || ufoImg.width || ufoW);
            const ufoH = (ufoImg.naturalHeight || ufoImg.height || ufoW) * ufoScale;

            const ufoX = W - ufoW - PADDING;   // right:0
            const ufoY = PADDING;    // top 근처

            ctx.drawImage(ufoImg, ufoX, ufoY, ufoW, ufoH);
          }
        } catch (e) {
          console.warn("web-alien UFO 로드 실패", e);
        }

        // circle
        try {
          const circleImg = await loadImage(CIRCLE_SRC);
          if (!cancelled) {
            const circleW = 220;
            const cScale = circleW / (circleImg.naturalWidth || circleImg.width || circleW);
            const circleH = (circleImg.naturalHeight || circleImg.height || circleW) * cScale;

            // CSS: left:-30px, bottom:-50px 와 비슷하게
            const circleX = photoX - 15;
            const circleY = photoBottom + 75 - circleH;

            ctx.drawImage(circleImg, circleX, circleY, circleW, circleH);
          }
        } catch (e) {
          console.warn("web-alien circle 로드 실패", e);
        }

        // dash
        try {
          const dashImg = await loadImage(DASH_SRC);
          if (!cancelled) {
            const dashW = Math.min(photoW * 0.85, 800);
            const dScale = dashW / (dashImg.naturalWidth || dashImg.width || dashW);
            const dashH = (dashImg.naturalHeight || dashImg.height || dashW) * dScale;

            // bottom 프레임(70px)의 중앙쯤에 오도록 offset 조정
            const bottomCenterOffset = BOTTOM_FRAME / 2 + 10; // 35px
            const dashX = W - PADDING - dashW;
            const dashY = photoBottom + bottomCenterOffset - dashH / 2;

            ctx.drawImage(dashImg, dashX, dashY, dashW, dashH);
          }
        } catch (e) {
          console.warn("web-alien dash 로드 실패", e);
        }
      } catch (e) {
        console.warn("web-alien 캔버스 합성 실패 (전체)", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [photoUrl]);

  return { canvasRef };
}
