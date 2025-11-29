import React, { useState, useEffect } from 'react'

interface DesktopUser {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<DesktopUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/desktop-users')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'text-red-400'
      case 'manager': return 'text-blue-400'
      case 'staff': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-400'
      case 'inactive': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRoleBadge = (role: string) => {
    const colorClass = getRoleColor(role)
    return `${colorClass} bg-gray-700 px-2 py-1 text-xs rounded-full`
  }

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status)
    return `${colorClass} bg-gray-700 px-2 py-1 text-xs rounded-full`
  }

  const resetFilters = () => {
    setRoleFilter('all')
    setStatusFilter('all')
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading users...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
        <div className="bg-red-900 border border-red-700 p-4 rounded-lg">
          <p className="text-red-200">Error loading users: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <div className="text-white">
          Total: {filteredUsers.length} users
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <div className="flex gap-2">
                <span className={getRoleBadge(user.role)}>
                  {user.role}
                </span>
                <span className={getStatusBadge(user.status)}>
                  {user.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Role:</span> {user.role}</p>
              <p><span className="font-medium">Status:</span> {user.status}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-xs text-gray-500 space-y-1">
                <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No users found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default UserManagementPage
