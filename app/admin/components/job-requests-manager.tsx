"use client"

import { useState, useEffect } from "react"
import styles from "./job-request-manager.module.css"

interface JobRequest {
  id: string
  employer: {
    companyName: string
    email: string
  }
  category: string
  country: string
  numberOfWorkers: number
  salaryMin: number
  salaryMax: number
  currency: string
  contractDuration: string
  jobDescription: string
  status: string
  createdAt: string
}

export default function JobRequestsManager() {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchJobRequests()
  }, [])

  const fetchJobRequests = async () => {
    try {
      const response = await fetch("/api/job-requests")
      if (response.ok) {
        const data = await response.json()
        setJobRequests(data)
      } else {
        setError("Failed to fetch job requests")
      }
    } catch (err) {
      setError("Error fetching job requests")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/job-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        fetchJobRequests()
      } else {
        setError("Failed to update status")
      }
    } catch (err) {
      setError("Error updating status")
    }
  }

  if (loading) return <div className={styles.loading}>Loading job requests...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Job Requests Management</h2>
        <button className={styles.refreshBtn} onClick={fetchJobRequests}>
          Refresh
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employer</th>
              <th>Category</th>
              <th>Country</th>
              <th>Workers Needed</th>
              <th>Salary Range</th>
              <th>Contract Duration</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.employer.companyName}</td>
                <td>{request.category}</td>
                <td>{request.country}</td>
                <td>{request.numberOfWorkers}</td>
                <td>{request.currency} {request.salaryMin} - {request.salaryMax}</td>
                <td>{request.contractDuration}</td>
                <td>{request.status}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={request.status}
                    onChange={(e) => updateStatus(request.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="open">Open</option>
                    <option value="shortlisting">Shortlisting</option>
                    <option value="completed">Completed</option>
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
