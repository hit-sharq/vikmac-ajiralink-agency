import React, { useState, useEffect } from 'react'

interface JobRequest {
  id: string
  category: string
  country: string
  numberOfWorkers: number
  salaryMin: number
  salaryMax: number
  currency: string
  contractDuration: string
  jobDescription: string
  requiredExperience: string
  status: string
  createdAt: string
}

const JobRequestsPage: React.FC = () => {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    const fetchJobRequests = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/job-requests')
        if (!response.ok) {
          throw new Error('Failed to fetch job requests')
        }
        const data = await response.json()
        setJobRequests(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job requests')
        console.error('Error fetching job requests:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobRequests()
  }, [])

  const filteredJobRequests = jobRequests.filter(request => {
    const matchesSearch = `${request.category} ${request.country} ${request.jobDescription}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'text-green-400'
      case 'closed': return 'text-red-400'
      case 'filled': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const uniqueCategories = Array.from(new Set(jobRequests.map(request => request.category)))

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Job Requests</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading job requests...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Job Requests</h1>
        <div className="bg-red-900 border border-red-700 p-4 rounded-lg">
          <p className="text-red-200">Error loading job requests: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Job Requests</h1>
        <div className="text-white">
          Total: {filteredJobRequests.length} requests
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by category, country, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobRequests.map((request) => (
          <div key={request.id} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">{request.category}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)} bg-gray-700`}>
                {request.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="font-medium">Country:</span> {request.country}</p>
              <p><span className="font-medium">Workers Needed:</span> {request.numberOfWorkers}</p>
              <p><span className="font-medium">Salary:</span> ${request.salaryMin.toLocaleString()} - ${request.salaryMax.toLocaleString()} {request.currency}</p>
              <p><span className="font-medium">Duration:</span> {request.contractDuration}</p>
              <p><span className="font-medium">Experience:</span> {request.requiredExperience}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 line-clamp-2">{request.jobDescription}</p>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Posted: {new Date(request.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredJobRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No job requests found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default JobRequestsPage
