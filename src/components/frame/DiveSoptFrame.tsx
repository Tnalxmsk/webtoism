import type { ReactNode } from "react";
import styles from "./DiveSoptFrame.module.css";

interface DeepRedFrameProps {
  photoUrl: string;
  alt?: string;
  children?: ReactNode;
}

export function DiveSoptFrame({ photoUrl, alt, children }: DeepRedFrameProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.photoInner}>
        <img src={photoUrl} alt={alt ?? "촬영된 사진"} className={styles.photo} />
      </div>

      <div className={styles.bottomArea}>
        <img src="/ic-frame-dive-sopt-logo.svg" alt="로고" className={styles.logo} />
      </div>

      {children && <div className={styles.overlay}>{children}</div>}
    </div>
  );
}
