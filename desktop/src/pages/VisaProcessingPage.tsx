import React, { useState, useEffect } from 'react'

interface VisaRecord {
  id: string
  status: string
  visaType: string
  applicationDate: string
  approvalDate?: string
  expiryDate?: string
  notes?: string
  createdAt: string
  applicant: {
    id: string
    firstName: string
    lastName: string
    email: string
    nationality: string
    category: string
  }
}

const VisaProcessingPage: React.FC = () => {
  const [visaRecords, setVisaRecords] = useState<VisaRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchVisaRecords = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/visa-processing')
        if (!response.ok) {
          throw new Error('Failed to fetch visa records')
        }
        const data = await response.json()
        setVisaRecords(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load visa records')
        console.error('Error fetching visa records:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVisaRecords()
  }, [])

  const filteredRecords = visaRecords.filter(record => {
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesSearch = searchTerm === '' ||
      `${record.applicant.firstName} ${record.applicant.lastName} ${record.applicant.email} ${record.visaType}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-400'
      case 'approved': return 'text-green-400'
      case 'rejected': return 'text-red-400'
      case 'processing': return 'text-blue-400'
      case 'completed': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status)
    return `${colorClass} bg-gray-700 px-2 py-1 text-xs rounded-full`
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Visa Processing</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading visa records...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Visa Processing</h1>
        <div className="bg-red-900 border border-red-700 p-4 rounded-lg">
          <p className="text-red-200">Error loading visa records: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Visa Processing</h1>
        <div className="text-white">
          Total: {filteredRecords.length} records
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or visa type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visa Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">
                {record.applicant.firstName} {record.applicant.lastName}
              </h3>
              <span className={getStatusBadge(record.status)}>
                {record.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="font-medium">Email:</span> {record.applicant.email}</p>
              <p><span className="font-medium">Nationality:</span> {record.applicant.nationality}</p>
              <p><span className="font-medium">Category:</span> {record.applicant.category}</p>
              <p><span className="font-medium">Visa Type:</span> {record.visaType}</p>
              <p><span className="font-medium">Application Date:</span> {new Date(record.applicationDate).toLocaleDateString()}</p>
              {record.approvalDate && (
                <p><span className="font-medium">Approval Date:</span> {new Date(record.approvalDate).toLocaleDateString()}</p>
              )}
              {record.expiryDate && (
                <p><span className="font-medium">Expiry Date:</span> {new Date(record.expiryDate).toLocaleDateString()}</p>
              )}
            </div>

            {record.notes && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  <span className="font-medium">Notes:</span> {record.notes}
                </p>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              Created: {new Date(record.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No visa records found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default VisaProcessingPage
