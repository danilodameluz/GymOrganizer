export type WeightUnit = 'kg' | 'lbs'

const KG_TO_LBS = 2.2046226218

export function kgToDisplay(kg: number, unit: WeightUnit): number {
  if (unit === 'kg') return kg
  return Math.round(kg * KG_TO_LBS * 10) / 10
}

export function displayToKg(value: number, unit: WeightUnit): number {
  if (unit === 'kg') return value
  return Math.round((value / KG_TO_LBS) * 100) / 100
}

export function formatWeight(kg: number, unit: WeightUnit): string {
  if (kg <= 0) return `peso livre`
  return `${kgToDisplay(kg, unit)} ${unit}`
}

export function weightFieldLabel(unit: WeightUnit): string {
  return `Peso (${unit})`
}
