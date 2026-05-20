import { db } from '../db/database'

export async function getLastWorkoutDate(workoutId: number): Promise<Date | null> {
  const sessions = await db.sessions.where('workoutId').equals(workoutId).toArray()

  const completed = sessions
    .filter((s) => s.finishedAt != null)
    .sort((a, b) => b.finishedAt!.getTime() - a.finishedAt!.getTime())

  return completed[0]?.finishedAt ?? null
}

export function formatLastWorkoutDate(date: Date | null): string {
  if (!date) return 'Nunca realizado'

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
