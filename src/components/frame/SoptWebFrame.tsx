import type { ReactNode } from "react";
import styles from "./SoptWebFrame.module.css";

interface SoptWebFrameProps {
  photoUrl: string;
  alt?: string;
  children?: ReactNode;
}

export function SoptWebFrame({ photoUrl, alt, children }: SoptWebFrameProps) {
  return (
    <div className={styles.frame}>
      {/* 위쪽: 사진 + 패턴 */}
      <div className={styles.photoInner}>
        <img src={photoUrl} alt={alt ?? "촬영된 사진"} className={styles.photo} />
        <div className={styles.patternBar} />
      </div>

      {/* 아래: 로고만 있는 영역 */}
      <div className={styles.bottomArea}>
        <img src="/ic-frame-sopt-web-logo.svg" alt="로고" className={styles.logo} />
      </div>

      {/* 최상단 오버레이 */}
      {children && <div className={styles.overlay}>{children}</div>}
    </div>
  );
}
