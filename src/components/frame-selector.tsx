import type { ReactNode } from "react";
import type { Frame } from "../types/frame";
import styles from "../styles/frame-selector.module.css";

interface FrameSelectorProps {
  frames: Frame[];
  selectedFrameId: string;
  onSelectFrame: (frameId: string) => void;
  renderPreview: (frame: Frame) => ReactNode;
}

export function FrameSelector({
                                frames,
                                selectedFrameId,
                                onSelectFrame,
                                renderPreview,
                              }: FrameSelectorProps) {
  const selectedFrame = frames.find((frame) => frame.id === selectedFrameId);

  return (
    <div className={styles.wrapper}>
      {selectedFrame && (
        <div className={styles.previewSection}>
          <div className={styles.previewContainer}>
            <div className={styles.previewInner}>
              {renderPreview(selectedFrame)}
            </div>
          </div>
          <p className={styles.previewName}>{selectedFrame.name}</p>
        </div>
      )}

      <div className={styles.selectorSection}>
        <h2 className={styles.selectorTitle}>프레임 선택</h2>
        <div className={styles.frameList}>
          {frames.map((frame) => (
            <button
              key={frame.id}
              type="button"
              onClick={() => onSelectFrame(frame.id)}
              className={`${styles.frameButton} ${
                selectedFrameId === frame.id ? styles.selected : ""
              }`}
              aria-label={`${frame.name} 프레임 선택`}
            >
              <div className={styles.frameThumbnail}>
                <div
                  className={styles.framePreview}
                  style={{ background: frame.background }}
                />
              </div>
              {selectedFrameId === frame.id && (
                <div className={styles.selectedIndicator}>
                  <div className={styles.checkCircle}>
                    <svg
                      className={styles.checkIcon}
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
