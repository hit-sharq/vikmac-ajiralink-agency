import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Shortlist {
  id: string
  status: 'pending' | 'approved' | 'rejected' | 'selected'
  notes?: string
  approvedAt?: string
  rejectedAt?: string
  createdAt: string
  applicant: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    status: string
    category: string
    yearsOfExperience: number
    nationality: string
    passportNumber: string
    medicalClearance: boolean
    trainingCompleted: boolean
  }
  jobRequest: {
    id: string
    category: string
    country: string
    salaryMin: number
    salaryMax: number
    employer: {
      companyName: string
    }
  }
}

export function ShortlistPage() {
  const { user, hasPermission } = useAuth()
  const [shortlists, setShortlists] = useState<Shortlist[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedShortlist, setSelectedShortlist] = useState<Shortlist | null>(null)
  const [actionNotes, setActionNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadShortlists()
  }, [])

  const loadShortlists = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/shortlist')
      if (response.ok) {
        const data = await response.json()
        setShortlists(data)
      }
    } catch (error) {
      console.error('Error loading shortlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (shortlistId: string, action: 'approve' | 'reject') => {
    if (!actionNotes.trim()) {
      alert('Please add notes before processing the application')
      return
    }

    setProcessing(true)
    try {
      const response = await fetch(`http://localhost:3000/api/shortlist/${shortlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          notes: actionNotes
        }),
      })

      if (response.ok) {
        alert(`Application ${action}d successfully`)
        setSelectedShortlist(null)
        setActionNotes('')
        loadShortlists()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error processing application:', error)
      alert('Failed to process application')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'approved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      case 'selected': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  if (!hasPermission('staff')) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Shortlisted Candidates</h1>
        <div className="bg-red-800 rounded-lg p-8 border border-red-700 text-center text-white">
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Shortlisted Candidates</h1>
        <button
          onClick={loadShortlists}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center text-gray-400">
          <p>Loading shortlists...</p>
        </div>
      ) : shortlists.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center text-gray-400">
          <p>No shortlisted candidates found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {shortlists.map((shortlist) => (
            <div key={shortlist.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {shortlist.applicant.firstName} {shortlist.applicant.lastName}
                  </h3>
                  <p className="text-gray-400">{shortlist.applicant.email}</p>
                  <p className="text-gray-400">{shortlist.applicant.phone}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(shortlist.status)}`}>
                    {shortlist.status.toUpperCase()}
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    {shortlist.jobRequest.category} - {shortlist.jobRequest.country}
                  </p>
                  <p className="text-sm text-gray-400">
                    {shortlist.jobRequest.employer.companyName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-white">{shortlist.applicant.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Experience</p>
                  <p className="text-white">{shortlist.applicant.yearsOfExperience} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nationality</p>
                  <p className="text-white">{shortlist.applicant.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Medical Clearance</p>
                  <p className={`text-sm ${shortlist.applicant.medicalClearance ? 'text-green-400' : 'text-red-400'}`}>
                    {shortlist.applicant.medicalClearance ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {shortlist.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Notes</p>
                  <p className="text-white">{shortlist.notes}</p>
                </div>
              )}

              {shortlist.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedShortlist(shortlist)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Review Application
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedShortlist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Review Application - {selectedShortlist.applicant.firstName} {selectedShortlist.applicant.lastName}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{selectedShortlist.applicant.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{selectedShortlist.applicant.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Passport Number</p>
                  <p className="text-white">{selectedShortlist.applicant.passportNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nationality</p>
                  <p className="text-white">{selectedShortlist.applicant.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-white">{selectedShortlist.applicant.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Experience</p>
                  <p className="text-white">{selectedShortlist.applicant.yearsOfExperience} years</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Job Details</p>
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-white">{selectedShortlist.jobRequest.category} position</p>
                  <p className="text-gray-300">{selectedShortlist.jobRequest.country}</p>
                  <p className="text-gray-300">
                    Salary: ${selectedShortlist.jobRequest.salaryMin} - ${selectedShortlist.jobRequest.salaryMax}
                  </p>
                  <p className="text-gray-300">{selectedShortlist.jobRequest.employer.companyName}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Call Notes (Required) *
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Document your call with the applicant, verification results, etc."
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAction(selectedShortlist.id, 'approve')}
                disabled={processing || !actionNotes.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex-1"
              >
                {processing ? 'Processing...' : 'Approve & Send to Interview'}
              </button>
              <button
                onClick={() => handleAction(selectedShortlist.id, 'reject')}
                disabled={processing || !actionNotes.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex-1"
              >
                {processing ? 'Processing...' : 'Reject Application'}
              </button>
              <button
                onClick={() => {
                  setSelectedShortlist(null)
                  setActionNotes('')
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
