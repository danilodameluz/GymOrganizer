import { formatTimer } from '../hooks/useRestTimer'

interface RestTimerProps {
  secondsLeft: number
  isRunning: boolean
  onStart: (seconds: number) => void
  onStop: () => void
  compact?: boolean
  defaultSeconds?: number
  presets?: readonly number[]
}

export function RestTimer({
  secondsLeft,
  isRunning,
  onStart,
  onStop,
  compact = false,
  defaultSeconds = 90,
  presets = [60, 90, 120, 180],
}: RestTimerProps) {
  return (
    <div
      className={
        compact
          ? ''
          : 'rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80'
      }
    >
      <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-3'}`}>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Descanso</h3>
        <span
          className={`font-mono font-bold tabular-nums ${
            compact ? 'text-xl' : 'text-2xl'
          } ${
            isRunning ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {formatTimer(secondsLeft)}
        </span>
      </div>

      {isRunning ? (
        <button
          type="button"
          onClick={onStop}
          className="w-full rounded-xl bg-slate-200 py-2.5 text-sm font-semibold text-slate-800 active:bg-slate-300 dark:bg-slate-700 dark:text-white dark:active:bg-slate-600"
        >
          Parar
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {presets.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onStart(sec)}
              className={`rounded-xl py-2.5 text-sm font-semibold text-white active:opacity-90 ${
                sec === defaultSeconds
                  ? 'ring-2 ring-emerald-300 ring-offset-1 ring-offset-white dark:ring-offset-slate-900 bg-emerald-600'
                  : 'bg-emerald-600/80'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
