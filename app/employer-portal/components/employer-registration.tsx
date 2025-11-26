"use client"

import { useState } from "react"
import styles from "./registration.module.css"

interface EmployerData {
  companyName: string
  email: string
  contactPerson: string
  phone: string
  country: string
  address: string
}

export default function EmployerRegistration({ onRegistrationSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<EmployerData>({
    companyName: "",
    email: "",
    contactPerson: "",
    phone: "",
    country: "",
    address: "",
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to register employer")
      }

      const result = await response.json()
      onRegistrationSuccess(result.id)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.registrationCard}>
      <h2>Register Your Company</h2>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Company Name *</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Contact Person *</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Country *</label>
            <input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
          </div>
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "Registering..." : "Register Company"}
        </button>
      </form>
    </div>
  )
}
