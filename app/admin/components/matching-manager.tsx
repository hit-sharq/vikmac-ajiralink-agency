"use client"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface Match {
  id: string
  jobRequestId: string
  applicantId: string
  jobRequest: {
    category: string
    country: string
    employer: {
      companyName: string
    }
  }
  applicant: {
    firstName: string
    lastName: string
    email: string
    category: string
    status: string
  }
  status: string
  createdAt: string
}

export default function MatchingManager() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/matching")
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
      } else {
        setError("Failed to fetch matches")
      }
    } catch (err) {
      setError("Error fetching matches")
    } finally {
      setLoading(false)
    }
  }

  const updateMatchStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/matching/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        fetchMatches()
      } else {
        setError("Failed to update match status")
      }
    } catch (err) {
      setError("Error updating match status")
    }
  }

  if (loading) return <div className={styles.loading}>Loading matches...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Matching Management</h2>
        <button className={styles.refreshBtn} onClick={fetchMatches}>
          Refresh
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Category</th>
              <th>Employer</th>
              <th>Job Category</th>
              <th>Country</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{match.applicant.firstName} {match.applicant.lastName}</td>
                <td>{match.applicant.category}</td>
                <td>{match.jobRequest.employer.companyName}</td>
                <td>{match.jobRequest.category}</td>
                <td>{match.jobRequest.country}</td>
                <td>{match.status}</td>
                <td>{new Date(match.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={match.status}
                    onChange={(e) => updateMatchStatus(match.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="selected">Selected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
