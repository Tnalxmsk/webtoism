import { Button } from "./ui/button";
import styles from "../styles/preview-result.module.css";
import type { Frame } from "../types/frame";

import { SoptWebFrame } from "./frame/SoptWebFrame";
import { DiveSoptFrame } from "./frame/DiveSoptFrame";
import { WebAlienFrame } from "./frame/WebAlienFrame";

import { useSoptWebFrameCanvas } from "../hooks/useSoptWebFrameCanvas";
import { useDiveSoptFrameCanvas } from "../hooks/useDiveSoptFrameCanvas";
import { useWebAlienFrameCanvas } from "../hooks/useWebAlienFrameCanvas";

interface PreviewResultProps {
  imageUrl: string;
  selectedFrame: Frame | null;
  onRetake: () => void;
  onDownloadFallback?: () => void;
}

export function PreviewResult({
                                imageUrl,
                                selectedFrame,
                                onRetake,
                                onDownloadFallback,
                              }: PreviewResultProps) {
  const isSoptWeb  = !selectedFrame || selectedFrame.id === "sopt-web";
  const isDiveSopt = selectedFrame?.id === "dive-sopt";
  const isWebAlien = selectedFrame?.id === "web-alien";

  // ★ 훅은 무조건 최상단에서 호출
  const { canvasRef: soptCanvasRef }  = useSoptWebFrameCanvas(
    isSoptWeb ? imageUrl : null,
  );
  const { canvasRef: diveCanvasRef }  = useDiveSoptFrameCanvas(
    isDiveSopt ? imageUrl : null,
  );
  const { canvasRef: alienCanvasRef } = useWebAlienFrameCanvas(
    isWebAlien ? imageUrl : null,
  );

  // 지금 선택된 프레임의 캔버스 ref
  const activeCanvasRef = isDiveSopt
    ? diveCanvasRef
    : isWebAlien
      ? alienCanvasRef
      : soptCanvasRef; // 기본: 솝트 웹

  const handleDownloadClick = () => {
    const canvas = activeCanvasRef.current;
    if (!canvas) {
      onDownloadFallback?.();
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          onDownloadFallback?.();
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `photo-with-frame-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      "image/png",
      1.0,
    );
  };

  // 화면에 보여줄 프레임 컴포넌트
  let frameView: React.ReactNode;
  if (isDiveSopt) {
    frameView = <DiveSoptFrame photoUrl={imageUrl} />;
  } else if (isWebAlien) {
    frameView = <WebAlienFrame photoUrl={imageUrl} />;
  } else {
    frameView = <SoptWebFrame photoUrl={imageUrl} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <div className={styles.imageWrapper}>{frameView}</div>
      </div>

      {/* 프레임별 다운로드용 캔버스 (화면엔 안 보임) */}
      <canvas ref={soptCanvasRef}  style={{ display: "none" }} />
      <canvas ref={diveCanvasRef}  style={{ display: "none" }} />
      <canvas ref={alienCanvasRef} style={{ display: "none" }} />

      <div className={styles.controls}>
        <Button
          variant="outline"
          size="lg"
          onClick={onRetake}
          className={styles.retakeButton}
        >
          다시 찍기
        </Button>
        <Button
          size="lg"
          onClick={handleDownloadClick}
          className={styles.downloadButton}
        >
          다운로드
        </Button>
      </div>
    </div>
  );
}
