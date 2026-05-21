import { useEffect, useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { displayToKg, kgToDisplay } from '../utils/weight'

interface SetLogFormProps {
  setNumber: number
  /** Peso em kg (armazenamento interno) */
  defaultWeightKg?: number
  defaultReps?: number
  repsHint?: string
  lastWeightKg?: number
  lastReps?: number
  onSubmit: (weightKg: number, reps: number) => void
}

export function SetLogForm({
  setNumber,
  defaultWeightKg = 0,
  defaultReps = 10,
  repsHint,
  lastWeightKg,
  lastReps,
  onSubmit,
}: SetLogFormProps) {
  const { weightUnit } = useSettings()

  const plannedWeightKg = lastWeightKg ?? defaultWeightKg
  const plannedReps = lastReps ?? defaultReps
  const plannedDisplayWeight = kgToDisplay(plannedWeightKg, weightUnit)

  const [weight, setWeight] = useState(
    plannedDisplayWeight > 0 ? String(plannedDisplayWeight) : '',
  )
  const [reps, setReps] = useState(String(plannedReps))

  useEffect(() => {
    const display = kgToDisplay(plannedWeightKg, weightUnit)
    setWeight(display > 0 ? String(display) : '')
    setReps(String(plannedReps))
  }, [setNumber, plannedWeightKg, plannedReps, weightUnit])

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-lg font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const wDisplay = parseFloat(weight.replace(',', '.'))
    const r = parseInt(reps, 10)
    if (Number.isNaN(wDisplay) || Number.isNaN(r) || wDisplay < 0 || r < 1) return
    onSubmit(displayToKg(wDisplay, weightUnit), r)
    setReps(String(plannedReps))
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <label className="mb-1 block text-xs text-slate-500">
          Série {setNumber} · {weightUnit}
        </label>
        <input
          type="number"
          inputMode="decimal"
          step={weightUnit === 'kg' ? '0.5' : '1'}
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
