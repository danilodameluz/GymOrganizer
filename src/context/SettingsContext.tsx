import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { WeightUnit } from '../utils/weight'

export type Theme = 'light' | 'dark'

export interface AppSettings {
  theme: Theme
  keepScreenOn: boolean
  weightUnit: WeightUnit
  defaultRestSeconds: number
}

const STORAGE_KEY = 'gymorganizer-settings'
const LEGACY_THEME_KEY = 'gymorganizer-theme'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  keepScreenOn: true,
  weightUnit: 'kg',
  defaultRestSeconds: 90,
}

const REST_PRESETS = [60, 90, 120, 180] as const

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppSettings>
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        defaultRestSeconds: REST_PRESETS.includes(
          parsed.defaultRestSeconds as (typeof REST_PRESETS)[number],
        )
          ? parsed.defaultRestSeconds!
          : DEFAULT_SETTINGS.defaultRestSeconds,
      }
    }
  } catch {
    /* ignore */
  }

  const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY)
  if (legacyTheme === 'light' || legacyTheme === 'dark') {
    return { ...DEFAULT_SETTINGS, theme: legacyTheme }
  }

  return DEFAULT_SETTINGS
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#f8fafc')
  }
}

interface SettingsContextValue extends AppSettings {
  setTheme: (theme: Theme) => void
  setKeepScreenOn: (value: boolean) => void
  setWeightUnit: (unit: WeightUnit) => void
  setDefaultRestSeconds: (seconds: number) => void
  restPresets: readonly number[]
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  useEffect(() => {
    applyTheme(settings.theme)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const value: SettingsContextValue = {
    ...settings,
    setTheme: (theme) => update({ theme }),
    setKeepScreenOn: (keepScreenOn) => update({ keepScreenOn }),
    setWeightUnit: (weightUnit) => update({ weightUnit }),
    setDefaultRestSeconds: (defaultRestSeconds) => update({ defaultRestSeconds }),
    restPresets: REST_PRESETS,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

/** Compatível com código que usava useTheme */
export function useTheme() {
  const { theme, setTheme } = useSettings()
  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  }
}
