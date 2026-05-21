import { useSettings } from '../context/SettingsContext'
import type { Theme } from '../context/SettingsContext'
import type { WeightUnit } from '../utils/weight'

function SettingRow({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
      {description && (
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      )}
      <div className="mt-3">{children}</div>
    </div>
  )
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
        active
          ? 'bg-emerald-600 text-white'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
      }`}
    >
      {children}
    </button>
  )
}

export function SettingsPage() {
  const {
    theme,
    setTheme,
    keepScreenOn,
    setKeepScreenOn,
    weightUnit,
    setWeightUnit,
    defaultRestSeconds,
    setDefaultRestSeconds,
    restPresets,
  } = useSettings()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personalize o GymOrganizer
        </p>
      </header>

      <div className="space-y-3">
        <SettingRow
          title="Manter tela ligada"
          description="Durante o treino, evita que o celular entre em suspensão (quando suportado)."
        >
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={keepScreenOn}
              onChange={(e) => setKeepScreenOn(e.target.checked)}
              className="h-5 w-5 accent-emerald-600"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {keepScreenOn ? 'Ativado' : 'Desativado'}
            </span>
          </label>
        </SettingRow>

        <SettingRow title="Tema">
          <div className="flex gap-2">
            <OptionButton active={theme === 'light'} onClick={() => setTheme('light' as Theme)}>
              ☀️ Claro
            </OptionButton>
            <OptionButton active={theme === 'dark'} onClick={() => setTheme('dark' as Theme)}>
              🌙 Escuro
            </OptionButton>
          </div>
        </SettingRow>

        <SettingRow title="Unidade de peso">
          <div className="flex gap-2">
            <OptionButton
              active={weightUnit === 'kg'}
              onClick={() => setWeightUnit('kg' as WeightUnit)}
            >
              Kg
            </OptionButton>
            <OptionButton
              active={weightUnit === 'lbs'}
              onClick={() => setWeightUnit('lbs' as WeightUnit)}
            >
              Lbs
            </OptionButton>
          </div>
        </SettingRow>

        <SettingRow
          title="Tempo padrão de descanso"
          description="Inicia automaticamente após registrar uma série."
        >
          <div className="grid grid-cols-4 gap-2">
            {restPresets.map((sec) => (
              <OptionButton
                key={sec}
                active={defaultRestSeconds === sec}
                onClick={() => setDefaultRestSeconds(sec)}
              >
                {sec}s
              </OptionButton>
            ))}
          </div>
        </SettingRow>
      </div>
    </div>
  )
}
