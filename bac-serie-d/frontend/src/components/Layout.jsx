import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, BookOpen, Layers, FileText,
  Archive, Brain, TrendingUp, BarChart2, LogOut,
  Moon, Sun, GraduationCap, Users, PlusCircle,
  Settings, BookMarked, HelpCircle, Shield
} from 'lucide-react'
import { useState } from 'react'

// Navigation ÉTUDIANT
const studentNav = [
  { label: 'Dashboard',     to: '/dashboard',         icon: LayoutDashboard },
  { label: 'Matières',      to: '/matieres',          icon: Layers },
  { label: 'Cours',         to: '/chapitres/1/cours', icon: BookOpen },
  { label: 'Exercices',     to: '/exercices',         icon: FileText },
  { label: 'Sujets Bac',   to: '/sujets',            icon: Archive },
  { label: 'Quiz',          to: '/quiz',              icon: Brain },
  { label: 'Progression',   to: '/progression',       icon: TrendingUp },
  { label: 'Résultats',     to: '/resultats',         icon: BarChart2 },
]

// Navigation ADMIN
const adminNav = [
  { label: 'Dashboard Admin', to: '/admin/dashboard',   icon: LayoutDashboard, section: 'Général' },
  { label: 'Utilisateurs',    to: '/admin/utilisateurs', icon: Users,           section: 'Général' },
  { label: 'Matières',        to: '/admin/matieres',    icon: Layers,          section: 'Contenu' },
  { label: 'Chapitres',       to: '/admin/chapitres',   icon: BookMarked,      section: 'Contenu' },
  { label: 'Cours',           to: '/admin/cours',       icon: BookOpen,        section: 'Contenu' },
  { label: 'Exercices',       to: '/admin/exercices',   icon: FileText,        section: 'Contenu' },
  { label: 'Quiz & Questions',to: '/admin/quiz',        icon: HelpCircle,      section: 'Contenu' },
  { label: 'Sujets Bac',     to: '/admin/sujets',      icon: Archive,         section: 'Contenu' },
  { label: 'Statistiques',    to: '/admin/stats',       icon: BarChart2,       section: 'Analyse' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const isAdmin = user?.role === 'admin'

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle('dark', !d)
      return !d
    })
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const navItems = isAdmin ? adminNav : studentNav

  // Grouper les sections admin
  const sections = isAdmin
    ? [...new Set(adminNav.map(i => i.section))]
    : null

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
        {/* Brand */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={20} className="text-primary" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">BacPro Madagascar</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center bg-primary-light text-primary text-xs font-medium px-2 py-0.5 rounded-full">
              Série D · 2025
            </span>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                <Shield size={10} /> Admin
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {isAdmin ? (
            // Navigation admin avec sections
            sections.map(section => (
              <div key={section}>
                <p className="text-xs text-gray-400 font-medium px-2 py-2 mt-2">{section.toUpperCase()}</p>
                {adminNav.filter(i => i.section === section).map(({ label, to, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-red-50 text-red-600 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    <Icon size={15} />
                    {label}
                  </NavLink>
                ))}
              </div>
            ))
          ) : (
            // Navigation étudiant
            studentNav.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-primary-light text-primary font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))
          )}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
              isAdmin ? 'bg-red-50 text-red-600' : 'bg-primary-light text-primary'
            }`}>
              {user?.nom?.slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user?.nom}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={toggleDark}
              className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              {dark ? <Sun size={12} /> : <Moon size={12} />}
              {dark ? 'Clair' : 'Sombre'}
            </button>
            <button onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1 text-xs text-red-500 hover:text-red-700 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut size={12} />
              Déco
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
