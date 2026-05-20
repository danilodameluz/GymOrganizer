import { formatTimer } from '../hooks/useRestTimer'

interface RestTimerProps {
  secondsLeft: number
  isRunning: boolean
  onStart: (seconds: number) => void
  onStop: () => void
}

const presets = [60, 90, 120, 180]

export function RestTimer({ secondsLeft, isRunning, onStart, onStop }: RestTimerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Descanso</h3>
        <span
          className={`font-mono text-2xl font-bold tabular-nums ${
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
              className="rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white active:bg-emerald-500"
            >
              {sec}s
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
