import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useSettings } from '../context/SettingsContext'
import { db } from '../db/database'
import { deleteWorkout, hasActiveSession } from '../db/workoutService'
import { formatExercisePlan } from '../utils/exercise'
import { workoutAccent } from '../utils/colors'
import { formatLastWorkoutDate, getLastWorkoutDate } from '../utils/sessions'

export function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>()
  const workoutId = Number(id)
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { weightUnit } = useSettings()

  const workout = useLiveQuery(() => db.workouts.get(workoutId), [workoutId])
  const exercises = useLiveQuery(
    () => db.exercises.where('workoutId').equals(workoutId).sortBy('order'),
    [workoutId],
  )
  const lastDate = useLiveQuery(() => getLastWorkoutDate(workoutId), [workoutId])
  const activeForWorkout = useLiveQuery(() => hasActiveSession(workoutId), [workoutId])

  const startWorkout = async () => {
    const sessionId = await db.sessions.add({
      workoutId,
      startedAt: new Date(),
    })
    navigate(`/sessao/${sessionId}`)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteWorkout(workoutId)
      navigate('/')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!workout) {
    return <p className="text-center text-slate-500">Carregando...</p>
  }

  const deleteMessage = activeForWorkout
    ? 'Este treino tem uma sessão em andamento. Ao excluir, o treino, exercícios e todo o histórico relacionado serão removidos permanentemente.'
    : 'O treino, exercícios e todo o histórico de sessões serão removidos permanentemente. Esta ação não pode ser desfeita.'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-sm text-slate-500 active:text-emerald-600 dark:active:text-emerald-400"
        >
          ← Voltar
        </Link>
        <div className="flex gap-2">
          <Link
            to={`/treino/${workoutId}/editar`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-300"
          >
            Editar
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:border-rose-800 dark:text-rose-400"
          >
            Excluir
          </button>
        </div>
      </div>

      <header className="flex items-start gap-3">
        <span className={`mt-1 h-10 w-1.5 rounded-full ${workoutAccent(workout.color)}`} />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{workout.name}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {exercises?.length ?? 0} exercícios
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium">Última vez:</span>{' '}
            {formatLastWorkoutDate(lastDate ?? null)}
          </p>
        </div>
      </header>

      <ul className="space-y-2">
        {(exercises ?? []).map((ex) => (
          <li
            key={ex.id}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="font-medium text-slate-800 dark:text-slate-200">{ex.name}</p>
            <p className="mt-0.5 text-sm text-slate-500">{formatExercisePlan(ex, weightUnit)}</p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={startWorkout}
        className="w-full rounded-2xl bg-emerald-600 py-4 text-base font-bold text-white active:bg-emerald-500"
      >
        Iniciar treino
      </button>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Excluir treino?"
        message={deleteMessage}
        confirmLabel={deleting ? 'Excluindo...' : 'Excluir'}
        destructive
        onCancel={() => !deleting && setShowDeleteConfirm(false)}
        onConfirm={() => !deleting && handleDelete()}
      />
    </div>
  )
}
