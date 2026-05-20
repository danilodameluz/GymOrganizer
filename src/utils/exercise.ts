import type { Exercise } from '../types'

export function formatTargetReps(targetReps: string | number | undefined): string {
  if (targetReps == null) return '10'
  if (typeof targetReps === 'number') return String(targetReps)
  return targetReps.trim() || '10'
}

/** Primeiro valor numérico do plano (ex.: "15/12/10" → 15) para pré-preencher registro de série */
export function getDefaultRepFromTarget(targetReps: string | number | undefined): number {
  const text = formatTargetReps(targetReps)
  const first = text.split(/[/,\s-]+/)[0]?.trim()
  const n = parseInt(first, 10)
  return Number.isNaN(n) || n < 1 ? 10 : n
}

export function formatExercisePlan(ex: Exercise): string {
  const reps = formatTargetReps(ex.targetReps)
  const weightKg = ex.defaultWeightKg ?? 0
  const weight = weightKg > 0 ? `${weightKg} kg` : 'peso livre'
  return `${ex.targetSets} séries · ${reps} reps · ${weight}`
}
