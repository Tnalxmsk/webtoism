"use client"

import { useEffect, useState } from "react"

interface UseUserMediaReturn {
  stream: MediaStream | null
  error: string | null
  isLoading: boolean
  retry: () => void
}

export function useUserMedia(): UseUserMediaReturn {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRetry, setShouldRetry] = useState(0)

  useEffect(() => {
    let currentStream: MediaStream | null = null

    const startCamera = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        currentStream = mediaStream
        setStream(mediaStream)
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            setError("카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용한 후 새로고침해주세요.")
          } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            setError("카메라를 찾을 수 없습니다. 데스크톱/노트북/스마트폰 환경인지 확인해주세요.")
          } else {
            setError("카메라를 시작하는 중 오류가 발생했습니다. 다시 시도해주세요.")
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    startCamera()

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [shouldRetry])

  const retry = () => {
    setShouldRetry((prev) => prev + 1)
  }

  return { stream, error, isLoading, retry }
}
