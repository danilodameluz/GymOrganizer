import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../db/database'
import { workoutAccent } from '../utils/colors'
import { formatLastWorkoutDate, getLastWorkoutDate } from '../utils/sessions'

export function HomePage() {
  const workoutsWithMeta = useLiveQuery(async () => {
    const workouts = await db.workouts.orderBy('createdAt').toArray()
    return Promise.all(
      workouts.map(async (workout) => ({
        workout,
        lastDate: await getLastWorkoutDate(workout.id!),
      })),
    )
  })

  const activeSession = useLiveQuery(() =>
    db.sessions.filter((s) => s.finishedAt === undefined).first(),
  )

  if (!workoutsWithMeta) {
    return <p className="text-center text-slate-500">Carregando...</p>
  }

  const isEmpty = workoutsWithMeta.length === 0

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Meus treinos</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isEmpty
            ? 'Crie seu primeiro treino para começar'
            : 'Toque para ver ou iniciar'}
        </p>
      </header>

      {activeSession && (
        <Link
          to={`/sessao/${activeSession.id}`}
          className="block rounded-2xl border border-emerald-500/50 bg-emerald-50 p-4 dark:bg-emerald-500/10"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Treino em andamento
          </p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-white">
            Continuar treino →
          </p>
        </Link>
      )}

      {isEmpty ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
          <p className="text-4xl" aria-hidden>
            🏋️
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Nenhum treino cadastrado ainda.
            <br />
            Monte sua ficha com exercícios, séries, repetições e peso.
          </p>
          <Link
            to="/novo-treino"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white active:bg-emerald-500"
          >
            Criar meu primeiro treino
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {workoutsWithMeta.map(({ workout, lastDate }) => (
            <li key={workout.id}>
              <Link
                to={`/treino/${workout.id}`}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 active:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:active:bg-slate-800"
              >
                <span
                  className={`h-12 w-1.5 shrink-0 rounded-full ${workoutAccent(workout.color)}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900 dark:text-white">
                    {workout.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Último: {formatLastWorkoutDate(lastDate)}
                  </p>
                </div>
                <span className="text-slate-400 dark:text-slate-500">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!isEmpty && (
        <Link
          to="/novo-treino"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 py-4 text-sm font-semibold text-slate-500 active:border-emerald-600 active:text-emerald-600 dark:border-slate-700 dark:text-slate-400 dark:active:text-emerald-400"
        >
          + Novo treino
        </Link>
      )}
    </div>
  )
}
