import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages étudiant
import Login          from './pages/Login'
import Register       from './pages/Register'
import Layout         from './components/Layout'
import Dashboard      from './pages/Dashboard'
import Matieres       from './pages/Matieres'
import Chapitres      from './pages/Chapitres'
import CoursPage      from './pages/CoursPage'
import CoursDetail    from './pages/CoursDetail'
import Exercices      from './pages/Exercices'
import Sujets         from './pages/Sujets'
import QuizList       from './pages/QuizList'
import QuizPlay       from './pages/QuizPlay'
import Progression    from './pages/Progression'
import Resultats      from './pages/Resultats'

// Pages admin
import AdminDashboard     from './pages/admin/AdminDashboard'
import AdminUtilisateurs  from './pages/admin/AdminUtilisateurs'
import AdminMatieres      from './pages/admin/AdminMatieres'
import AdminChapitres     from './pages/admin/AdminChapitres'
import AdminCours         from './pages/admin/AdminCours'
import AdminExercices     from './pages/admin/AdminExercices'
import AdminQuiz          from './pages/admin/AdminQuiz'
import AdminSujets        from './pages/admin/AdminSujets'
import AdminStats         from './pages/admin/AdminStats'

// Route protégée
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

// Route admin uniquement
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            {/* Redirection selon le rôle */}
            <Route index element={<RoleRedirect />} />

            {/* Routes étudiant */}
            <Route path="dashboard"              element={<Dashboard />} />
            <Route path="matieres"               element={<Matieres />} />
            <Route path="matieres/:id/chapitres" element={<Chapitres />} />
            <Route path="chapitres/:id/cours"    element={<CoursPage />} />
            <Route path="cours/:id"              element={<CoursDetail />} />
            <Route path="exercices"              element={<Exercices />} />
            <Route path="sujets"                 element={<Sujets />} />
            <Route path="quiz"                   element={<QuizList />} />
            <Route path="quiz/:id/play"          element={<QuizPlay />} />
            <Route path="progression"            element={<Progression />} />
            <Route path="resultats"              element={<Resultats />} />

            {/* Routes admin */}
            <Route path="admin/dashboard"    element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="admin/utilisateurs" element={<AdminRoute><AdminUtilisateurs /></AdminRoute>} />
            <Route path="admin/matieres"     element={<AdminRoute><AdminMatieres /></AdminRoute>} />
            <Route path="admin/chapitres"    element={<AdminRoute><AdminChapitres /></AdminRoute>} />
            <Route path="admin/cours"        element={<AdminRoute><AdminCours /></AdminRoute>} />
            <Route path="admin/exercices"    element={<AdminRoute><AdminExercices /></AdminRoute>} />
            <Route path="admin/quiz"         element={<AdminRoute><AdminQuiz /></AdminRoute>} />
            <Route path="admin/sujets"       element={<AdminRoute><AdminSujets /></AdminRoute>} />
            <Route path="admin/stats"        element={<AdminRoute><AdminStats /></AdminRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

// Redirige admin → /admin/dashboard, étudiant → /dashboard
function RoleRedirect() {
  const { user } = useAuth()
  return user?.role === 'admin'
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/dashboard" replace />
}
