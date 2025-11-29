"use client"

import { useState, useEffect } from "react"
import styles from "./applicants-manager.module.css"

interface Applicant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  category: string
  status: string
  createdAt: string
}

export default function ApplicantsManager() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    try {
      const response = await fetch("/api/applicants")
      if (response.ok) {
        const data = await response.json()
        setApplicants(data)
      } else {
        setError("Failed to fetch applicants")
      }
    } catch (err) {
      setError("Error fetching applicants")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/applicants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        fetchApplicants()
      } else {
        setError("Failed to update status")
      }
    } catch (err) {
      setError("Error updating status")
    }
  }

  if (loading) return (
    <div className={styles.reportsContainer}>
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        Loading applicants...
      </div>
    </div>
  )

  if (error) return (
    <div className={styles.reportsContainer}>
      <div className={styles.error}>{error}</div>
    </div>
  )

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Applicants Management</h1>
        <button className={styles.refreshBtn} onClick={fetchApplicants}>
          Refresh
        </button>
      </div>

      <div className={styles.tablesSection}>
        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>All Applicants</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td>{applicant.firstName} {applicant.lastName}</td>
                    <td>{applicant.email}</td>
                    <td>{applicant.phone}</td>
                    <td>{applicant.category}</td>
                    <td>{applicant.status}</td>
                    <td>{new Date(applicant.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={applicant.status}
                        onChange={(e) => updateStatus(applicant.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="new">New</option>
                        <option value="pending">Pending</option>
                        <option value="ready">Ready</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="deployed">Deployed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
