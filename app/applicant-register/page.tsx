"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import styles from "./register.module.css"
import ApplicantForm from "./components/applicant-form"
import RegistrationSteps from "./components/registration-steps"

export default function ApplicantRegisterPage() {
  const { user, isSignedIn } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const [applicantData, setApplicantData] = useState(null)

  return (
    <div className={styles.registerPage}>
      <section className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Join Our Global Workforce</h1>
          <p className={styles.subtitle}>Register as an applicant and explore exciting opportunities worldwide</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <RegistrationSteps currentStep={currentStep} />
            <ApplicantForm currentStep={currentStep} setCurrentStep={setCurrentStep} onDataUpdate={setApplicantData} />
          </div>
        </div>
      </section>
    </div>
  )
}
