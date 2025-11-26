"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  category: string
  tags: string[]
  createdAt: string
}

export default function BlogManager() {
  const [items, setItems] = useState<BlogPost[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<Partial<BlogPost>>({})
  const [tagsInput, setTagsInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
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
      if (!currentItem.category || currentItem.category.trim() === "") {
        alert("Category is required")
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

      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
      const url = currentItem.id ? `/api/blog/${currentItem.id}` : "/api/blog"
      const method = currentItem.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentItem, tags, image, category: currentItem.category }),
      })

      if (response.ok) {
        fetchItems()
        setIsEditing(false)
        setCurrentItem({})
        setTagsInput("")
        setSelectedFile(null)
        setPreviewUrl("")
      }
    } catch (error) {
      console.error("Error saving blog post:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/blog/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
    }
  }

  const handleEdit = (item: BlogPost) => {
    setCurrentItem(item)
    setTagsInput(item.tags?.join(", ") || "")
    setPreviewUrl(item.image || "")
    setSelectedFile(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setCurrentItem({})
    setTagsInput("")
    setSelectedFile(null)
    setPreviewUrl("")
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog Management</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.addBtn}>
            Add Blog Post
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
            <label className={styles.label}>Excerpt *</label>
            <textarea
              value={currentItem.excerpt || ""}
              onChange={(e) => setCurrentItem({ ...currentItem, excerpt: e.target.value })}
              required
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content *</label>
            <textarea
              value={currentItem.content || ""}
              onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
              required
              className={styles.textarea}
              rows={8}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Author *</label>
              <input
                type="text"
                value={currentItem.author || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, author: e.target.value })}
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
                className={styles.input}
              >
                <option value="">Select a category</option>
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
            <label className={styles.label}>Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={styles.input}
              placeholder="culture, community, events"
            />
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
            <p className={styles.empty}>No blog posts yet. Click "Add Blog Post" to create one.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardExcerpt}>{item.excerpt}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardCategory}>{item.category}</span>
                    {item.tags && item.tags.length > 0 && (
                      <div className={styles.tags}>
                        {item.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className={styles.cardAuthor}>By {item.author}</span>
                    <span className={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</span>
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
