// App.tsx
import { useState } from "react";
import { useUserMedia } from "./hooks/use-user-media";
import { FrameSelector } from "./components/frame-selector";
import { WebcamCapture } from "./components/webcam-capture";
import { PreviewResult } from "./components/preview-result";
import { Button } from "./components/ui/button";
import type { Frame } from "./types/frame";
import styles from "./styles/app.module.css";
import { SoptWebFrame } from "./components/frame/SoptWebFrame";
import { DiveSoptFrame } from "./components/frame/DiveSoptFrame.tsx";
import { WebAlienFrame } from "./components/frame/WebAlienFrame";

const FRAMES: Frame[] = [
  {
    id: "sopt-web",
    name: "솝트 웹",
    background: "linear-gradient(180deg, #FAFAFA -23.29%, #F9D6DB 100%)",
  },
  {
    id: "web-alien",
    name: "웹계인",
    background: "#00ADFF",
  },
  {
    id: "dive-sopt",
    name: "다이브 솝트 프레임",
    background: "linear-gradient(240deg, #4B222A 32.02%, #0F1010 98.1%)",
  },
];


export default function App() {
  const [step, setStep] = useState<"select-frame" | "capture" | "preview">("select-frame");
  const { stream, error, isLoading, retry } = useUserMedia();
  const [selectedFrameId, setSelectedFrameId] = useState<string>(FRAMES[0].id);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const selectedFrame = FRAMES.find((frame) => frame.id === selectedFrameId) || null;

  const handleCapture = (imageUrl: string) => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(imageUrl);
    setStep("preview");
  };

  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setStep("capture");
  };

  const handleProceedToCapture = () => {
    setStep("capture");
  };

  const handleBackToFrameSelection = () => {
    setStep("select-frame");
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>웹토이즘</h1>
          <p className={styles.subtitle}>사진을 찍고 원하는 프레임을 씌워보세요</p>
        </header>

        <div className={styles.contentWrapper}>
          {step === "select-frame" && (
            <div className={styles.stepContainer}>
              <FrameSelector
                frames={FRAMES}
                selectedFrameId={selectedFrameId}
                onSelectFrame={setSelectedFrameId}
                renderPreview={(frame) => {
                  const placeholder = "/ic-placeholder.svg";
                  if (frame.id === "sopt-web") {
                    return (
                      <SoptWebFrame
                        photoUrl={placeholder}
                        alt={`${frame.name} 프레임 미리보기`}
                      />
                    );
                  }
                  if (frame.id === "dive-sopt") {
                    return (
                      <DiveSoptFrame
                        photoUrl={placeholder}
                        alt={`${frame.name} 프레임 미리보기`}
                      />
                    );
                  }
                  if (frame.id === "web-alien") {
                    return (
                      <WebAlienFrame
                        photoUrl={placeholder}
                        alt={`${frame.name} 프레임 미리보기`}
                      />
                    );
                  }
                  return null;
                }}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={handleProceedToCapture} size="lg" style={{ minWidth: "200px" }}>
                  다음 단계
                </Button>
              </div>
            </div>
          )}

          {step === "capture" && (
            <>
              {isLoading && (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner} />
                  <p style={{ color: "var(--muted-foreground)" }}>카메라를 준비하는 중...</p>
                </div>
              )}

              {error && (
                <div className={styles.errorContainer}>
                  {/* ... 기존 에러 UI 그대로 */}
                  <div className={styles.buttonGroup}>
                    <Button onClick={handleBackToFrameSelection} variant="outline">
                      이전 단계
                    </Button>
                    <Button onClick={retry}>다시 시도</Button>
                  </div>
                </div>
              )}

              {!isLoading && !error && stream && (
                <div className={styles.stepContainer}>
                  <Button onClick={handleBackToFrameSelection} variant="outline" size="sm">
                    프레임 다시 선택
                  </Button>
                  <WebcamCapture
                    stream={stream}
                    selectedFrame={selectedFrame}
                    onCapture={handleCapture}
                  />
                </div>
              )}

              {!isLoading && !error && !stream && (
                <div className={styles.permissionContainer}>
                  {/* ... 권한 안내 UI */}
                  <Button onClick={handleBackToFrameSelection} variant="outline" style={{ marginTop: "1rem" }}>
                    이전 단계
                  </Button>
                </div>
              )}
            </>
          )}

          {step === "preview" && capturedImage && (
            <div className={styles.stepContainer}>
              <PreviewResult
                imageUrl={capturedImage}
                selectedFrame={selectedFrame}
                onRetake={handleRetake}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
