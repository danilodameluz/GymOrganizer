import Dexie, { type EntityTable } from 'dexie'
import type { Exercise, Session, SetLog, Workout } from '../types'

export class TreinoDatabase extends Dexie {
  workouts!: EntityTable<Workout, 'id'>
  exercises!: EntityTable<Exercise, 'id'>
  sessions!: EntityTable<Session, 'id'>
  setLogs!: EntityTable<SetLog, 'id'>

  constructor() {
    super('TreinoAcademiaDB')

    this.version(1).stores({
      workouts: '++id, name, createdAt',
      exercises: '++id, workoutId, order',
      sessions: '++id, workoutId, startedAt',
      setLogs: '++id, sessionId, exerciseId, loggedAt',
    })

    this.version(2)
      .stores({
        workouts: '++id, name, createdAt',
        exercises: '++id, workoutId, order',
        sessions: '++id, workoutId, startedAt',
        setLogs: '++id, sessionId, exerciseId, loggedAt',
      })
      .upgrade(async (tx) => {
        await tx
          .table('exercises')
          .toCollection()
          .modify((ex: Exercise) => {
            if (ex.targetReps == null) ex.targetReps = '10'
            if (ex.defaultWeightKg == null) ex.defaultWeightKg = 0
          })
      })

    this.version(3)
      .stores({
        workouts: '++id, name, createdAt',
        exercises: '++id, workoutId, order',
        sessions: '++id, workoutId, startedAt',
        setLogs: '++id, sessionId, exerciseId, loggedAt',
      })
      .upgrade(async (tx) => {
        await tx
          .table('exercises')
          .toCollection()
          .modify((ex: Exercise & { targetReps?: string | number }) => {
            if (typeof ex.targetReps === 'number') {
              ex.targetReps = String(ex.targetReps)
            } else if (!ex.targetReps) {
              ex.targetReps = '10'
            }
            if (ex.defaultWeightKg == null) ex.defaultWeightKg = 0
          })
      })
  }
}

export const db = new TreinoDatabase()
