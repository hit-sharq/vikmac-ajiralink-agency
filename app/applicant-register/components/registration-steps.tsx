import styles from "./steps.module.css"

export default function RegistrationSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Documents" },
    { number: 3, title: "Work History" },
    { number: 4, title: "Certifications" },
  ]

  return (
    <div className={styles.stepsContainer}>
      {steps.map((step, index) => (
        <div key={step.number} className={`${styles.step} ${index <= currentStep ? styles.active : ""}`}>
          <div className={styles.stepNumber}>{step.number}</div>
          <div className={styles.stepTitle}>{step.title}</div>
          {index < steps.length - 1 && (
            <div className={`${styles.connector} ${index < currentStep ? styles.completed : ""}`} />
          )}
        </div>
      ))}
    </div>
  )
}
