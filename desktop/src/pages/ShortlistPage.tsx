import React, { useState, useEffect } from 'react'

interface ShortlistItem {
  id: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
  applicant: {
    id: string
    firstName: string
    lastName: string
    email: string
    nationality: string
    category: string
  }
  jobRequest: {
    id: string
    title: string
    company: string
    location: string
    category: string
  }
}

const ShortlistPage: React.FC = () => {
  const [shortlistItems, setShortlistItems] = useState<ShortlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchShortlist = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/shortlist')
        if (!response.ok) {
          throw new Error('Failed to fetch shortlist')
        }
        const data = await response.json()
        setShortlistItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load shortlist')
        console.error('Error fetching shortlist:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchShortlist()
  }, [])

  const filteredItems = shortlistItems.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesSearch = searchTerm === '' ||
      `${item.applicant.firstName} ${item.applicant.lastName} ${item.jobRequest.title} ${item.jobRequest.company}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-400'
      case 'approved': return 'text-green-400'
      case 'rejected': return 'text-red-400'
      case 'interviewed': return 'text-blue-400'
      case 'hired': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status)
    return `${colorClass} bg-gray-700 px-2 py-1 text-xs rounded-full`
  }

  const resetFilters = () => {
    setStatusFilter('all')
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Shortlist</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading shortlist...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Shortlist</h1>
        <div className="bg-red-900 border border-red-700 p-4 rounded-lg">
          <p className="text-red-200">Error loading shortlist: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Shortlist</h1>
        <div className="text-white">
          Total: {filteredItems.length} items
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="interviewed">Interviewed</option>
              <option value="hired">Hired</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Shortlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">
                {item.applicant.firstName} {item.applicant.lastName}
              </h3>
              <span className={getStatusBadge(item.status)}>
                {item.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <p><span className="font-medium">Email:</span> {item.applicant.email}</p>
              <p><span className="font-medium">Nationality:</span> {item.applicant.nationality}</p>
              <p><span className="font-medium">Category:</span> {item.applicant.category}</p>
            </div>

            <div className="bg-gray-700 p-3 rounded mb-4">
              <h4 className="font-medium text-white mb-2">Job Request</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <p><span className="font-medium">Title:</span> {item.jobRequest.title}</p>
                <p><span className="font-medium">Company:</span> {item.jobRequest.company}</p>
                <p><span className="font-medium">Location:</span> {item.jobRequest.location}</p>
                <p><span className="font-medium">Category:</span> {item.jobRequest.category}</p>
              </div>
            </div>

            {item.notes && (
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  <span className="font-medium">Notes:</span> {item.notes}
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-xs text-gray-500 space-y-1">
                <p>Created: {new Date(item.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(item.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No shortlist items found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default ShortlistPage
