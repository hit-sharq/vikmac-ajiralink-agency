"use client"

import { useState } from "react"
import styles from "./visa.module.css"
import VisaStatusTracker from "./components/visa-status-tracker"

export default function VisaTrackingPage() {
  const [applicantEmail, setApplicantEmail] = useState("")
  const [applicantData, setApplicantData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/applicants/by-email?email=${applicantEmail}`)
      if (response.ok) {
        const data = await response.json()
        setApplicantData(data)
      } else if (response.status === 404) {
        setError("Applicant not found")
      } else {
        throw new Error("Failed to fetch applicant")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Visa & Travel Tracking</h1>
          <p className={styles.subtitle}>Track your visa status and travel processing</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          {!applicantData ? (
            <div className={styles.searchCard}>
              <h2>Track Your Visa Status</h2>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </button>
              </form>
              {error && <div className={styles.error}>{error}</div>}
            </div>
          ) : (
            <div className={styles.trackingView}>
              <button
                className={styles.backBtn}
                onClick={() => {
                  setApplicantData(null)
                  setApplicantEmail("")
                }}
              >
                ← Back
              </button>
              <VisaStatusTracker applicant={applicantData} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
