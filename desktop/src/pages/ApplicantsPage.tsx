import React, { useState, useEffect } from 'react'

interface Applicant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  category: string
  status: string
  experience: string
  education: string
  createdAt: string
  updatedAt: string
}

const ApplicantsPage: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/applicants')
        if (!response.ok) {
          throw new Error('Failed to fetch applicants')
        }
        const data = await response.json()
        setApplicants(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load applicants')
        console.error('Error fetching applicants:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [])

  const filteredApplicants = applicants.filter(applicant => {
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || applicant.category === categoryFilter
    const matchesSearch = searchTerm === '' ||
      `${applicant.firstName} ${applicant.lastName} ${applicant.email} ${applicant.nationality}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-400'
      case 'inactive': return 'text-red-400'
      case 'pending': return 'text-yellow-400'
      case 'approved': return 'text-blue-400'
      case 'rejected': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'skilled': return 'text-purple-400'
      case 'semi-skilled': return 'text-orange-400'
      case 'unskilled': return 'text-pink-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status)
    return `${colorClass} bg-gray-700 px-2 py-1 text-xs rounded-full`
  }

  const getCategoryBadge = (category: string) => {
    const colorClass = getCategoryColor(category)
    return `${colorClass} bg-gray-700 px-2 py-1 text-xs rounded-full`
  }

  const resetFilters = () => {
    setStatusFilter('all')
    setCategoryFilter('all')
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Applicants</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading applicants...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Applicants</h1>
        <div className="bg-red-900 border border-red-700 p-4 rounded-lg">
          <p className="text-red-200">Error loading applicants: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Applicants</h1>
        <div className="text-white">
          Total: {filteredApplicants.length} applicants
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, email..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="skilled">Skilled</option>
              <option value="semi-skilled">Semi-skilled</option>
              <option value="unskilled">Unskilled</option>
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

      {/* Applicants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplicants.map((applicant) => (
          <div key={applicant.id} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">
                {applicant.firstName} {applicant.lastName}
              </h3>
              <div className="flex gap-2">
                <span className={getStatusBadge(applicant.status)}>
                  {applicant.status}
                </span>
                <span className={getCategoryBadge(applicant.category)}>
                  {applicant.category}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="font-medium">Email:</span> {applicant.email}</p>
              <p><span className="font-medium">Phone:</span> {applicant.phone}</p>
              <p><span className="font-medium">Nationality:</span> {applicant.nationality}</p>
              <p><span className="font-medium">Experience:</span> {applicant.experience}</p>
              <p><span className="font-medium">Education:</span> {applicant.education}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-xs text-gray-500 space-y-1">
                <p>Created: {new Date(applicant.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(applicant.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplicants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No applicants found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default ApplicantsPage
