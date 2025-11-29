"use client"

import { useState, useEffect } from "react"
import styles from "./visa-processing-manager.module.css"

interface VisaProcessing {
  id: string
  applicant: {
    firstName: string
    lastName: string
    email: string
  }
  medicalStatus: string
  biometricsStatus?: string
  visaStatus: string
  visaNumber?: string
  visaExpiryDate?: string
  medicalReportUrl?: string
  contractSigned: boolean
  trainingStatus: string
  flightBooked: boolean
  flightDetails?: string
  deploymentDate?: string
  deploymentNotes?: string
  createdAt: string
}

export default function VisaProcessingManager() {
  const [visaProcesses, setVisaProcesses] = useState<VisaProcessing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchVisaProcesses()
  }, [])

  const fetchVisaProcesses = async () => {
    try {
      const response = await fetch("/api/visa-processing")
      if (response.ok) {
        const data = await response.json()
        setVisaProcesses(data)
      } else {
        setError("Failed to fetch visa processes")
      }
    } catch (err) {
      setError("Error fetching visa processes")
    } finally {
      setLoading(false)
    }
  }

  const updateMedicalStatus = async (id: string, medicalStatus: string) => {
    try {
      const response = await fetch(`/api/visa-processing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicalStatus }),
      })
      if (response.ok) {
        fetchVisaProcesses()
      } else {
        setError("Failed to update medical status")
      }
    } catch (err) {
      setError("Error updating medical status")
    }
  }

  const updateBiometricsStatus = async (id: string, biometricsStatus: string) => {
    try {
      const response = await fetch(`/api/visa-processing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biometricsStatus }),
      })
      if (response.ok) {
        fetchVisaProcesses()
      } else {
        setError("Failed to update biometrics status")
      }
    } catch (err) {
      setError("Error updating biometrics status")
    }
  }

  const updateVisaStatus = async (id: string, visaStatus: string) => {
    try {
      const response = await fetch(`/api/visa-processing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visaStatus }),
      })
      if (response.ok) {
        fetchVisaProcesses()
      } else {
        setError("Failed to update visa status")
      }
    } catch (err) {
      setError("Error updating visa status")
    }
  }

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.header}>
        <h2 className={styles.gradientTitle}>Visa Processing Management</h2>
        <button className={styles.refreshBtn} onClick={fetchVisaProcesses}>
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading visa processes...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.tablesSection}>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Medical Status</th>
                  <th>Biometrics Status</th>
                  <th>Visa Status</th>
                  <th>Visa Number</th>
                  <th>Visa Expiry</th>
                  <th>Contract Signed</th>
                  <th>Training Status</th>
                  <th>Flight Booked</th>
                  <th>Deployment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visaProcesses.map((process) => (
                  <tr key={process.id}>
                    <td>{process.applicant.firstName} {process.applicant.lastName}</td>
                    <td>{process.medicalStatus}</td>
                    <td>{process.biometricsStatus || "pending"}</td>
                    <td>{process.visaStatus}</td>
                    <td>{process.visaNumber || "N/A"}</td>
                    <td>{process.visaExpiryDate ? new Date(process.visaExpiryDate).toLocaleDateString() : "N/A"}</td>
                    <td>{process.contractSigned ? "Yes" : "No"}</td>
                    <td>{process.trainingStatus}</td>
                    <td>{process.flightBooked ? "Yes" : "No"}</td>
                    <td>{process.deploymentDate ? new Date(process.deploymentDate).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <div className={styles.actions}>
                        <select
                          value={process.medicalStatus}
                          onChange={(e) => updateMedicalStatus(process.id, e.target.value)}
                          className={styles.statusSelect}
                          style={{ marginRight: '8px' }}
                        >
                          <option value="pending">Medical Pending</option>
                          <option value="passed">Medical Passed</option>
                          <option value="failed">Medical Failed</option>
                        </select>
                        <select
                          value={process.biometricsStatus || "pending"}
                          onChange={(e) => updateBiometricsStatus(process.id, e.target.value)}
                          className={styles.statusSelect}
                          style={{ marginRight: '8px' }}
                          disabled={process.medicalStatus !== 'passed'}
                        >
                          <option value="pending">Biometrics Pending</option>
                          <option value="completed">Biometrics Completed</option>
                          <option value="failed">Biometrics Failed</option>
                        </select>
                        <select
                          value={process.visaStatus}
                          onChange={(e) => updateVisaStatus(process.id, e.target.value)}
                          className={styles.statusSelect}
                          disabled={process.medicalStatus !== 'passed' || process.biometricsStatus !== 'completed'}
                        >
                          <option value="pending">Visa Pending</option>
                          <option value="submitted">Visa Submitted</option>
                          <option value="approved">Visa Approved</option>
                          <option value="rejected">Visa Rejected</option>
                          <option value="stamped">Visa Stamped</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
