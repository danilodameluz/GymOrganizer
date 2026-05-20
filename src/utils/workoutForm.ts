export interface ExerciseDraft {
  id?: number
  name: string
  targetSets: string
  targetReps: string
  defaultWeightKg: string
}

export interface ParsedExercise {
  id?: number
  name: string
  targetSets: number
  targetReps: string
  defaultWeightKg: number
}

export function createEmptyExercise(): ExerciseDraft {
  return { name: '', targetSets: '3', targetReps: '10', defaultWeightKg: '' }
}

export function exerciseToDraft(ex: {
  id?: number
  name: string
  targetSets: number
  targetReps?: string | number
  defaultWeightKg?: number
}): ExerciseDraft {
  const reps =
    typeof ex.targetReps === 'number'
      ? String(ex.targetReps)
      : (ex.targetReps?.trim() || '10')

  return {
    id: ex.id,
    name: ex.name,
    targetSets: String(ex.targetSets),
    targetReps: reps,
    defaultWeightKg:
      (ex.defaultWeightKg ?? 0) > 0 ? String(ex.defaultWeightKg) : '',
  }
}

export function parseExerciseDrafts(drafts: ExerciseDraft[]): ParsedExercise[] {
  return drafts
    .map((ex) => {
      const exName = ex.name.trim()
      if (!exName) return null

      const targetSets = parseInt(ex.targetSets, 10)
      const targetReps = ex.targetReps.trim()
      const defaultWeightKg = parseFloat((ex.defaultWeightKg || '0').replace(',', '.'))

      if (
        Number.isNaN(targetSets) ||
        targetSets < 1 ||
        !targetReps ||
        Number.isNaN(defaultWeightKg) ||
        defaultWeightKg < 0
      ) {
        return null
      }

      const parsed: ParsedExercise = {
        name: exName,
        targetSets,
        targetReps,
        defaultWeightKg,
      }
      if (ex.id != null) parsed.id = ex.id
      return parsed
    })
    .filter((ex): ex is ParsedExercise => ex !== null)
}
