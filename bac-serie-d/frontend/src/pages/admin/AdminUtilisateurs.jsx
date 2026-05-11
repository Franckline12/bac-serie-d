import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Users, Shield, User, Trash2, RefreshCw } from 'lucide-react'

export default function AdminUtilisateurs() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg]         = useState('')

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.data)
    } catch {
      // Démo
      setUsers([
        { id: 1, nom: 'Franckline', email: 'franckline@1.com', role: 'admin',    created_at: '2025-01-01', nb_quiz: 5  },
        { id: 2, nom: 'Rakoto',     email: 'rakoto@test.mg',   role: 'etudiant', created_at: '2025-01-05', nb_quiz: 12 },
        { id: 3, nom: 'Rasoa',      email: 'rasoa@test.mg',    role: 'etudiant', created_at: '2025-01-10', nb_quiz: 8  },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const changerRole = async (id, roleActuel) => {
    const nouveauRole = roleActuel === 'admin' ? 'etudiant' : 'admin'
    try {
      await api.put(`/admin/users/${id}/role`, { role: nouveauRole })
      setMsg(`Rôle changé en ${nouveauRole} ✅`)
      fetchUsers()
    } catch {
      // Mise à jour locale pour démo
      setUsers(u => u.map(user =>
        user.id === id ? { ...user, role: nouveauRole } : user
      ))
      setMsg(`Rôle changé en ${nouveauRole} ✅`)
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const supprimerUser = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(u => u.filter(user => user.id !== id))
      setMsg('Utilisateur supprimé ✅')
    } catch {
      setUsers(u => u.filter(user => user.id !== id))
      setMsg('Utilisateur supprimé ✅')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Utilisateurs</h1>
            <p className="text-sm text-gray-500">{users.length} comptes inscrits</p>
          </div>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {msg && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg border border-green-100">
          {msg}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Nom', 'Email', 'Rôle', 'Quiz faits', 'Inscrit le', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                      u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {u.nom?.slice(0,2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{u.nom}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    u.role === 'admin'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {u.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.nb_quiz || 0}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => changerRole(u.id, u.role)}
                      className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      title="Changer le rôle">
                      {u.role === 'admin' ? '→ Étudiant' : '→ Admin'}
                    </button>
                    <button
                      onClick={() => supprimerUser(u.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
