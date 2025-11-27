"use client"

import { useEffect, useState } from "react"
import styles from "./auto-applications.module.css"

interface AutoApplication {
  id: string
  matchScore: number
  status: string
  createdAt: string
  jobRequest: {
    id: string
    category: string
    country: string
    numberOfWorkers: number
    salaryMin: number
    salaryMax: number
    currency: string
    contractDuration: string
    jobDescription: string
    requiredExperience: number
    gender?: string
    ageMin?: number
    ageMax?: number
    employer: {
      companyName: string
      country: string
    }
  }
}

export default function AutoApplicationsPage() {
  const [applications, setApplications] = useState<AutoApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchAutoApplications()
  }, [])

  const fetchAutoApplications = async () => {
    try {
      // In a real app, you'd get the applicant ID from authentication
      // For now, we'll use a placeholder
      const applicantId = "placeholder-applicant-id"

      const response = await fetch(`/api/auto-applications?applicantId=${applicantId}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error("Failed to fetch auto-applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (applicationId: string) => {
    setProcessing(applicationId)
    try {
      const response = await fetch(`/api/auto-applications/${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit',
          notes: 'Auto-submitted application'
        })
      })

      if (response.ok) {
        // Remove from local state
        setApplications(applications.filter(app => app.id !== applicationId))
        alert('Application submitted successfully!')
      } else {
        alert('Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Error submitting application')
    } finally {
      setProcessing(null)
    }
  }

  const handleDecline = async (applicationId: string) => {
    if (!confirm('Are you sure you want to decline this application?')) return

    setProcessing(applicationId)
    try {
      const response = await fetch(`/api/auto-applications/${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'decline',
          notes: 'Application declined by applicant'
        })
      })

      if (response.ok) {
        // Remove from local state
        setApplications(applications.filter(app => app.id !== applicationId))
        alert('Application declined')
      } else {
        alert('Failed to decline application')
      }
    } catch (error) {
      console.error('Error declining application:', error)
      alert('Error declining application')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading your auto-applications...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Auto-Matched Applications</h1>
        <p className={styles.subtitle}>
          Review job opportunities that match your profile. You can submit or decline these applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className={styles.empty}>
          <h2>No pending applications</h2>
          <p>You don't have any auto-matched applications waiting for review.</p>
          <p>Update your profile to get more matches!</p>
        </div>
      ) : (
        <div className={styles.applicationsGrid}>
          {applications.map((application) => (
            <div key={application.id} className={styles.applicationCard}>
              <div className={styles.matchScore}>
                <span className={styles.scoreBadge}>
                  {application.matchScore}% Match
                </span>
              </div>

              <div className={styles.jobInfo}>
                <h3 className={styles.jobTitle}>
                  {application.jobRequest.category} Position
                </h3>
                <p className={styles.company}>
                  {application.jobRequest.employer.companyName} • {application.jobRequest.employer.country}
                </p>

                <div className={styles.jobDetails}>
                  <div className={styles.detail}>
                    <span className={styles.label}>Experience Required:</span>
                    <span>{application.jobRequest.requiredExperience} years</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Salary:</span>
                    <span>
                      {application.jobRequest.currency} {application.jobRequest.salaryMin.toLocaleString()} - {application.jobRequest.salaryMax.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Workers Needed:</span>
                    <span>{application.jobRequest.numberOfWorkers}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Contract:</span>
                    <span>{application.jobRequest.contractDuration}</span>
                  </div>
                  {application.jobRequest.gender && (
                    <div className={styles.detail}>
                      <span className={styles.label}>Gender:</span>
                      <span>{application.jobRequest.gender}</span>
                    </div>
                  )}
                  {application.jobRequest.ageMin && application.jobRequest.ageMax && (
                    <div className={styles.detail}>
                      <span className={styles.label}>Age Range:</span>
                      <span>{application.jobRequest.ageMin} - {application.jobRequest.ageMax} years</span>
                    </div>
                  )}
                </div>

                <div className={styles.description}>
                  <h4>Job Description</h4>
                  <p>{application.jobRequest.jobDescription}</p>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.submitBtn}
                  onClick={() => handleSubmit(application.id)}
                  disabled={processing === application.id}
                >
                  {processing === application.id ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  className={styles.declineBtn}
                  onClick={() => handleDecline(application.id)}
                  disabled={processing === application.id}
                >
                  Decline
                </button>
              </div>

              <div className={styles.meta}>
                <span className={styles.date}>
                  Matched on {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
