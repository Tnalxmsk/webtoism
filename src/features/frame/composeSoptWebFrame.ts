// frames/soptWeb/composeSoptWebFrame.ts
export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });

export async function composeSoptWebFrame(photoUrl: string) {
  // 1. 프레임 사이즈 (디자인 기준)
  const width = 1104;
  const height = 908;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context 생성 실패");

  // 2. 배경 그라디언트
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, "#FAFAFA");
  grad.addColorStop(1, "#F9D6DB");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 3. 사진이 들어가는 흰 영역 (CSS와 맞게 숫자 고정)
  // .frame padding: 32px 32px 0 32px;
  // .bottomArea height: 70px;
  const paddingTop = 32;
  const paddingLeft = 32;
  const paddingRight = 32;
  const bottomAreaHeight = 70;

  const photoX = paddingLeft;
  const photoY = paddingTop;
  const photoW = width - paddingLeft - paddingRight;
  const photoH = height - paddingTop - bottomAreaHeight;

  // 사진 로딩
  const img = await loadImage(photoUrl);

  // 4. object-fit: cover 로 사진 채우기
  const vW = img.naturalWidth || img.width;
  const vH = img.naturalHeight || img.height;
  const srcAspect = vW / vH;
  const dstAspect = photoW / photoH;
  let sx = 0;
  let sy = 0;
  let sWidth = vW;
  let sHeight = vH;

  if (srcAspect > dstAspect) {
    // 원본이 가로로 더 김 → 좌우 자르기
    sHeight = vH;
    sWidth = vH * dstAspect;
    sx = (vW - sWidth) / 2;
  } else {
    // 원본이 세로로 더 김 → 상하 자르기
    sWidth = vW;
    sHeight = vW / dstAspect;
    sy = (vH - sHeight) / 2;
  }

  // 흰 배경 + 사진
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.drawImage(img, sx, sy, sWidth, sHeight, photoX, photoY, photoW, photoH);

  // 5. 패턴 바 (사진 안쪽에 겹치게)
  // CSS: bottom: 10px; height: 28px;
  const patternImg = await loadImage("/public/img-frame-sopt-web-logo.png"); // 실제 파일명 맞춰서
  const patternHeight = 28;
  const patternY = photoY + photoH - 10 - patternHeight;

  const pattern = ctx.createPattern(patternImg, "repeat-x");
  if (pattern) {
    ctx.save();
    ctx.rect(photoX, patternY, photoW, patternHeight);
    ctx.fillStyle = pattern;
    ctx.fill();
    ctx.restore();
  }

  // 6. 로고 (bottomArea 중앙)
  const logoImg = await loadImage("/public/ic-frame-sopt-web-logo.svg"); // 실제 파일명 맞추기
  const logoTargetWidth = 70; // CSS .logo width
  const naturalLogoW = logoImg.naturalWidth || logoImg.width;
  const naturalLogoH = logoImg.naturalHeight || logoImg.height;
  const logoW = logoTargetWidth;
  const logoH = (naturalLogoH / naturalLogoW) * logoW;

  const logoX = (width - logoW) / 2;
  const logoCenterY = height - bottomAreaHeight / 2;
  const logoY = logoCenterY - logoH / 2;

  ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);

  // 7. 결과 리턴 (canvas & dataURL 둘 다)
  const dataUrl = canvas.toDataURL("image/png");
  return { canvas, dataUrl };
}
