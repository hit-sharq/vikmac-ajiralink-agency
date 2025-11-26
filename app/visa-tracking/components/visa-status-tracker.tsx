"use client"

import { useEffect, useState } from "react"
import styles from "./tracker.module.css"

export default function VisaStatusTracker({ applicant }: any) {
  const [visaData, setVisaData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        const response = await fetch(`/api/visa-processing/${applicant.id}`)
        if (response.ok) {
          const data = await response.json()
          setVisaData(data)
        }
      } catch (error) {
        console.error("Failed to fetch visa data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVisaData()
  }, [applicant.id])

  if (loading) {
    return <div className={styles.loading}>Loading visa status...</div>
  }

  if (!visaData) {
    return <div className={styles.empty}>No visa processing data found</div>
  }

  const visa = visaData as any

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#fbbf24"
      case "submitted":
        return "#3b82f6"
      case "approved":
        return "#10b981"
      case "rejected":
        return "#ef4444"
      case "stamped":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className={styles.tracker}>
      <div className={styles.header}>
        <h2>
          {applicant.firstName} {applicant.lastName}
        </h2>
        <div className={styles.mainStatus}>
          <span className={styles.statusLabel}>Visa Status:</span>
          <span className={styles.statusBadge} style={{ backgroundColor: getStatusColor(visa.visaStatus) }}>
            {visa.visaStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className={styles.timeline}>
        <div className={styles.stage}>
          <div
            className={`${styles.stageCircle} ${visa.visaStatus === "pending" ? styles.active : ""} ${visa.visaStatus !== "pending" ? styles.completed : ""}`}
          >
            1
          </div>
          <div className={styles.stageContent}>
            <h3>Application Submitted</h3>
            <p>Your visa application will be submitted for processing</p>
          </div>
        </div>

        <div className={styles.stage}>
          <div
            className={`${styles.stageCircle} ${["submitted", "approved", "stamped"].includes(visa.visaStatus) ? styles.active : ""} ${["approved", "stamped"].includes(visa.visaStatus) ? styles.completed : ""}`}
          >
            2
          </div>
          <div className={styles.stageContent}>
            <h3>Medical Processing</h3>
            <p>
              Medical examination status: <strong>{visa.medicalStatus}</strong>
            </p>
            {visa.medicalReportUrl && (
              <a href={visa.medicalReportUrl} target="_blank" rel="noopener noreferrer">
                View Medical Report
              </a>
            )}
          </div>
        </div>

        <div className={styles.stage}>
          <div className={`${styles.stageCircle} ${visa.contractSigned ? styles.completed : ""}`}>3</div>
          <div className={styles.stageContent}>
            <h3>Contract Signing</h3>
            <p>
              Status: <strong>{visa.contractSigned ? "Signed" : "Pending"}</strong>
            </p>
          </div>
        </div>

        <div className={styles.stage}>
          <div className={`${styles.stageCircle} ${visa.trainingStatus === "completed" ? styles.completed : ""}`}>
            4
          </div>
          <div className={styles.stageContent}>
            <h3>Training</h3>
            <p>
              Training status: <strong>{visa.trainingStatus}</strong>
            </p>
          </div>
        </div>

        <div className={styles.stage}>
          <div className={`${styles.stageCircle} ${visa.flightBooked ? styles.completed : ""}`}>5</div>
          <div className={styles.stageContent}>
            <h3>Flight Booking</h3>
            <p>
              Status: <strong>{visa.flightBooked ? "Booked" : "Pending"}</strong>
            </p>
            {visa.flightDetails && <p className={styles.details}>{visa.flightDetails}</p>}
          </div>
        </div>

        <div className={styles.stage}>
          <div className={`${styles.stageCircle} ${visa.visaStatus === "stamped" ? styles.completed : ""}`}>6</div>
          <div className={styles.stageContent}>
            <h3>Deployment</h3>
            {visa.deploymentDate && (
              <p>
                Scheduled for: <strong>{new Date(visa.deploymentDate).toLocaleDateString()}</strong>
              </p>
            )}
            {visa.deploymentNotes && <p className={styles.details}>{visa.deploymentNotes}</p>}
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <h3>Important Dates</h3>
        <div className={styles.detailsGrid}>
          {visa.visaExpiryDate && (
            <div>
              <strong>Visa Expiry:</strong>
              <p>{new Date(visa.visaExpiryDate).toLocaleDateString()}</p>
            </div>
          )}
          {visa.deploymentDate && (
            <div>
              <strong>Deployment Date:</strong>
              <p>{new Date(visa.deploymentDate).toLocaleDateString()}</p>
            </div>
          )}
          <div>
            <strong>Passport Expiry:</strong>
            <p>{new Date(applicant.passportExpiryDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
