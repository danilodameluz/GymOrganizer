import { useSettings } from '../context/SettingsContext'
import { RestTimer } from './RestTimer'
import { SetLogForm } from './SetLogForm'
import { useRestTimer, formatTimer } from '../hooks/useRestTimer'
import type { Exercise, SetLog } from '../types'
import { formatTargetReps, getDefaultRepFromTarget } from '../utils/exercise'
import { formatWeight } from '../utils/weight'

interface ExerciseSessionCardProps {
  exercise: Exercise
  logs: SetLog[]
  isOpen: boolean
  onToggle: () => void
  onLogSet: (exercise: Exercise, weightKg: number, reps: number) => Promise<void>
}

export function ExerciseSessionCard({
  exercise,
  logs,
  isOpen,
  onToggle,
  onLogSet,
}: ExerciseSessionCardProps) {
  const { weightUnit, defaultRestSeconds, restPresets } = useSettings()
  const timer = useRestTimer(defaultRestSeconds)
  const lastLog = logs[logs.length - 1]
  const nextSet = logs.length + 1
  const canLogMore = logs.length < exercise.targetSets
  const showTimer = isOpen || timer.isRunning

  const handleSubmit = async (weightKg: number, reps: number) => {
    await onLogSet(exercise, weightKg, reps)
    timer.start(defaultRestSeconds)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 dark:text-white">{exercise.name}</p>
          <p className="text-xs text-slate-500">
            {logs.length}/{exercise.targetSets} séries · meta{' '}
            {formatTargetReps(exercise.targetReps)} reps
            {(exercise.defaultWeightKg ?? 0) > 0 &&
              ` · ${formatWeight(exercise.defaultWeightKg, weightUnit)}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {timer.isRunning && !isOpen && (
            <span className="rounded-lg bg-emerald-100 px-2 py-0.5 font-mono text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
              {formatTimer(timer.secondsLeft)}
            </span>
          )}
          <span className="text-slate-400 dark:text-slate-500">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {logs.length > 0 && (
        <ul className="border-t border-slate-200 px-4 py-2 dark:border-slate-800">
          {logs.map((log) => (
            <li
              key={log.id}
              className="flex justify-between py-1 text-sm text-slate-500 dark:text-slate-400"
            >
              <span>Série {log.setNumber}</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {formatWeight(log.weightKg, weightUnit)} × {log.reps}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showTimer && (
        <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
          <RestTimer
            compact
            secondsLeft={timer.secondsLeft}
            isRunning={timer.isRunning}
            onStart={timer.start}
            onStop={timer.stop}
            defaultSeconds={defaultRestSeconds}
            presets={restPresets}
          />
        </div>
      )}

      {isOpen && canLogMore && (
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <SetLogForm
            setNumber={nextSet}
            defaultWeightKg={exercise.defaultWeightKg ?? 0}
            defaultReps={getDefaultRepFromTarget(exercise.targetReps)}
            repsHint={formatTargetReps(exercise.targetReps)}
            lastWeightKg={lastLog?.weightKg}
            lastReps={lastLog?.reps}
            onSubmit={handleSubmit}
          />
        </div>
      )}

      {isOpen && !canLogMore && (
        <p className="border-t border-slate-200 px-4 py-3 text-center text-sm text-emerald-600 dark:border-slate-800 dark:text-emerald-400">
          Todas as {exercise.targetSets} séries registradas
        </p>
      )}
    </div>
  )
}
