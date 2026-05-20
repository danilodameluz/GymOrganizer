import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RestTimer } from '../components/RestTimer'
import { SetLogForm } from '../components/SetLogForm'
import { db } from '../db/database'
import { useRestTimer } from '../hooks/useRestTimer'
import type { Exercise, SetLog } from '../types'
import { formatTargetReps, getDefaultRepFromTarget } from '../utils/exercise'

export function SessionPage() {
  const { id } = useParams<{ id: string }>()
  const sessionId = Number(id)
  const navigate = useNavigate()
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null)
  const timer = useRestTimer(90)

  const session = useLiveQuery(() => db.sessions.get(sessionId), [sessionId])
  const workout = useLiveQuery(
    async () => {
      const s = await db.sessions.get(sessionId)
      if (!s) return undefined
      return db.workouts.get(s.workoutId)
    },
    [sessionId],
  )
  const exercises = useLiveQuery(
    async () => {
      const s = await db.sessions.get(sessionId)
      if (!s) return []
      return db.exercises.where('workoutId').equals(s.workoutId).sortBy('order')
    },
    [sessionId],
  )
  const logs = useLiveQuery(
    () => db.setLogs.where('sessionId').equals(sessionId).toArray(),
    [sessionId],
  )

  const finishWorkout = async () => {
    await db.sessions.update(sessionId, { finishedAt: new Date() })
    navigate('/historico')
  }

  const logSet = async (exercise: Exercise, weightKg: number, reps: number) => {
    const exerciseLogs = (logs ?? []).filter((l) => l.exerciseId === exercise.id)
    if (exerciseLogs.length >= exercise.targetSets) return

    const setNumber = exerciseLogs.length + 1

    await db.setLogs.add({
      sessionId,
      exerciseId: exercise.id!,
      setNumber,
      weightKg,
      reps,
      loggedAt: new Date(),
    })

    timer.start(90)
  }

  if (!session || !workout || !exercises) {
    return <p className="text-center text-slate-500">Carregando...</p>
  }

  const logsByExercise = (logs ?? []).reduce<Record<number, SetLog[]>>((acc, log) => {
    if (!acc[log.exerciseId]) acc[log.exerciseId] = []
    acc[log.exerciseId].push(log)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-sm text-slate-500 active:text-emerald-600 dark:active:text-emerald-400"
        >
          ← Início
        </Link>
        <button
          type="button"
          onClick={finishWorkout}
          className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          Finalizar
        </button>
      </div>

      <header>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{workout.name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Registre cada série</p>
      </header>

      <RestTimer
        secondsLeft={timer.secondsLeft}
        isRunning={timer.isRunning}
        onStart={timer.start}
        onStop={timer.stop}
      />

      <div className="space-y-4">
        {exercises.map((exercise) => {
          const exerciseLogs = logsByExercise[exercise.id!] ?? []
          const isOpen = activeExerciseId === exercise.id
          const lastLog = exerciseLogs[exerciseLogs.length - 1]
          const nextSet = exerciseLogs.length + 1
          const canLogMore = exerciseLogs.length < exercise.targetSets

          return (
            <div
              key={exercise.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() =>
                  setActiveExerciseId(isOpen ? null : (exercise.id ?? null))
                }
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{exercise.name}</p>
                  <p className="text-xs text-slate-500">
                    {exerciseLogs.length}/{exercise.targetSets} séries · meta{' '}
                    {formatTargetReps(exercise.targetReps)} reps
                    {(exercise.defaultWeightKg ?? 0) > 0 &&
                      ` · ${exercise.defaultWeightKg} kg`}
                  </p>
                </div>
                <span className="text-slate-400 dark:text-slate-500">{isOpen ? '▲' : '▼'}</span>
              </button>

              {exerciseLogs.length > 0 && (
                <ul className="border-t border-slate-200 px-4 py-2 dark:border-slate-800">
                  {exerciseLogs.map((log) => (
                    <li
                      key={log.id}
                      className="flex justify-between py-1 text-sm text-slate-500 dark:text-slate-400"
                    >
                      <span>Série {log.setNumber}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {log.weightKg} kg × {log.reps}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {isOpen && canLogMore && (
                <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                  <SetLogForm
                    setNumber={nextSet}
                    defaultWeight={exercise.defaultWeightKg ?? 0}
                    defaultReps={getDefaultRepFromTarget(exercise.targetReps)}
                    repsHint={formatTargetReps(exercise.targetReps)}
                    lastWeight={lastLog?.weightKg}
                    lastReps={lastLog?.reps}
                    onSubmit={(w, r) => logSet(exercise, w, r)}
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
        })}
      </div>
    </div>
  )
}
