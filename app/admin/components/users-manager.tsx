"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import styles from "./manager.module.css"
import type { DesktopUser } from "@prisma/client"
interface User {
  id: string
  clerkId: string
  email: string
  role: string
  createdAt: string
}

export default function UsersManager() {
  const { user, isSignedIn } = useUser()
  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
  const isAdmin = isSignedIn && user && adminIds.includes(user.id)

  const [users, setUsers] = useState<User[]>([])
  const [desktopUsers, setDesktopUsers] = useState<DesktopUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"web" | "desktop">("web")
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [resetPasswordUser, setResetPasswordUser] = useState<DesktopUser | null>(null)

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

  const updateDesktopStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/desktop-users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        fetchDesktopUsers()
      } else {
        setError("Failed to update desktop user status")
      }
    } catch (err) {
      setError("Error updating desktop user status")
    }
  }

  const updateDesktopPassword = async (id: string, password: string) => {
    try {
      const response = await fetch(`/api/desktop-users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (response.ok) {
        setShowPasswordModal(true)
        fetchDesktopUsers()
      } else {
        setError("Failed to reset password")
      }
    } catch (err) {
      setError("Error resetting password")
    }
  }

  const createDesktopUser = async (data: any) => {
    try {
      const response = await fetch("/api/desktop-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setShowForm(false)
        fetchDesktopUsers()
        setShowPasswordModal(true)
      } else {
        setFormError("Failed to create user")
      }
    } catch (err) {
      setFormError("Error creating user")
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
            className={`${styles.tab} ${activeTab === "web" ? styles.active : ""}`}
            onClick={() => setActiveTab("web")}
          >
            Web Users
          </button>
          <button
            className={`${styles.tab} ${activeTab === "desktop" ? styles.active : ""}`}
            onClick={() => setActiveTab("desktop")}
          >
            Desktop Users
          </button>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={() => {
            if (activeTab === "web") fetchUsers()
            else fetchDesktopUsers()
          }}
        >
          Refresh
        </button>
        {activeTab === "desktop" && (
          <button className={styles.createBtn} onClick={() => setShowForm(true)}>
            Create Desktop User
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.formModal}>
          <h3>Create Desktop User</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const tempPassword = Math.random().toString(36).substring(2, 14)
              setGeneratedPassword(tempPassword)
              const data = {
                name: formData.get("name"),
                email: formData.get("email"),
                password: tempPassword,
                role: formData.get("role"),
                status: formData.get("status"),
                assignedAt: new Date().toISOString(),
              }
              createDesktopUser(data)
              setShowPasswordModal(true)
            }}
          >
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <select name="role" required>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <select name="status" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button type="submit">Create</button>
          </form>
          {formError && <div className={styles.error}>{formError}</div>}
          <button className={styles.closeBtn} onClick={() => setShowForm(false)}>
            Close
          </button>
        </div>
      )}

      {showPasswordModal && (
        <div className={styles.formModal}>
          <h3>{resetPasswordUser ? "Password Reset Successfully" : "Desktop User Created Successfully"}</h3>
          <p>The {resetPasswordUser ? "password has been reset" : "user has been created"} with the following temporary password:</p>
          <div className={styles.passwordDisplay}>
            <strong>{generatedPassword}</strong>
          </div>
          <p>Please share this password with the user securely. They should change it upon first login.</p>
          <button
            className={styles.closeBtn}
            onClick={() => {
              setShowPasswordModal(false)
              setGeneratedPassword("")
              setResetPasswordUser(null)
            }}
          >
            Close
          </button>
        </div>
      )}

      <div className={styles.tableContainer}>
        {activeTab === "web" ? (
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
                    <select
                      value={user.status}
                      onChange={(e) => updateDesktopStatus(user.id, e.target.value)}
                      className={styles.statusSelect}
                      style={{ marginLeft: '8px' }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button
                      className={styles.resetBtn}
                      onClick={() => {
                        const newPassword = Math.random().toString(36).substring(2, 14)
                        setGeneratedPassword(newPassword)
                        setResetPasswordUser(user)
                        updateDesktopPassword(user.id, newPassword)
                      }}
                    >
                      Reset Password
                    </button>
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
