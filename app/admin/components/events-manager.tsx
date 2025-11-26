"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  category: string
  registrationLink?: string
  isStaple?: boolean
}

export default function EventsManager() {
  const [items, setItems] = useState<Event[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<Partial<Event>>({})
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching events:", error)
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

      const url = currentItem.id ? `/api/events/${currentItem.id}` : "/api/events"
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
      console.error("Error saving event:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const handleEdit = (item: Event) => {
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
        <h1 className={styles.title}>Events Management</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.addBtn}>
            Add Event
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
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
            <label className={styles.label}>Description *</label>
            <textarea
              value={currentItem.description || ""}
              onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
              required
              className={styles.textarea}
              rows={4}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date *</label>
              <input
                type="date"
                value={currentItem.date || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Time *</label>
              <input
                type="time"
                value={currentItem.time || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, time: e.target.value })}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Location *</label>
              <input
                type="text"
                value={currentItem.location || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, location: e.target.value })}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category *</label>
              <select
                value={currentItem.category || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                required
                className={styles.select}
              >
                <option value="">Select category</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>
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

          <div className={styles.formGroup}>
            <label className={styles.label}>Registration Link</label>
            <input
              type="url"
              value={currentItem.registrationLink || ""}
              onChange={(e) => setCurrentItem({ ...currentItem, registrationLink: e.target.value })}
              className={styles.input}
              placeholder="https://example.com/register"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={currentItem.isStaple || false}
                onChange={(e) => setCurrentItem({ ...currentItem, isStaple: e.target.checked })}
                className={styles.checkbox}
              />
              Mark as Staple Event (permanent/ongoing)
            </label>
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
            <p className={styles.empty}>No events yet. Click "Add Event" to create one.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardExcerpt}>{item.description}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardCategory}>{item.category}</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>{item.time}</span>
                    <span>{item.location}</span>
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
