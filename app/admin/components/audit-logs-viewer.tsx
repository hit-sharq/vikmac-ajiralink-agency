"use client"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface AuditLog {
  id: number
  user_id: string
  action: string
  details: any
  created_at: string
}

export default function AuditLogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/audit-logs?limit=100")
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      } else {
        setError("Failed to fetch audit logs")
      }
    } catch (err) {
      setError("Error fetching audit logs")
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = filter ? logs.filter((log) => log.action.includes(filter) || log.user_id.includes(filter)) : logs

  if (loading) return <div className={styles.loading}>Loading audit logs...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Audit Logs</h2>
        <input
          type="text"
          placeholder="Filter by action or user ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.refreshBtn} onClick={fetchLogs}>
          Refresh
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>User ID</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>
                  <span className={styles.actionBadge}>{log.action}</span>
                </td>
                <td>{log.user_id}</td>
                <td>
                  <pre className={styles.detailsCode}>{JSON.stringify(log.details, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
