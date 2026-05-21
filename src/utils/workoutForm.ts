import type { WeightUnit } from './weight'
import { displayToKg, kgToDisplay } from './weight'

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

export function exerciseToDraft(
  ex: {
    id?: number
    name: string
    targetSets: number
    targetReps?: string | number
    defaultWeightKg?: number
  },
  weightUnit: WeightUnit = 'kg',
): ExerciseDraft {
  const reps =
    typeof ex.targetReps === 'number'
      ? String(ex.targetReps)
      : (ex.targetReps?.trim() || '10')

  const kg = ex.defaultWeightKg ?? 0

  return {
    id: ex.id,
    name: ex.name,
    targetSets: String(ex.targetSets),
    targetReps: reps,
    defaultWeightKg: kg > 0 ? String(kgToDisplay(kg, weightUnit)) : '',
  }
}

export function parseExerciseDrafts(
  drafts: ExerciseDraft[],
  weightUnit: WeightUnit = 'kg',
): ParsedExercise[] {
  return drafts
    .map((ex) => {
      const exName = ex.name.trim()
      if (!exName) return null

      const targetSets = parseInt(ex.targetSets, 10)
      const targetReps = ex.targetReps.trim()
      const weightDisplay = parseFloat((ex.defaultWeightKg || '0').replace(',', '.'))
      const defaultWeightKg = displayToKg(
        Number.isNaN(weightDisplay) ? 0 : weightDisplay,
        weightUnit,
      )

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
