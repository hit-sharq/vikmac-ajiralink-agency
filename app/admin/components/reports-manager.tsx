"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import styles from "./reports-manager.module.css"

interface ReportData {
  totalApplicants: number
  totalEmployers: number
  totalDeployed: number
  totalPayments: number
  applicantsByCategory: { category: string; count: number }[]
  applicantsByCountry: { country: string; count: number }[]
  paymentsByMonth: { month: string; amount: number }[]
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
]

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

  if (loading)
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading reports...</p>
      </div>
    )

  if (error) return <div className={styles.error}>{error}</div>
  if (!reportData) return <div className={styles.error}>No report data available</div>

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reports & Analytics Dashboard</h1>
        <button className={styles.refreshBtn} onClick={fetchReports}>
          🔄 Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>👥</div>
          <div className={styles.kpiContent}>
            <h3>Total Applicants</h3>
            <p className={styles.kpiValue}>{(reportData.totalApplicants || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>🏢</div>
          <div className={styles.kpiContent}>
            <h3>Total Employers</h3>
            <p className={styles.kpiValue}>{(reportData.totalEmployers || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>🚀</div>
          <div className={styles.kpiContent}>
            <h3>Total Deployed</h3>
            <p className={styles.kpiValue}>{(reportData.totalDeployed || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>💰</div>
          <div className={styles.kpiContent}>
            <h3>Total Payments</h3>
            <p className={styles.kpiValue}>${(reportData.totalPayments || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Applicants by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.applicantsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Applicants by Country</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.applicantsByCountry}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {reportData.applicantsByCountry.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Payment Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData.paymentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="amount" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Monthly Payments</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.paymentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#ff7300" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section */}
      <div className={styles.tablesSection}>
        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>Applicants by Category</h2>
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

        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>Applicants by Country</h2>
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

        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>Payments by Month</h2>
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
    </div>
  )
}
