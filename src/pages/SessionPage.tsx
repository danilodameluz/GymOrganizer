import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExerciseSessionCard } from '../components/ExerciseSessionCard'
import { db } from '../db/database'
import { useSettings } from '../context/SettingsContext'
import { useWakeLock } from '../hooks/useWakeLock'
import type { Exercise, SetLog } from '../types'

export function SessionPage() {
  const { id } = useParams<{ id: string }>()
  const sessionId = Number(id)
  const navigate = useNavigate()
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null)
  const { keepScreenOn } = useSettings()

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

  const sessionActive = session != null && session.finishedAt == null
  useWakeLock(keepScreenOn && sessionActive)

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

      <div className="space-y-4">
        {exercises.map((exercise) => (
          <ExerciseSessionCard
            key={exercise.id}
            exercise={exercise}
            logs={logsByExercise[exercise.id!] ?? []}
            isOpen={activeExerciseId === exercise.id}
            onToggle={() =>
              setActiveExerciseId(
                activeExerciseId === exercise.id ? null : (exercise.id ?? null),
              )
            }
            onLogSet={logSet}
          />
        ))}
      </div>
    </div>
  )
}
