import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { db } from '../db/database'
import { deleteSession } from '../db/sessionService'

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

interface DeleteTarget {
  sessionId: number
  workoutName: string
  inProgress: boolean
}

export function HistoryPage() {
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteSession(deleteTarget.sessionId)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const deleteMessage = deleteTarget?.inProgress
    ? `O treino "${deleteTarget.workoutName}" em andamento e todas as séries registradas serão removidos.`
    : `O registro de "${deleteTarget?.workoutName}" e todas as séries serão removidos permanentemente.`

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
              <li
                key={session.id}
                className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5"
              >
                <Link to={`/sessao/${session.id}`} className="block p-4 active:opacity-80">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {workout?.name ?? 'Treino'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(session.startedAt)} · {logCount} séries
                  </p>
                </Link>
                <div className="border-t border-emerald-500/20 px-4 py-2 dark:border-emerald-500/30">
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({
                        sessionId: session.id!,
                        workoutName: workout?.name ?? 'Treino',
                        inProgress: true,
                      })
                    }
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400"
                  >
                    Excluir
                  </button>
                </div>
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
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
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
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({
                        sessionId: session.id!,
                        workoutName: workout?.name ?? 'Treino',
                        inProgress: false,
                      })
                    }
                    className="shrink-0 rounded-lg border border-rose-300 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:border-rose-800 dark:text-rose-400"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={deleteTarget != null}
        title="Excluir do histórico?"
        message={deleteMessage}
        confirmLabel={deleting ? 'Excluindo...' : 'Excluir'}
        destructive
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={() => !deleting && handleDelete()}
      />
    </div>
  )
}
