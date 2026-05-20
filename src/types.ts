export interface Workout {
  id?: number
  name: string
  color: string
  createdAt: Date
}

export interface Exercise {
  id?: number
  workoutId: number
  name: string
  targetSets: number
  targetReps: string
  defaultWeightKg: number
  order: number
}

export interface Session {
  id?: number
  workoutId: number
  startedAt: Date
  finishedAt?: Date
}

export interface SetLog {
  id?: number
  sessionId: number
  exerciseId: number
  setNumber: number
  weightKg: number
  reps: number
  loggedAt: Date
}

export interface ExerciseWithLogs extends Exercise {
  logs: SetLog[]
}
