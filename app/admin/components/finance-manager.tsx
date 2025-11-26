"use client"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface Payment {
  id: string
  applicantId: string
  applicant: {
    firstName: string
    lastName: string
    email: string
    category: string
  }
  type: string
  amount: number
  currency: string
  status: string
  description: string
  paymentDate: string
  createdAt: string
}

export default function FinanceManager() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [summary, setSummary] = useState({
    totalCollected: 0,
    totalPending: 0,
    totalFailed: 0,
  })

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [payments, filterStatus, filterType])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
        calculateSummary(data)
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateSummary = (paymentsList: Payment[]) => {
    let totalCollected = 0
    let totalPending = 0
    let totalFailed = 0

    paymentsList.forEach((payment) => {
      if (payment.status === "completed") {
        totalCollected += payment.amount
      } else if (payment.status === "pending") {
        totalPending += payment.amount
      } else if (payment.status === "failed") {
        totalFailed += payment.amount
      }
    })

    setSummary({ totalCollected, totalPending, totalFailed })
  }

  const applyFilters = () => {
    let filtered = payments

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus)
    }

    if (filterType !== "all") {
      filtered = filtered.filter((p) => p.type === filterType)
    }

    setFilteredPayments(filtered)
  }

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchPayments()
      }
    } catch (error) {
      console.error("Failed to update payment:", error)
    }
  }

  const generateReceipt = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/receipt`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `receipt-${paymentId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Failed to generate receipt:", error)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading payments...</div>
  }

  return (
    <div className={styles.manager}>
      <h2>Finance & Payment Tracking</h2>

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <h4>Total Collected</h4>
          <p className={styles.amount}>${summary.totalCollected.toFixed(2)}</p>
        </div>
        <div className={styles.summaryCard}>
          <h4>Pending Payments</h4>
          <p className={styles.amount} style={{ color: "#f59e0b" }}>
            ${summary.totalPending.toFixed(2)}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <h4>Failed Payments</h4>
          <p className={styles.amount} style={{ color: "#ef4444" }}>
            ${summary.totalFailed.toFixed(2)}
          </p>
        </div>
      </div>

      <div className={styles.filterSection}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={styles.filter}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={styles.filter}>
          <option value="all">All Types</option>
          <option value="processing-fee">Processing Fee</option>
          <option value="salary-advance">Salary Advance</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <div>
                    <strong>
                      {payment.applicant.firstName} {payment.applicant.lastName}
                    </strong>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>{payment.applicant.email}</div>
                  </div>
                </td>
                <td>{payment.type}</td>
                <td>
                  ${payment.amount.toFixed(2)} {payment.currency}
                </td>
                <td>
                  <select
                    value={payment.status}
                    onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}
                    className={styles.statusSelect}
                    style={{
                      backgroundColor:
                        payment.status === "completed"
                          ? "#d1fae5"
                          : payment.status === "pending"
                            ? "#fef3c7"
                            : "#fee2e2",
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
                <td>{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => generateReceipt(payment.id)} className={styles.actionBtn}>
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
