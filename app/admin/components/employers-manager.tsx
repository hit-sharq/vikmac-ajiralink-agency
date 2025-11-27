"use client"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface Employer {
  id: string
  companyName: string
  email: string
  contactPerson: string
  phone: string
  country: string
  status: string
  createdAt: string
}

export default function EmployersManager() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEmployers()
  }, [])

  const fetchEmployers = async () => {
    try {
      const response = await fetch("/api/employers")
      if (response.ok) {
        const data = await response.json()
        setEmployers(data)
      } else {
        setError("Failed to fetch employers")
      }
    } catch (err) {
      setError("Error fetching employers")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className={styles.loading}>Loading employers...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Employers Management</h2>
        <button className={styles.refreshBtn} onClick={fetchEmployers}>
          Refresh
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employers.map((employer) => (
              <tr key={employer.id}>
                <td>{employer.companyName}</td>
                <td>{employer.contactPerson}</td>
                <td>{employer.email}</td>
                <td>{employer.phone}</td>
                <td>{employer.country}</td>
                <td>{employer.status}</td>
                <td>{new Date(employer.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className={styles.viewBtn}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
