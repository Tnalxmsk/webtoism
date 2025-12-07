// types/frame.ts
export interface Frame {
  id: string
  name: string
  // 이미지 프레임은 안 쓰고, 배경 그라디언트만 사용
  background: string

  // (원하면 계속 쓸 수 있도록 남겨둔 옵션들)
  borderStyle?: string
  borderWidth?: string
  borderColor?: string
  borderRadius?: string
  boxShadow?: string
}
