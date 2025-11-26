"use client"

import { useState } from "react"
import styles from "./job-form.module.css"

interface JobRequestData {
  category: string
  country: string
  numberOfWorkers: number
  salaryMin: number
  salaryMax: number
  contractDuration: string
  jobDescription: string
  requiredExperience: number
  gender?: string
  ageMin?: number
  ageMax?: number
}

export default function JobRequestForm({ employerId, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<JobRequestData>({
    category: "nanny",
    country: "",
    numberOfWorkers: 1,
    salaryMin: 0,
    salaryMax: 0,
    contractDuration: "1 year",
    jobDescription: "",
    requiredExperience: 0,
  })

  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/job-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          employerId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create job request")
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formCard}>
      <h3>Submit Job Request</h3>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="nanny">Nanny</option>
              <option value="driver">Driver</option>
              <option value="cleaner">Cleaner</option>
              <option value="security">Security</option>
              <option value="cook">Cook</option>
              <option value="nurse">Nurse</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Country *</label>
            <input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Number of Workers *</label>
            <input
              type="number"
              name="numberOfWorkers"
              value={formData.numberOfWorkers}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Salary Min *</label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Salary Max *</label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Contract Duration *</label>
            <select name="contractDuration" value={formData.contractDuration} onChange={handleInputChange} required>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Required Experience (years) *</label>
            <input
              type="number"
              name="requiredExperience"
              value={formData.requiredExperience}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Preferred Gender</label>
            <select name="gender" value={formData.gender || ""} onChange={handleInputChange}>
              <option value="">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Job Description *</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleInputChange}
            rows={5}
            required
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "Submitting..." : "Submit Job Request"}
        </button>
      </form>
    </div>
  )
}
