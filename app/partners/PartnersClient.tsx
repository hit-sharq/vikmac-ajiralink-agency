"use client"

import { useState, useEffect } from "react"
import styles from "./partners.module.css"

interface Partner {
  id: string
  name: string
  description?: string
  logoUrl?: string
  website?: string
  category: string
  featured: boolean
  order: number
}

export default function PartnersClient() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setError(null)
      const response = await fetch("/api/partners")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPartners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching partners:", error)
      setError("Unable to load partners. Please try again later.")
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.partnersGrid}>
        <div className={styles.loading}>Loading partners...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.partnersGrid}>
        <div style={{ textAlign: "center", padding: "40px", background: "#fff3cd", borderRadius: "12px" }}>
          <h2 style={{ color: "#856404", marginBottom: "16px" }}>⚠️ Error Loading Partners</h2>
          <p style={{ color: "#856404", marginBottom: "16px" }}>{error}</p>
          <button onClick={fetchPartners} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.partnersGrid}>
      {partners.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", color: "#666" }}>
          No partners yet. Check back soon!
        </p>
      ) : (
        partners.map((partner) => (
          <div key={partner.id} className={styles.partnerCard}>
            <div className={styles.partnerLogo}>
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={`${partner.name} logo`} />
              ) : (
                <div className={styles.placeholderLogo}>
                  <span>🤝</span>
                </div>
              )}
            </div>
            <div className={styles.partnerInfo}>
              <h3 className={styles.partnerName}>{partner.name}</h3>
              <p className={styles.partnerCategory}>{partner.category}</p>
              {partner.description && (
                <p className={styles.partnerDescription}>{partner.description}</p>
              )}
              {partner.website && (
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className={styles.partnerLink}>
                  Visit Website
                </a>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
