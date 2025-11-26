"use client"

import { useEffect, useState } from "react"
import { Users, FileText, CheckSquare, Plane, CreditCard, TrendingUp } from "lucide-react"

interface Stats {
  totalApplicants: number
  activeJobRequests: number
  shortlistedCandidates: number
  visaInProgress: number
  totalPayments: number
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalApplicants: 0,
    activeJobRequests: 0,
    shortlistedCandidates: 0,
    visaInProgress: 0,
    totalPayments: 0,
  })

  useEffect(() => {
    // Fetch dashboard stats from database
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Replace with actual API call to fetch stats
      setStats({
        totalApplicants: 145,
        activeJobRequests: 12,
        shortlistedCandidates: 28,
        visaInProgress: 8,
        totalPayments: 45000,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const statCards = [
    { label: "Total Applicants", value: stats.totalApplicants, icon: Users, color: "blue" },
    { label: "Active Job Requests", value: stats.activeJobRequests, icon: FileText, color: "green" },
    { label: "Shortlisted", value: stats.shortlistedCandidates, icon: CheckSquare, color: "purple" },
    { label: "Visa In Progress", value: stats.visaInProgress, icon: Plane, color: "orange" },
    { label: "Total Payments (USD)", value: `$${stats.totalPayments}`, icon: CreditCard, color: "red" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{card.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
                </div>
                <Icon className="text-gray-600" size={32} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Applications</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-700 rounded flex items-center justify-between">
              <div>
                <p className="text-white font-medium">John Kipchoge</p>
                <p className="text-gray-400 text-sm">Domestic Worker - Applied 2 days ago</p>
              </div>
              <span className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded text-sm">Pending</span>
            </div>
            <div className="p-3 bg-gray-700 rounded flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Jane Wanjiru</p>
                <p className="text-gray-400 text-sm">Nanny - Applied 1 day ago</p>
              </div>
              <span className="px-3 py-1 bg-green-900 text-green-300 rounded text-sm">Shortlisted</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Upcoming Deployments</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-700 rounded flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Michael Omondi</p>
                <p className="text-gray-400 text-sm">Deployment: Jan 15, 2025</p>
              </div>
              <TrendingUp className="text-blue-400" size={20} />
            </div>
            <div className="p-3 bg-gray-700 rounded flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Sarah Kimani</p>
                <p className="text-gray-400 text-sm">Deployment: Jan 22, 2025</p>
              </div>
              <TrendingUp className="text-blue-400" size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
