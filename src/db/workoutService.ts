import { db } from './database'
import type { ParsedExercise } from '../utils/workoutForm'

export async function createWorkout(
  name: string,
  color: string,
  exercises: ParsedExercise[],
): Promise<number> {
  return db.transaction('rw', [db.workouts, db.exercises], async () => {
    const workoutId = (await db.workouts.add({
      name,
      color,
      createdAt: new Date(),
    })) as number

    await db.exercises.bulkAdd(
      exercises.map((ex, index) => ({
        workoutId,
        name: ex.name,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        defaultWeightKg: ex.defaultWeightKg,
        order: index,
      })),
    )

    return workoutId
  })
}

export async function updateWorkout(
  workoutId: number,
  name: string,
  color: string,
  exercises: ParsedExercise[],
): Promise<void> {
  await db.transaction('rw', [db.workouts, db.exercises], async () => {
    await db.workouts.update(workoutId, { name, color })

    const existing = await db.exercises.where('workoutId').equals(workoutId).toArray()
    const keptIds = new Set(exercises.filter((e) => e.id != null).map((e) => e.id!))

    for (const ex of existing) {
      if (ex.id != null && !keptIds.has(ex.id)) {
        await db.exercises.delete(ex.id)
      }
    }

    for (let index = 0; index < exercises.length; index++) {
      const ex = exercises[index]
      const data = {
        workoutId,
        name: ex.name,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        defaultWeightKg: ex.defaultWeightKg,
        order: index,
      }

      if (ex.id != null) {
        await db.exercises.update(ex.id, data)
      } else {
        await db.exercises.add(data)
      }
    }
  })
}

export async function deleteWorkout(workoutId: number): Promise<void> {
  await db.transaction('rw', [db.workouts, db.exercises, db.sessions, db.setLogs], async () => {
    const sessions = await db.sessions.where('workoutId').equals(workoutId).toArray()
    const sessionIds = sessions.map((s) => s.id!).filter((id) => id != null)

    if (sessionIds.length > 0) {
      await db.setLogs.where('sessionId').anyOf(sessionIds).delete()
      await db.sessions.where('workoutId').equals(workoutId).delete()
    }

    await db.exercises.where('workoutId').equals(workoutId).delete()
    await db.workouts.delete(workoutId)
  })
}

export async function hasActiveSession(workoutId: number): Promise<boolean> {
  const session = await db.sessions
    .filter((s) => s.workoutId === workoutId && s.finishedAt === undefined)
    .first()
  return session != null
}
