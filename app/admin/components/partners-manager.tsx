"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface Partner {
  id: string
  name: string
  description?: string
  logoUrl?: string
  website?: string
  category: string
  featured: boolean
  order: number
}

export default function PartnersManager() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    website: "",
    category: "general",
    featured: false,
    order: 0,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setError(null)
      const response = await fetch("/api/partners")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPartners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching partners:", error)
      setError("Unable to load partners. Please check your database connection.")
      setPartners([])
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
      let logoUrl = formData.logoUrl

      if (selectedFile) {
        const formDataUpload = new FormData()
        formDataUpload.append("file", selectedFile)

        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formDataUpload,
          })

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json()
            logoUrl = uploadData.url
          } else {
            console.warn("Logo upload failed, proceeding without logo")
            // Proceed without logo
          }
        } catch (error) {
          console.warn("Logo upload error, proceeding without logo:", error)
          // Proceed without logo
        }
      }

      const url = "/api/partners"
      const method = editingPartner ? "PUT" : "POST"
      const body = editingPartner ? { ...formData, id: editingPartner.id, logoUrl } : { ...formData, logoUrl }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        await fetchPartners()
        resetForm()
      } else {
        const errorData = await response.json()
        alert(`Failed to save partner: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error saving partner:", error)
      alert("An error occurred while saving. Please try again.")
    }
  }

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      description: partner.description || "",
      logoUrl: partner.logoUrl || "",
      website: partner.website || "",
      category: partner.category,
      featured: partner.featured,
      order: partner.order,
    })
    setPreviewUrl(partner.logoUrl || "")
    setSelectedFile(null)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return

    try {
      const response = await fetch(`/api/partners?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPartners()
      }
    } catch (error) {
      console.error("Error deleting partner:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logoUrl: "",
      website: "",
      category: "general",
      featured: false,
      order: 0,
    })
    setEditingPartner(null)
    setShowForm(false)
    setSelectedFile(null)
    setPreviewUrl("")
  }

  if (loading) {
    return <div className={styles.loading}>Loading partners...</div>
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
          <button onClick={fetchPartners} className={styles.addBtn}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h1 className={styles.title}>Partners</h1>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Partner"}
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
              <label className={styles.label}>Category</label>
              <select
                className={styles.input}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="technology">Technology</option>
                <option value="education">Education</option>
                <option value="corporate">Corporate</option>
                <option value="non-profit">Non-Profit</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description (optional)</label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the partner"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Website (optional)</label>
              <input
                type="url"
                className={styles.input}
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
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

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Logo (optional)</label>
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
              <label className={styles.label}>Featured</label>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ marginTop: "10px" }}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>
              {editingPartner ? "Update Partner" : "Add Partner"}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={styles.gridList}>
        {partners.length === 0 ? (
          <p className={styles.empty}>No partners yet. Add your first partner!</p>
        ) : (
          partners.map((partner) => (
            <div key={partner.id} className={styles.gridCard}>
              <div
                className={styles.gridImage}
                style={{
                  backgroundImage: partner.logoUrl ? `url(${partner.logoUrl})` : "none",
                  backgroundColor: partner.logoUrl ? "transparent" : "#f0f0f0",
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                }}
              >
                {!partner.logoUrl && (
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
                    🤝
                  </div>
                )}
              </div>
              <div className={styles.gridContent}>
                <h3 className={styles.gridTitle}>{partner.name}</h3>
                <p className={styles.cardMeta} style={{ color: "#d32f2f", fontWeight: 600, marginBottom: "8px" }}>
                  {partner.category}
                </p>
                <p className={styles.cardExcerpt}>{partner.description}</p>
                {partner.website && (
                  <a href={partner.website} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Visit Website
                  </a>
                )}
              </div>
              <div className={styles.gridActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(partner)}>
                  Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(partner.id)}>
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
