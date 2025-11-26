"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import styles from "./manager.module.css"

interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "website",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
  })
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
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
      let image = formData.image

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

      const technologiesArray = formData.technologies
        .split(",")
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0)

      const projectData = {
        ...formData,
        image,
        technologies: technologiesArray,
      }

      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects"
      const method = editingProject ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        await fetchProjects()
        resetForm()
        setShowForm(false)
      } else {
        console.error("Failed to save project")
      }
    } catch (error) {
      console.error("Error saving project:", error)
    } finally {
      // Ensure loading state is reset
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProjects()
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      technologies: project.technologies.join(", "),
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      featured: project.featured,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      category: "website",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
    })
    setEditingProject(null)
    setSelectedFile(null)
    setPreviewUrl("")
  }

  const categories = ["website", "web-app", "mobile-app", "e-commerce", "api", "other"]

  if (loading) {
    return <div className={styles.loading}>Loading projects...</div>
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects Management</h1>
        {!showForm && (
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className={styles.addBtn}
          >
            Add Project
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h1 className={styles.modalTitle}>{editingProject ? "Edit Project" : "Add New Project"}</h1>
              <button
                className={styles.modalClose}
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className={styles.textarea}
                  rows={4}
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

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className={styles.select}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Technologies (comma-separated) *</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Live URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className={styles.checkbox}
                  />
                  Featured Project
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>
                  {editingProject ? "Update Project" : "Add Project"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.gridList}>
        {projects.length === 0 ? (
          <p className={styles.empty}>No projects yet. Click "Add Project" to create one.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className={styles.gridCard}>
              <div className={styles.gridImageWrapper}>
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className={styles.gridImage}
                />
                <span className={styles.gridCategory}>
                  {project.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className={styles.gridContent}>
                <h3 className={styles.gridTitle}>
                  {project.title}
                  {project.featured && <span className={styles.featuredBadge}>Featured</span>}
                </h3>
                <p className={styles.gridExcerpt}>
                  {project.description.length > 100
                    ? `${project.description.substring(0, 100)}...`
                    : project.description}
                </p>
                <div className={styles.gridMeta}>
                  <span className={styles.gridDate}>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.technologies}>
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className={styles.tag}>
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className={styles.tag}>+{project.technologies.length - 3}</span>
                  )}
                </div>
                <button
                  className={styles.readMoreBtn}
                  onClick={() => setSelectedProject(project)}
                >
                  Read More →
                </button>
                <div className={styles.gridActions}>
                  <button onClick={() => handleEdit(project)} className={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(project.id)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedProject && (
        <div className={styles.detailCard}>
          <button className={styles.detailClose} onClick={() => setSelectedProject(null)}>×</button>
          <div className={styles.detailImageWrapper}>
            <Image
              src={selectedProject.image || "/placeholder.svg"}
              alt={selectedProject.title}
              fill
              className={styles.detailImage}
            />
          </div>
          <div className={styles.detailBody}>
            <h3 className={styles.detailTitle}>{selectedProject.title}</h3>
            <p className={styles.detailDescription}>{selectedProject.description}</p>
            <div className={styles.detailDetails}>
              <div className={styles.detailDetail}>
                <span className={styles.detailIcon}>🏷️</span>
                <span>{selectedProject.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
              <div className={styles.detailDetail}>
                <span className={styles.detailIcon}>📅</span>
                <span>{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
              </div>
              {selectedProject.liveUrl && (
                <div className={styles.detailDetail}>
                  <span className={styles.detailIcon}>🌐</span>
                  <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>
                </div>
              )}
              {selectedProject.githubUrl && (
                <div className={styles.detailDetail}>
                  <span className={styles.detailIcon}>💻</span>
                  <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
              )}
            </div>
            <div className={styles.detailTech}>
              <h4>Technologies:</h4>
              <div className={styles.detailTechTags}>
                {selectedProject.technologies.map((tech) => (
                  <span key={tech} className={styles.detailTechTag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.detailActions}>
              <button onClick={() => handleEdit(selectedProject)} className={styles.detailEditBtn}>
                Edit Project
              </button>
              <button onClick={() => handleDelete(selectedProject.id)} className={styles.detailDeleteBtn}>
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 && (
        <div className={styles.empty}>
          <p>No projects yet. Click "Add Project" to create one.</p>
        </div>
      )}
    </div>
  )
}
