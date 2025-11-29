import React, { useState, useEffect } from 'react'

interface StatsData {
  totalApplicants: number
  totalEmployers: number
  totalDeployed: number
  totalPayments: number
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading dashboard data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
        <div className="bg-red-900 border border-red-700 p-4 rounded-lg">
          <p className="text-red-200">Error loading dashboard data: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Total Applicants</h3>
          <p className="text-3xl font-bold text-blue-400">{stats?.totalApplicants?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Total Employers</h3>
          <p className="text-3xl font-bold text-green-400">{stats?.totalEmployers?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Deployed Applicants</h3>
          <p className="text-3xl font-bold text-yellow-400">{stats?.totalDeployed?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-400">${stats?.totalPayments?.toLocaleString() || 0}</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
