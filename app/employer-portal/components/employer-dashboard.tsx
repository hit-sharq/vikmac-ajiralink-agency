"use client"

import { useState, useEffect } from "react"
import styles from "./dashboard.module.css"
import JobRequestForm from "./job-request-form"

export default function EmployerDashboard({ employerId }: { employerId: string }) {
  const [showForm, setShowForm] = useState(false)
  const [jobRequests, setJobRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobRequests()
  }, [employerId])

  const fetchJobRequests = async () => {
    try {
      const response = await fetch(`/api/employers/${employerId}/job-requests`)
      if (response.ok) {
        const data = await response.json()
        setJobRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch job requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJobRequestCreated = () => {
    setShowForm(false)
    fetchJobRequests()
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h2>Your Job Requests</h2>
        <button onClick={() => setShowForm(!showForm)} className={styles.createBtn}>
          {showForm ? "Cancel" : "+ New Job Request"}
        </button>
      </div>

      {showForm && <JobRequestForm employerId={employerId} onSuccess={handleJobRequestCreated} />}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : jobRequests.length > 0 ? (
        <div className={styles.requestsGrid}>
          {(jobRequests as any[]).map((request) => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.cardHeader}>
                <h3>{request.category}</h3>
                <span className={styles.statusBadge}>{request.status}</span>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <strong>Country:</strong> {request.country}
                </p>
                <p>
                  <strong>Workers Needed:</strong> {request.numberOfWorkers}
                </p>
                <p>
                  <strong>Salary Range:</strong> {request.currency} {request.salaryMin} - {request.salaryMax}
                </p>
                <p>
                  <strong>Duration:</strong> {request.contractDuration}
                </p>
                <p>
                  <strong>Required Experience:</strong> {request.requiredExperience} years
                </p>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.viewBtn}>View Shortlists</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No job requests yet. Create one to get started!</p>
        </div>
      )}
    </div>
  )
}
