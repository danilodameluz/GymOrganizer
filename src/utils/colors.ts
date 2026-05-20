const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
}

export function workoutAccent(color: string): string {
  return colorMap[color] ?? 'bg-emerald-500'
}

export const workoutColorOptions = [
  { id: 'emerald', label: 'Verde' },
  { id: 'sky', label: 'Azul' },
  { id: 'amber', label: 'Âmbar' },
  { id: 'rose', label: 'Rosa' },
  { id: 'violet', label: 'Violeta' },
]
