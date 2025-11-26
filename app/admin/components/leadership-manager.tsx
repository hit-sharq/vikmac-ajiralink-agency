"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface Leader {
  id: string
  name: string
  position: string
  role: string
  imageUrl?: string
  order: number
}

export default function LeadershipManager() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    role: "",
    imageUrl: "",
    order: 0,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    fetchLeaders()
  }, [])

  const fetchLeaders = async () => {
    try {
      setError(null)
      const response = await fetch("/api/leadership")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setLeaders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching leaders:", error)
      setError("Unable to load leadership team. Please check your database connection.")
      setLeaders([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let imageUrl = formData.imageUrl

      if (selectedFile) {
        const formDataUpload = new FormData()
        formDataUpload.append("file", selectedFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        } else {
          alert("Image upload failed. Please try again.")
          return
        }
      }

      const url = "/api/leadership"
      const method = editingLeader ? "PUT" : "POST"
      const body = editingLeader ? { ...formData, id: editingLeader.id, imageUrl } : { ...formData, imageUrl }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        await fetchLeaders()
        resetForm()
      } else {
        const errorData = await response.json()
        alert(`Failed to save leader: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error saving leader:", error)
      alert("An error occurred while saving. Please try again.")
    }
  }

  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader)
    setFormData({
      name: leader.name,
      position: leader.position,
      role: leader.role,
      imageUrl: leader.imageUrl || "",
      order: leader.order,
    })
    setPreviewUrl(leader.imageUrl || "")
    setSelectedFile(null)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leader?")) return

    try {
      const response = await fetch(`/api/leadership?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchLeaders()
      }
    } catch (error) {
      console.error("Error deleting leader:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      role: "",
      imageUrl: "",
      order: 0,
    })
    setEditingLeader(null)
    setShowForm(false)
    setSelectedFile(null)
    setPreviewUrl("")
  }

  if (loading) {
    return <div className={styles.loading}>Loading leadership team...</div>
  }

  if (error) {
    return (
      <div className={styles.manager}>
        <div style={{ textAlign: "center", padding: "40px", background: "#fff3cd", borderRadius: "12px" }}>
          <h2 style={{ color: "#856404", marginBottom: "16px" }}>⚠️ Connection Error</h2>
          <p style={{ color: "#856404", marginBottom: "16px" }}>{error}</p>
          <p style={{ color: "#856404", marginBottom: "24px" }}>
            Please ensure your DATABASE_URL environment variable is set correctly.
          </p>
          <button onClick={fetchLeaders} className={styles.addBtn}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h1 className={styles.title}>Leadership Team</h1>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Leader"}
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Position</label>
              <input
                type="text"
                className={styles.input}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g., President, Vice President"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Role Description</label>
            <textarea
              className={styles.textarea}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Leading the vision and strategy"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className={styles.input} />
              {previewUrl && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Display Order</label>
              <input
                type="number"
                className={styles.input}
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>
              {editingLeader ? "Update Leader" : "Add Leader"}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={styles.gridList}>
        {leaders.length === 0 ? (
          <p className={styles.empty}>No leadership team members yet. Add your first leader!</p>
        ) : (
          leaders.map((leader) => (
            <div key={leader.id} className={styles.gridCard}>
              <div
                className={styles.gridImage}
                style={{
                  backgroundImage: leader.imageUrl ? `url(${leader.imageUrl})` : "none",
                  backgroundColor: leader.imageUrl ? "transparent" : "#f0f0f0",
                  backgroundPosition: 'center top',
                }}
              >
                {!leader.imageUrl && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      background: "linear-gradient(135deg, #002060, #003080)",
                      color: "white",
                    }}
                  >
                    👤
                  </div>
                )}
              </div>
              <div className={styles.gridContent}>
                <h3 className={styles.gridTitle}>{leader.name}</h3>
                <p className={styles.cardMeta} style={{ color: "#d32f2f", fontWeight: 600, marginBottom: "8px" }}>
                  {leader.position}
                </p>
                <p className={styles.cardExcerpt}>{leader.role}</p>
              </div>
              <div className={styles.gridActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(leader)}>
                  Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(leader.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
