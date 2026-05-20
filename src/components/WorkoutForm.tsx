import { useState } from 'react'
import { workoutColorOptions } from '../utils/colors'
import {
  createEmptyExercise,
  parseExerciseDrafts,
  type ExerciseDraft,
  type ParsedExercise,
} from '../utils/workoutForm'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

const labelClass = 'mb-1 block text-xs text-slate-500'

interface WorkoutFormProps {
  initialName?: string
  initialColor?: string
  initialExercises?: ExerciseDraft[]
  submitLabel: string
  onSubmit: (name: string, color: string, exercises: ParsedExercise[]) => void | Promise<void>
}

export function WorkoutForm({
  initialName = '',
  initialColor = 'emerald',
  initialExercises,
  submitLabel,
  onSubmit,
}: WorkoutFormProps) {
  const [name, setName] = useState(initialName)
  const [color, setColor] = useState(initialColor)
  const [exercises, setExercises] = useState<ExerciseDraft[]>(
    initialExercises?.length ? initialExercises : [createEmptyExercise()],
  )
  const [error, setError] = useState('')

  const addExercise = () => setExercises((prev) => [...prev, createEmptyExercise()])

  const removeExercise = (index: number) => {
    if (exercises.length <= 1) return
    setExercises((prev) => prev.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof ExerciseDraft, value: string) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Informe o nome do treino.')
      return
    }

    const parsed = parseExerciseDrafts(exercises)
    if (parsed.length === 0) {
      setError('Adicione pelo menos um exercício válido (nome, séries e reps).')
      return
    }

    await onSubmit(trimmedName, color, parsed)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Nome do treino</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Ombro e trapézio"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Cor</label>
        <div className="flex flex-wrap gap-2">
          {workoutColorOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setColor(opt.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                color === opt.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Exercícios</label>
        <div className="space-y-4">
          {exercises.map((ex, index) => (
            <div
              key={ex.id ?? `new-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Exercício {index + 1}
                </span>
                {exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-xs text-rose-500"
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Nome</label>
                  <input
                    type="text"
                    value={ex.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    placeholder="Ex.: Supino reto"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={labelClass}>Séries</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      value={ex.targetSets}
                      onChange={(e) => updateExercise(index, 'targetSets', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Reps</label>
                    <input
                      type="text"
                      value={ex.targetReps}
                      onChange={(e) => updateExercise(index, 'targetReps', e.target.value)}
                      placeholder="10 ou 15/12/10/08"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Peso (kg)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      min="0"
                      value={ex.defaultWeightKg}
                      onChange={(e) =>
                        updateExercise(index, 'defaultWeightKg', e.target.value)
                      }
                      placeholder="0"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addExercise}
          className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
        >
          + Adicionar exercício
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white active:bg-emerald-500"
      >
        {submitLabel}
      </button>
    </form>
  )
}
