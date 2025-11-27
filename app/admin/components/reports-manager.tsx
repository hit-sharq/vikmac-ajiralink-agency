"use client"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface ReportData {
  totalApplicants: number
  totalEmployers: number
  totalDeployed: number
  totalPayments: number
  applicantsByCategory: { category: string; count: number }[]
  applicantsByCountry: { country: string; count: number }[]
  paymentsByMonth: { month: string; amount: number }[]
}

export default function ReportsManager() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/stats")
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        setError("Failed to fetch reports")
      }
    } catch (err) {
      setError("Error fetching reports")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className={styles.loading}>Loading reports...</div>
  if (error) return <div className={styles.error}>{error}</div>
  if (!reportData) return <div className={styles.error}>No report data available</div>

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Reports & Analytics</h2>
        <button className={styles.refreshBtn} onClick={fetchReports}>
          Refresh
        </button>
      </div>

      <div className={styles.reportsGrid}>
        <div className={styles.reportCard}>
          <h3>Total Applicants</h3>
          <div className={styles.reportValue}>{reportData.totalApplicants}</div>
        </div>

        <div className={styles.reportCard}>
          <h3>Total Employers</h3>
          <div className={styles.reportValue}>{reportData.totalEmployers}</div>
        </div>

        <div className={styles.reportCard}>
          <h3>Total Deployed</h3>
          <div className={styles.reportValue}>{reportData.totalDeployed}</div>
        </div>

        <div className={styles.reportCard}>
          <h3>Total Payments</h3>
          <div className={styles.reportValue}>${(reportData.totalPayments || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className={styles.reportsSection}>
        <h3>Applicants by Category</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {reportData.applicantsByCategory?.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>{item.count || 0}</td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.reportsSection}>
        <h3>Applicants by Country</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Country</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {reportData.applicantsByCountry?.map((item) => (
                <tr key={item.country}>
                  <td>{item.country}</td>
                  <td>{item.count || 0}</td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.reportsSection}>
        <h3>Payments by Month</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {reportData.paymentsByMonth?.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>
                  <td>${(item.amount || 0).toLocaleString()}</td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
