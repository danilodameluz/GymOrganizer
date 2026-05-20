import { useCallback, useEffect, useRef, useState } from 'react'

export function useRestTimer(defaultSeconds = 90) {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(
    (seconds = defaultSeconds) => {
      clear()
      setSecondsLeft(seconds)
      setIsRunning(true)
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clear()
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    },
    [clear, defaultSeconds],
  )

  const stop = useCallback(() => {
    clear()
    setIsRunning(false)
    setSecondsLeft(0)
  }, [clear])

  useEffect(() => () => clear(), [clear])

  return { secondsLeft, isRunning, start, stop }
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
