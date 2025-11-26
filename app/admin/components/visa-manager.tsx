"use client"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface VisaRecord {
  id: string
  applicant: any
  visaStatus: string
  medicalStatus: string
  contractSigned: boolean
  trainingStatus: string
  flightBooked: boolean
  deploymentDate: string
}

export default function VisaManager() {
  const [visaRecords, setVisaRecords] = useState<VisaRecord[]>([])
  const [selectedVisa, setSelectedVisa] = useState<VisaRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    fetchVisaRecords()
  }, [])

  const fetchVisaRecords = async () => {
    try {
      const response = await fetch("/api/visa-processing")
      if (response.ok) {
        const data = await response.json()
        setVisaRecords(data)
      }
    } catch (error) {
      console.error("Failed to fetch visa records:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateVisaStatus = async (visaId: string, updates: any) => {
    setUpdateLoading(true)
    try {
      const response = await fetch(`/api/visa-processing/${visaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        alert("Visa status updated!")
        fetchVisaRecords()
        setSelectedVisa(null)
      }
    } catch (error) {
      console.error("Failed to update visa status:", error)
    } finally {
      setUpdateLoading(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading visa records...</div>
  }

  return (
    <div className={styles.manager}>
      <h2>Visa & Travel Processing</h2>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <h3>Pending Visas</h3>
          <div className={styles.list}>
            {visaRecords
              .filter((v) => v.visaStatus !== "stamped")
              .map((visa) => (
                <button
                  key={visa.id}
                  className={`${styles.listItem} ${selectedVisa?.id === visa.id ? styles.active : ""}`}
                  onClick={() => setSelectedVisa(visa)}
                >
                  <div className={styles.listItemTitle}>
                    {visa.applicant.firstName} {visa.applicant.lastName}
                  </div>
                  <div className={styles.listItemSubtitle}>{visa.visaStatus}</div>
                  <div className={styles.listItemMeta}>{visa.applicant.category}</div>
                </button>
              ))}
          </div>
        </div>

        <div className={styles.content}>
          {selectedVisa ? (
            <VisaUpdateForm visa={selectedVisa} onUpdate={updateVisaStatus} loading={updateLoading} />
          ) : (
            <div className={styles.empty}>Select a visa record to update</div>
          )}
        </div>
      </div>
    </div>
  )
}

function VisaUpdateForm({ visa, onUpdate, loading }: any) {
  const [formData, setFormData] = useState({
    visaStatus: visa.visaStatus,
    medicalStatus: visa.medicalStatus,
    contractSigned: visa.contractSigned,
    trainingStatus: visa.trainingStatus,
    flightBooked: visa.flightBooked,
    visaNumber: visa.visaNumber || "",
    flightDetails: visa.flightDetails || "",
    deploymentDate: visa.deploymentDate ? visa.deploymentDate.split("T")[0] : "",
    deploymentNotes: visa.deploymentNotes || "",
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onUpdate(visa.id, formData)
  }

  return (
    <div className={styles.updateForm}>
      <h3>Update Visa Processing</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Visa Status</label>
            <select name="visaStatus" value={formData.visaStatus} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="stamped">Stamped</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Medical Status</label>
            <select name="medicalStatus" value={formData.medicalStatus} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Training Status</label>
            <select name="trainingStatus" value={formData.trainingStatus} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>
              <input type="checkbox" name="contractSigned" checked={formData.contractSigned} onChange={handleChange} />
              Contract Signed
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>
              <input type="checkbox" name="flightBooked" checked={formData.flightBooked} onChange={handleChange} />
              Flight Booked
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>Visa Number</label>
            <input type="text" name="visaNumber" value={formData.visaNumber} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Flight Details</label>
          <textarea name="flightDetails" value={formData.flightDetails} onChange={handleChange} rows={3} />
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Deployment Date</label>
            <input type="date" name="deploymentDate" value={formData.deploymentDate} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Deployment Notes</label>
          <textarea name="deploymentNotes" value={formData.deploymentNotes} onChange={handleChange} rows={3} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Visa Status"}
        </button>
      </form>
    </div>
  )
}
