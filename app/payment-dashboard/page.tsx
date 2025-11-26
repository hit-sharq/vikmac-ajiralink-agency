"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import styles from "./dashboard.module.css"

interface Payment {
  id: string
  type: string
  amount: number
  currency: string
  status: string
  description: string
  paymentDate: string
  createdAt: string
}

export default function PaymentDashboardPage() {
  const { user, isSignedIn } = useUser()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [applicantEmail, setApplicantEmail] = useState("")
  const [totalDue, setTotalDue] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchApplicantPayments(user.primaryEmailAddress.emailAddress)
    }
  }, [user])

  const fetchApplicantPayments = async (email: string) => {
    try {
      const response = await fetch(`/api/applicant-payments?email=${email}`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
        calculateTotals(data)
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotals = (paymentsList: Payment[]) => {
    let due = 0
    let paid = 0

    paymentsList.forEach((payment) => {
      if (payment.status === "completed") {
        paid += payment.amount
      } else if (payment.status === "pending") {
        due += payment.amount
      }
    })

    setTotalDue(due)
    setTotalPaid(paid)
  }

  if (!isSignedIn) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.message}>Please sign in to view your payment history</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Payment Dashboard</h1>
          <p className={styles.subtitle}>Track your payments and invoices</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3>Amount Paid</h3>
              <p className={styles.amount}>${totalPaid.toFixed(2)}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Amount Due</h3>
              <p className={styles.amount} style={{ color: "#f59e0b" }}>
                ${totalDue.toFixed(2)}
              </p>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading payments...</div>
          ) : payments.length > 0 ? (
            <div className={styles.paymentsTable}>
              <h2>Payment History</h2>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.type}</td>
                      <td>
                        ${payment.amount.toFixed(2)} {payment.currency}
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[payment.status]}`}>{payment.status}</span>
                      </td>
                      <td>{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.empty}>No payments found</div>
          )}
        </div>
      </section>
    </div>
  )
}
