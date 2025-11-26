"use client"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface JobRequest {
  id: string
  category: string
  country: string
  numberOfWorkers: number
  salaryMin: number
  salaryMax: number
  requiredExperience: number
  gender?: string
}

interface Applicant {
  id: string
  firstName: string
  lastName: string
  email: string
  category: string
  yearsOfExperience: number
  nationality: string
  gender: string
  passportExpiryDate: string
  status: string
}

interface MatchedApplicant {
  applicant: Applicant
  matchScore: number
}

export default function MatchingManager() {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([])
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [matchedApplicants, setMatchedApplicants] = useState<MatchedApplicant[]>([])
  const [loading, setLoading] = useState(false)
  const [shortlistLoading, setShortlistLoading] = useState(false)

  useEffect(() => {
    fetchJobRequests()
  }, [])

  const fetchJobRequests = async () => {
    try {
      const response = await fetch("/api/job-requests")
      if (response.ok) {
        const data = await response.json()
        setJobRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch job requests:", error)
    }
  }

  const findMatches = async (jobId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/matching/find-matches?jobId=${jobId}`)
      if (response.ok) {
        const data = await response.json()
        setMatchedApplicants(data)
        setSelectedJob(jobId)
      }
    } catch (error) {
      console.error("Failed to find matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToShortlist = async (jobId: string, applicantId: string) => {
    setShortlistLoading(true)
    try {
      const response = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRequestId: jobId, applicantId }),
      })

      if (response.ok) {
        alert("Applicant added to shortlist!")
        // Refresh matches
        findMatches(jobId)
      }
    } catch (error) {
      console.error("Failed to add to shortlist:", error)
    } finally {
      setShortlistLoading(false)
    }
  }

  const selectedJobRequest = jobRequests.find((j) => j.id === selectedJob)

  return (
    <div className={styles.manager}>
      <h2>Matching & Shortlisting</h2>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <h3>Job Requests</h3>
          <div className={styles.list}>
            {jobRequests.map((job) => (
              <button
                key={job.id}
                className={`${styles.listItem} ${selectedJob === job.id ? styles.active : ""}`}
                onClick={() => findMatches(job.id)}
              >
                <div className={styles.listItemTitle}>{job.category}</div>
                <div className={styles.listItemSubtitle}>{job.country}</div>
                <div className={styles.listItemMeta}>{job.numberOfWorkers} needed</div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          {selectedJobRequest && (
            <>
              <div className={styles.jobDetails}>
                <h3>Job Details: {selectedJobRequest.category}</h3>
                <div className={styles.detailsGrid}>
                  <div>
                    <strong>Country:</strong> {selectedJobRequest.country}
                  </div>
                  <div>
                    <strong>Workers Needed:</strong> {selectedJobRequest.numberOfWorkers}
                  </div>
                  <div>
                    <strong>Salary:</strong> ${selectedJobRequest.salaryMin} - ${selectedJobRequest.salaryMax}
                  </div>
                  <div>
                    <strong>Experience Required:</strong> {selectedJobRequest.requiredExperience} years
                  </div>
                </div>
              </div>

              <div className={styles.matchesSection}>
                <h3>Matched Applicants ({matchedApplicants.length})</h3>
                {loading ? (
                  <div className={styles.loading}>Finding matches...</div>
                ) : matchedApplicants.length > 0 ? (
                  <div className={styles.matchesList}>
                    {matchedApplicants.map(({ applicant, matchScore }) => (
                      <div key={applicant.id} className={styles.matchCard}>
                        <div className={styles.matchHeader}>
                          <h4>
                            {applicant.firstName} {applicant.lastName}
                          </h4>
                          <div className={styles.matchScore}>{Math.round(matchScore)}%</div>
                        </div>
                        <div className={styles.matchDetails}>
                          <p>
                            <strong>Category:</strong> {applicant.category}
                          </p>
                          <p>
                            <strong>Experience:</strong> {applicant.yearsOfExperience} years
                          </p>
                          <p>
                            <strong>Nationality:</strong> {applicant.nationality}
                          </p>
                          <p>
                            <strong>Gender:</strong> {applicant.gender}
                          </p>
                          <p>
                            <strong>Status:</strong> {applicant.status}
                          </p>
                          <p>
                            <strong>Email:</strong> {applicant.email}
                          </p>
                        </div>
                        <button
                          className={styles.actionBtn}
                          onClick={() => addToShortlist(selectedJob!, applicant.id)}
                          disabled={shortlistLoading}
                        >
                          Add to Shortlist
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.empty}>No matching applicants found</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
