import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { WorkoutForm } from '../components/WorkoutForm'
import { db } from '../db/database'
import { updateWorkout } from '../db/workoutService'
import { exerciseToDraft } from '../utils/workoutForm'

export function EditWorkoutPage() {
  const { id } = useParams<{ id: string }>()
  const workoutId = Number(id)
  const navigate = useNavigate()

  const data = useLiveQuery(async () => {
    const workout = await db.workouts.get(workoutId)
    if (!workout) return null
    const exercises = await db.exercises.where('workoutId').equals(workoutId).sortBy('order')
    return { workout, exercises }
  }, [workoutId])

  if (data === undefined) {
    return <p className="text-center text-slate-500">Carregando...</p>
  }

  if (data === null) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-slate-500">Treino não encontrado.</p>
        <Link to="/" className="text-sm text-emerald-600 dark:text-emerald-400">
          Voltar ao início
        </Link>
      </div>
    )
  }

  const { workout, exercises } = data

  return (
    <div className="space-y-6">
      <Link
        to={`/treino/${workoutId}`}
        className="text-sm text-slate-500 active:text-emerald-600 dark:active:text-emerald-400"
      >
        ← Cancelar
      </Link>

      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Editar treino</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Altere nome, cor e exercícios da ficha
        </p>
      </header>

      <WorkoutForm
        key={workout.id}
        initialName={workout.name}
        initialColor={workout.color}
        initialExercises={exercises.map(exerciseToDraft)}
        submitLabel="Salvar alterações"
        onSubmit={async (name, color, parsed) => {
          await updateWorkout(workoutId, name, color, parsed)
          navigate(`/treino/${workoutId}`)
        }}
      />
    </div>
  )
}
