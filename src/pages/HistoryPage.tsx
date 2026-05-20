import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../db/database'

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function HistoryPage() {
  const sessions = useLiveQuery(async () => {
    const all = await db.sessions.orderBy('startedAt').reverse().toArray()
    return Promise.all(
      all.map(async (session) => {
        const workout = await db.workouts.get(session.workoutId)
        const logCount = await db.setLogs
          .where('sessionId')
          .equals(session.id!)
          .count()
        return { session, workout, logCount }
      }),
    )
  })

  const finished = (sessions ?? []).filter((s) => s.session.finishedAt)
  const inProgress = (sessions ?? []).filter((s) => !s.session.finishedAt)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Histórico</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Treinos registrados</p>
      </header>

      {inProgress.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Em andamento
          </h2>
          <ul className="space-y-2">
            {inProgress.map(({ session, workout, logCount }) => (
              <li key={session.id}>
                <Link
                  to={`/sessao/${session.id}`}
                  className="block rounded-xl border border-emerald-500/30 bg-emerald-50 p-4 dark:bg-emerald-500/5"
                >
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {workout?.name ?? 'Treino'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(session.startedAt)} · {logCount} séries
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Concluídos
        </h2>
        {finished.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
            Nenhum treino finalizado ainda
          </p>
        ) : (
          <ul className="space-y-2">
            {finished.map(({ session, workout, logCount }) => (
              <li
                key={session.id}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="font-semibold text-slate-900 dark:text-white">
                  {workout?.name ?? 'Treino'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(session.startedAt)}
                  {session.finishedAt && ` → ${formatDate(session.finishedAt)}`}
                </p>
                <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                  {logCount} séries registradas
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
