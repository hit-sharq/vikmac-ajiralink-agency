"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"

interface JobRequest {
  id: string
  category: string
  country: string
  numberOfWorkers: number
  salaryMin: number
  salaryMax: number
  status: string
  createdAt: string
}

export function JobRequestsPage() {
  const [requests, setRequests] = useState<JobRequest[]>([
    {
      id: "1",
      category: "Nanny",
      country: "Saudi Arabia",
      numberOfWorkers: 5,
      salaryMin: 600,
      salaryMax: 800,
      status: "open",
      createdAt: "2024-11-20",
    },
    {
      id: "2",
      category: "Driver",
      country: "UAE",
      numberOfWorkers: 3,
      salaryMin: 800,
      salaryMax: 1000,
      status: "open",
      createdAt: "2024-11-18",
    },
  ])

  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Job Requests</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>New Job Request</span>
        </button>
      </div>

      {/* Job Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{request.category}</h3>
                <p className="text-gray-400 text-sm">{request.country}</p>
              </div>
              <span className="px-3 py-1 bg-green-900 text-green-300 rounded text-sm font-medium">
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Workers Needed:</span>
                <span className="text-white font-medium">{request.numberOfWorkers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Salary Range:</span>
                <span className="text-white font-medium">
                  ${request.salaryMin} - ${request.salaryMax}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Posted:</span>
                <span className="text-white font-medium">{request.createdAt}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-4 border-t border-gray-700">
              <button className="flex-1 p-2 hover:bg-gray-700 rounded transition-colors">
                <Edit2 size={18} className="mx-auto text-gray-400 hover:text-white" />
              </button>
              <button className="flex-1 p-2 hover:bg-gray-700 rounded transition-colors">
                <Trash2 size={18} className="mx-auto text-gray-400 hover:text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
