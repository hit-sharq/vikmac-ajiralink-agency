"use client"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"
import { DesktopUser } from "@prisma/client"
interface User {
  id: string
  clerkId: string
  email: string
  role: string
  createdAt: string
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [desktopUsers, setDesktopUsers] = useState<DesktopUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<'web' | 'desktop'>('web')

  useEffect(() => {
    fetchUsers()
    fetchDesktopUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setError("Failed to fetch users")
      }
    } catch (err) {
      setError("Error fetching users")
    } finally {
      setLoading(false)
    }
  }

  const fetchDesktopUsers = async () => {
    try {
      const response = await fetch("/api/desktop-users")
      if (response.ok) {
        const data = await response.json()
        setDesktopUsers(data)
      } else {
        setError("Failed to fetch desktop users")
      }
    } catch (err) {
      setError("Error fetching desktop users")
    }
  }

  const updateRole = async (id: string, role: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      if (response.ok) {
        fetchUsers()
      } else {
        setError("Failed to update role")
      }
    } catch (err) {
      setError("Error updating role")
    }
  }

  const updateDesktopRole = async (id: string, role: string) => {
    try {
      const response = await fetch(`/api/desktop-users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      if (response.ok) {
        fetchDesktopUsers()
      } else {
        setError("Failed to update desktop user role")
      }
    } catch (err) {
      setError("Error updating desktop user role")
    }
  }

  if (loading) return <div className={styles.loading}>Loading users...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Users Management</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'web' ? styles.active : ''}`}
            onClick={() => setActiveTab('web')}
          >
            Web Users
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'desktop' ? styles.active : ''}`}
            onClick={() => setActiveTab('desktop')}
          >
            Desktop Users
          </button>
        </div>
        <button className={styles.refreshBtn} onClick={() => {
          if (activeTab === 'web') fetchUsers()
          else fetchDesktopUsers()
        }}>
          Refresh
        </button>
      </div>

      <div className={styles.tableContainer}>
        {activeTab === 'web' ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="user">User</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="training-officer">Training Officer</option>
                      <option value="visa-officer">Visa Officer</option>
                      <option value="finance-officer">Finance Officer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {desktopUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{new Date(user.assignedAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateDesktopRole(user.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
