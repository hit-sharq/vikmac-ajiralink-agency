"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import styles from "./job-request-manager.module.css"

interface JobRequest {
  id: string
  jobTitle: string
  category: string
  country: string
  quantity: number
  salaryMin: number
  salaryMax: number
  requirements: string
  status: string
  createdAt: string
}

export default function JobRequestManager() {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    jobTitle: "",
    category: "General Labor",
    country: "",
    quantity: 1,
    salaryMin: 0,
    salaryMax: 0,
    requirements: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("salary") || name === "quantity" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/job-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create job request")

      const newJob = await response.json()
      setJobRequests([newJob, ...jobRequests])
      setFormData({
        jobTitle: "",
        category: "General Labor",
        country: "",
        quantity: 1,
        salaryMin: 0,
        salaryMax: 0,
        requirements: "",
      })
      setShowForm(false)
      toast.success("Job request created successfully")
    } catch (error) {
      toast.error("Failed to create job request")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Job Request Management</h2>
        <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
          {showForm ? "Cancel" : "Add Job Request"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
              placeholder="e.g., House Maid, Construction Worker"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option>House Maid</option>
                <option>Construction Worker</option>
                <option>Nursing Assistant</option>
                <option>General Labor</option>
                <option>Chef</option>
                <option>Gardener</option>
                <option>Driver</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                placeholder="e.g., Saudi Arabia"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Salary Min (USD) *</label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Salary Max (USD) *</label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="Special skills or requirements..."
              rows={3}
            />
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? "Creating..." : "Create Job Request"}
          </button>
        </form>
      )}

      <div className={styles.listContainer}>
        {jobRequests.length === 0 ? (
          <p className={styles.emptyState}>No job requests yet. Click "Add Job Request" to create one.</p>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div>Job Title</div>
              <div>Country</div>
              <div>Category</div>
              <div>Quantity</div>
              <div>Salary Range</div>
              <div>Status</div>
            </div>
            {jobRequests.map((job) => (
              <div key={job.id} className={styles.tableRow}>
                <div>{job.jobTitle}</div>
                <div>{job.country}</div>
                <div>{job.category}</div>
                <div>{job.quantity}</div>
                <div>
                  ${job.salaryMin} - ${job.salaryMax}
                </div>
                <div>
                  <span className={styles.statusBadge}>{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
