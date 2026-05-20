import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-lg transition-colors active:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
