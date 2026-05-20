import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ThemeProvider } from './context/ThemeContext'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { NewWorkoutPage } from './pages/NewWorkoutPage'
import { SessionPage } from './pages/SessionPage'
import { EditWorkoutPage } from './pages/EditWorkoutPage'
import { WorkoutDetailPage } from './pages/WorkoutDetailPage'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="treino/:id" element={<WorkoutDetailPage />} />
            <Route path="treino/:id/editar" element={<EditWorkoutPage />} />
            <Route path="sessao/:id" element={<SessionPage />} />
            <Route path="historico" element={<HistoryPage />} />
            <Route path="novo-treino" element={<NewWorkoutPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
