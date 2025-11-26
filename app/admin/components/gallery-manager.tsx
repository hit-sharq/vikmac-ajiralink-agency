"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface GalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  createdAt: string
}

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({})
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching gallery:", error)
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
      let imageUrl = currentItem.imageUrl

      if (selectedFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', selectedFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        } else {
          console.error('Image upload failed')
          return
        }
      }

      const url = currentItem.id ? `/api/gallery/${currentItem.id}` : "/api/gallery"
      const method = currentItem.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentItem, imageUrl }),
      })

      if (response.ok) {
        fetchItems()
        setIsEditing(false)
        setCurrentItem({})
        setSelectedFile(null)
        setPreviewUrl("")
      }
    } catch (error) {
      console.error("Error saving gallery item:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return

    try {
      const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setCurrentItem(item)
    setPreviewUrl(item.imageUrl || "")
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
        <h1 className={styles.title}>Gallery Management</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.addBtn}>
            Add Image
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
              rows={3}
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

          <div className={styles.formGroup}>
            <label className={styles.label}>Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
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
        <div className={styles.gridList}>
          {items.length === 0 ? (
            <p className={styles.empty}>No gallery items yet. Click "Add Image" to create one.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.gridCard}>
                <div className={styles.gridImage} style={{ backgroundImage: `url(${item.imageUrl})` }} />
                <div className={styles.gridContent}>
                  <h3 className={styles.gridTitle}>{item.title}</h3>
                  <span className={styles.gridCategory}>{item.category}</span>
                </div>
                <div className={styles.gridActions}>
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
