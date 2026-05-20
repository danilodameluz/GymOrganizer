import { Link, useNavigate } from 'react-router-dom'
import { WorkoutForm } from '../components/WorkoutForm'
import { createWorkout } from '../db/workoutService'

export function NewWorkoutPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="text-sm text-slate-500 active:text-emerald-600 dark:active:text-emerald-400"
      >
        ← Voltar
      </Link>

      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Novo treino</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Defina exercícios, séries, repetições e peso planejados
        </p>
      </header>

      <WorkoutForm
        submitLabel="Criar treino"
        onSubmit={async (name, color, exercises) => {
          const workoutId = await createWorkout(name, color, exercises)
          navigate(`/treino/${workoutId}`)
        }}
      />
    </div>
  )
}
