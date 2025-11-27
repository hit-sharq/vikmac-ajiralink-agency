"use client"

import { useState } from "react"
import { UserPlus, Edit2, Check, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export function UserManagementPage() {
  const { hasPermission, pendingUsers, staffUsers, approveUser, rejectUser, updateStaffRole, toggleStaffStatus } = useAuth()
  const [activeTab, setActiveTab] = useState<'pending' | 'staff'>('pending')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [newRole, setNewRole] = useState<'staff' | 'manager' | 'admin'>('staff')

  if (!hasPermission('admin')) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <div className="bg-red-900 border border-red-700 rounded-lg p-8 text-center">
          <p className="text-red-300 text-lg">Access Denied</p>
          <p className="text-red-400 mt-2">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Pending Approvals ({pendingUsers.filter(u => u.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'staff'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Staff Management ({staffUsers.length})
        </button>
      </div>

      {/* Pending Users Tab */}
      {activeTab === 'pending' && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Pending User Approvals</h2>
            <p className="text-gray-400 text-sm mt-1">Review and approve users who have registered</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Registered</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-3 text-white font-medium">{user.name}</td>
                    <td className="px-6 py-3 text-gray-400">{user.email}</td>
                    <td className="px-6 py-3 text-gray-400">{user.registeredAt}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        user.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                        user.status === 'approved' ? 'bg-green-900 text-green-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {user.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveUser(user.id).catch(console.error)}
                            className="p-1 hover:bg-green-700 rounded transition-colors"
                            title="Approve"
                          >
                            <Check size={18} className="text-green-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => rejectUser(user.id).catch(console.error)}
                            className="p-1 hover:bg-red-700 rounded transition-colors"
                            title="Reject"
                          >
                            <X size={18} className="text-red-400 hover:text-white" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pendingUsers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No pending user approvals</p>
            </div>
          )}
        </div>
      )}

      {/* Staff Management Tab */}
      {activeTab === 'staff' && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Staff Management</h2>
            <p className="text-gray-400 text-sm mt-1">Manage staff roles and permissions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Role</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Assigned</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-3 text-white font-medium">{user.name}</td>
                    <td className="px-6 py-3 text-gray-400">{user.email}</td>
                    <td className="px-6 py-3">
                      {editingUser === user.id ? (
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value as 'staff' | 'manager' | 'admin')}
                          className="px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="staff">Staff</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          user.role === 'admin' ? 'bg-red-900 text-red-300' :
                          user.role === 'manager' ? 'bg-blue-900 text-blue-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400">{user.assignedAt}</td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        {editingUser === user.id ? (
                          <>
                            <button
                              onClick={() => updateStaffRole(user.id, newRole).then(() => setEditingUser(null)).catch(console.error)}
                              className="p-1 hover:bg-green-700 rounded transition-colors"
                              title="Save"
                            >
                              <Check size={18} className="text-green-400 hover:text-white" />
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="p-1 hover:bg-red-700 rounded transition-colors"
                              title="Cancel"
                            >
                              <X size={18} className="text-red-400 hover:text-white" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingUser(user.id)
                                setNewRole(user.role)
                              }}
                              className="p-1 hover:bg-gray-600 rounded transition-colors"
                              title="Edit Role"
                            >
                              <Edit2 size={18} className="text-gray-400 hover:text-white" />
                            </button>
                            <button
                              onClick={() => toggleStaffStatus(user.id)}
                              className={`p-1 hover:bg-gray-600 rounded transition-colors ${
                                user.status === 'active' ? 'hover:bg-red-700' : 'hover:bg-green-700'
                              }`}
                              title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              <UserPlus size={18} className={`${
                                user.status === 'active' ? 'text-red-400' : 'text-green-400'
                              } hover:text-white`} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {staffUsers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No staff users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
