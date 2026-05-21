import { NavLink, Outlet } from 'react-router-dom'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium leading-tight transition-colors sm:text-xs ${
    isActive
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-slate-500 dark:text-slate-500'
  }`

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-4 pt-4">
        <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          GymOrganizer
        </span>
      </header>

      <main className="flex-1 px-4 pb-24 pt-2">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
          <NavLink to="/" end className={navClass}>
            <span className="text-base" aria-hidden>
              🏋️
            </span>
            Treinos
          </NavLink>
          <NavLink to="/historico" className={navClass}>
            <span className="text-base" aria-hidden>
              📊
            </span>
            Histórico
          </NavLink>
          <NavLink to="/configuracoes" className={navClass}>
            <span className="text-base" aria-hidden>
              ⚙️
            </span>
            Ajustes
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
