import { useRef, useEffect } from "react";
import type { Frame } from "../types/frame";
import { Button } from "./ui/button";
import styles from "../styles/webcam-capture.module.css";

interface WebcamCaptureProps {
  stream: MediaStream | null;
  selectedFrame: Frame | null;
  onCapture: (imageUrl: string) => void;
}

export function WebcamCapture({ stream, onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || video.clientWidth;
    const height = video.videoHeight || video.clientHeight;
    if (!width || !height) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 프레임 고려 없이, 그냥 현재 비디오 프레임만 캡처
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        onCapture(url);
      },
      "image/png",
      1.0,
    );
  };

  return (
    <div className={styles.captureContainer}>
      <video ref={videoRef} className={styles.video} autoPlay playsInline />
      {/* 실제 캡처용 캔버스 (보이지 않음) */}
      <canvas ref={canvasRef} className={styles.hiddenCanvas} />
      <div className={styles.buttonContainer}>
        <Button onClick={handleCapture}>촬영하기</Button>
      </div>
    </div>
  );
}
