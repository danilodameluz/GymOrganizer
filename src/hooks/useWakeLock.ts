import { useCallback, useEffect, useRef, useState } from 'react'

export function useWakeLock(enabled: boolean) {
  const [active, setActive] = useState(false)
  const [supported, setSupported] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const release = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release()
      } catch {
        /* já liberado */
      }
      wakeLockRef.current = null
    }
    setActive(false)
  }, [])

  const request = useCallback(async () => {
    if (!('wakeLock' in navigator)) {
      setSupported(false)
      return
    }

    setSupported(true)

    try {
      await release()
      wakeLockRef.current = await navigator.wakeLock.request('screen')
      setActive(true)

      wakeLockRef.current.addEventListener('release', () => {
        setActive(false)
        wakeLockRef.current = null
      })
    } catch {
      setActive(false)
    }
  }, [release])

  useEffect(() => {
    setSupported('wakeLock' in navigator)

    if (enabled) {
      request()
    } else {
      release()
    }

    return () => {
      release()
    }
  }, [enabled, request, release])

  useEffect(() => {
    if (!enabled) return

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        request()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [enabled, request])

  return { active, supported, request, release }
}
