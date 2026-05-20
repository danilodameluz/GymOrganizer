import { useEffect, useState } from 'react'

interface SetLogFormProps {
  setNumber: number
  defaultWeight?: number
  defaultReps?: number
  repsHint?: string
  lastWeight?: number
  lastReps?: number
  onSubmit: (weightKg: number, reps: number) => void
}

export function SetLogForm({
  setNumber,
  defaultWeight = 0,
  defaultReps = 10,
  repsHint,
  lastWeight,
  lastReps,
  onSubmit,
}: SetLogFormProps) {
  const plannedWeight = lastWeight ?? defaultWeight
  const plannedReps = lastReps ?? defaultReps

  const [weight, setWeight] = useState(plannedWeight > 0 ? String(plannedWeight) : '')
  const [reps, setReps] = useState(String(plannedReps))

  useEffect(() => {
    setWeight(plannedWeight > 0 ? String(plannedWeight) : '')
    setReps(String(plannedReps))
  }, [setNumber, plannedWeight, plannedReps])

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-lg font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(weight.replace(',', '.'))
    const r = parseInt(reps, 10)
    if (Number.isNaN(w) || Number.isNaN(r) || w < 0 || r < 1) return
    onSubmit(w, r)
    setReps(String(plannedReps))
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <label className="mb-1 block text-xs text-slate-500">Série {setNumber} · kg</label>
        <input
          type="number"
          inputMode="decimal"
          step="0.5"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="0"
          className={inputClass}
        />
      </div>
      <div className="w-20">
        <label className="mb-1 block text-xs text-slate-500">
          Reps{repsHint && repsHint.includes('/') ? ` (${repsHint})` : ''}
        </label>
        <input
          type="number"
          inputMode="numeric"
          min="1"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white active:bg-emerald-500"
      >
        ✓
      </button>
    </form>
  )
}
