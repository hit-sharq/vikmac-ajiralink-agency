"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import styles from "./employer.module.css"
import EmployerRegistration from "./components/employer-registration"
import EmployerDashboard from "./components/employer-dashboard"

export default function EmployerPortalPage() {
  const { user, isSignedIn } = useUser()
  const [isRegistered, setIsRegistered] = useState(false)
  const [employerId, setEmployerId] = useState("")

  if (!isSignedIn) {
    return (
      <div className={styles.employerPage}>
        <section className={styles.header}>
          <div className={styles.container}>
            <h1 className={styles.title}>Employer Portal</h1>
            <p className={styles.subtitle}>Find skilled workers for your staffing needs</p>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.container}>
            <div className={styles.message}>
              <p>Please sign in to access the employer portal</p>
              <Link href="/" className={styles.homeLink}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={styles.employerPage}>
      <section className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Employer Portal</h1>
          <p className={styles.subtitle}>Submit job requests and find the right candidates</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          {isRegistered ? (
            <EmployerDashboard employerId={employerId} />
          ) : (
            <EmployerRegistration
              onRegistrationSuccess={(id) => {
                setEmployerId(id)
                setIsRegistered(true)
              }}
            />
          )}
        </div>
      </section>
    </div>
  )
}
