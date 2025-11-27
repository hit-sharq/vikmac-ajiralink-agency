"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface Career {
  id: string
  title: string
  company: string
  description: string
  requirements: string
  location: string
  type: string
  salary?: string
  commission?: number
  commissionType?: string
  applicationDeadline?: string
  applicationUrl?: string
  contactEmail?: string
  featured: boolean
  image?: string
  createdAt: string
}

export default function CareersManager() {
  const [items, setItems] = useState<Career[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<Partial<Career>>({})
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/careers")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching careers:", error)
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
      if (!currentItem.title || currentItem.title.trim() === "") {
        alert("Title is required")
        return
      }

      if (!currentItem.company || currentItem.company.trim() === "") {
        alert("Company is required")
        return
      }

      if (!currentItem.description || currentItem.description.trim() === "") {
        alert("Description is required")
        return
      }

      let image = currentItem.image

      if (selectedFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', selectedFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          image = uploadData.url
        } else {
          console.error('Image upload failed')
          return
        }
      }

      const url = currentItem.id ? `/api/careers/${currentItem.id}` : "/api/careers"
      const method = currentItem.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentItem, image }),
      })

      if (response.ok) {
        fetchItems()
        setIsEditing(false)
        setCurrentItem({})
        setSelectedFile(null)
        setPreviewUrl("")
      }
    } catch (error) {
      console.error("Error saving career:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career opportunity?")) return

    try {
      const response = await fetch(`/api/careers/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error("Error deleting career:", error)
    }
  }

  const handleEdit = (item: Career) => {
    setCurrentItem(item)
    setPreviewUrl(item.image || "")
    setSelectedFile(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setCurrentItem({})
    setSelectedFile(null)
    setPreviewUrl("")
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h1 className={styles.title}>Careers Management</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.addBtn}>
            Add Career
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title *</label>
              <input
                type="text"
                value={currentItem.title || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Company *</label>
              <input
                type="text"
                value={currentItem.company || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, company: e.target.value })}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description *</label>
            <textarea
              value={currentItem.description || ""}
              onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
              required
              className={styles.textarea}
              rows={4}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Requirements</label>
            <textarea
              value={currentItem.requirements || ""}
              onChange={(e) => setCurrentItem({ ...currentItem, requirements: e.target.value })}
              className={styles.textarea}
              rows={3}
              placeholder="List the key requirements and qualifications..."
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <input
                type="text"
                value={currentItem.location || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, location: e.target.value })}
                className={styles.input}
                placeholder="e.g., Remote, Nairobi, Kenya"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Job Type</label>
              <select
                value={currentItem.type || "full-time"}
                onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value })}
                className={styles.input}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Salary Range</label>
              <input
                type="text"
                value={currentItem.salary || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, salary: e.target.value })}
                className={styles.input}
                placeholder="e.g., $50,000 - $70,000"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Commission (%)</label>
              <input
                type="number"
                value={currentItem.commission || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, commission: parseFloat(e.target.value) || undefined })}
                className={styles.input}
                placeholder="e.g., 10"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Commission Type</label>
              <select
                value={currentItem.commissionType || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, commissionType: e.target.value })}
                className={styles.input}
              >
                <option value="">Select type</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="tiered">Tiered</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Application Deadline</label>
              <input
                type="date"
                value={currentItem.applicationDeadline || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, applicationDeadline: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Application URL</label>
              <input
                type="url"
                value={currentItem.applicationUrl || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, applicationUrl: e.target.value })}
                className={styles.input}
                placeholder="https://..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Email</label>
              <input
                type="email"
                value={currentItem.contactEmail || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, contactEmail: e.target.value })}
                className={styles.input}
                placeholder="hr@company.com"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={currentItem.featured || false}
                onChange={(e) => setCurrentItem({ ...currentItem, featured: e.target.checked })}
              />
              Featured opportunity
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.input}
            />
            {previewUrl && (
              <div style={{ marginTop: '10px' }}>
                <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>
              {currentItem.id ? "Update" : "Create"}
            </button>
            <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.list}>
          {items.length === 0 ? (
            <p className={styles.empty}>No career opportunities yet. Click "Add Career" to create one.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    {item.title}
                    {item.featured && <span className={styles.featuredBadge}>Featured</span>}
                  </h3>
                  <p className={styles.cardExcerpt}>{item.company} • {item.location}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardCategory}>{item.type}</span>
                    {item.salary && <span className={styles.cardSalary}>{item.salary}</span>}
                    {item.commission && <span className={styles.cardCommission}>{item.commission}% Commission</span>}
                    <span className={styles.cardDate}>
                      {item.applicationDeadline
                        ? `Deadline: ${new Date(item.applicationDeadline).toLocaleDateString()}`
                        : `Posted: ${new Date(item.createdAt).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => handleEdit(item)} className={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
