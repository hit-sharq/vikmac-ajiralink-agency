"use client"

import type React from "react"

import { useState } from "react"
import styles from "./manager.module.css"

interface DesktopUserFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  initialData?: any
}

export default function DesktopUserForm({ onSubmit, isLoading, initialData }: DesktopUserFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "staff",
    status: initialData?.status || "active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label>{initialData ? "New Password (leave blank to keep)" : "Password"} *</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!initialData}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          disabled={isLoading}
        >
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          disabled={isLoading}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} className={styles.submitBtn}>
        {isLoading ? "Saving..." : initialData ? "Update User" : "Create User"}
      </button>
    </form>
  )
}
