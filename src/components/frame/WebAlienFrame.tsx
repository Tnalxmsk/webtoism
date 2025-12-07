import type { ReactNode } from "react";
import styles from "./WebAlienFrame.module.css";

interface WebAlienFrameProps {
  photoUrl: string;
  alt?: string;
  children?: ReactNode;
}

export function WebAlienFrame({ photoUrl, alt, children }: WebAlienFrameProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.photoInner}>
        {/* 실제 사진 */}
        <img
          src={photoUrl}
          alt={alt ?? "촬영된 사진"}
          className={styles.photo}
        />

        {/* 우측 상단 UFO (SVG) */}
        <img
          src="/img-frame-web-alien-ufo.png"
          alt="UFO"
          className={styles.ufo}
        />

        {/* 좌측 하단 원형(사람들 있는 이미지) – 흰 박스에 걸쳐 나오게 */}
        <img
          src="/img-frame-web-alien-circle.png"
          alt="원형 스티커"
          className={styles.circle}
        />

        {/* 하단 점선 – 흰 박스 안에서 가로 중앙 */}
        <img
          src="/ic-frame-web-alien-dash.svg"
          alt="점선"
          className={styles.dash}
        />

        {children && <div className={styles.overlay}>{children}</div>}
      </div>
    </div>
  );
}
