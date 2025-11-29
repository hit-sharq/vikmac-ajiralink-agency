"use client"

import { useState, useEffect } from "react"
import styles from "./payments-manager.module.css"

interface Payment {
  id: string
  applicant: {
    firstName: string
    lastName: string
    email: string
  }
  employer?: {
    companyName: string
  }
  type: string
  amount: number
  currency: string
  status: string
  description?: string
  paymentDate?: string
  createdAt: string
}

export default function PaymentsManager() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      } else {
        setError("Failed to fetch payments")
      }
    } catch (err) {
      setError("Error fetching payments")
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        fetchPayments()
      } else {
        setError("Failed to update payment status")
      }
    } catch (err) {
      setError("Error updating payment status")
    }
  }

  const initiatePesapalPayment = async (paymentId: string) => {
    try {
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to Pesapal payment page
        window.open(data.redirect_url, '_blank')
      } else {
        setError("Failed to initiate Pesapal payment")
      }
    } catch (err) {
      setError("Error initiating Pesapal payment")
    }
  }

  if (loading) return <div className={styles.loading}>Loading payments...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Payments Management</h2>
        <button className={styles.refreshBtn} onClick={fetchPayments}>
          Refresh
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Employer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Description</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.applicant.firstName} {payment.applicant.lastName}</td>
                <td>{payment.employer?.companyName || "N/A"}</td>
                <td>{payment.type}</td>
                <td>{payment.amount}</td>
                <td>{payment.currency}</td>
                <td>{payment.status}</td>
                <td>{payment.description || "N/A"}</td>
                <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "N/A"}</td>
                <td className={styles.actionCell}>
                  <select
                    value={payment.status}
                    onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  {payment.status === 'pending' && (
                    <button
                      className={styles.payBtn}
                      onClick={() => initiatePesapalPayment(payment.id)}
                    >
                      Pay with Pesapal
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
