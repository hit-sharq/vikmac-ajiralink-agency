import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface InterviewCandidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  category: string
  status: string
  shortlistId: string
  jobRequest: {
    id: string
    category: string
    country: string
    employer: {
      companyName: string
    }
  }
  interviewScheduled?: boolean
  interviewDate?: string
  interviewNotes?: string
}

export function InterviewPage() {
  const { user, hasPermission } = useAuth()
  const [candidates, setCandidates] = useState<InterviewCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<InterviewCandidate | null>(null)
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewNotes, setInterviewNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    try {
      setLoading(true)
      // Fetch approved shortlists that need interviews
      const response = await fetch('http://localhost:3000/api/shortlist?status=approved')
      if (response.ok) {
        const shortlists = await response.json()
        // Filter for candidates that haven't been interviewed yet
        const interviewCandidates = shortlists
          .filter((s: any) => s.status === 'approved' && !s.interviewScheduled)
          .map((s: any) => ({
            ...s.applicant,
            shortlistId: s.id,
            jobRequest: s.jobRequest,
            interviewScheduled: false
          }))
        setCandidates(interviewCandidates)
      }
    } catch (error) {
      console.error('Error loading candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const scheduleInterview = async () => {
    if (!selectedCandidate || !interviewDate.trim()) {
      alert('Please select a date for the interview')
      return
    }

    setProcessing(true)
    try {
      // Update shortlist with interview details
      const response = await fetch(`http://localhost:3000/api/shortlist/${selectedCandidate.shortlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'schedule_interview',
          interviewDate,
          interviewNotes
        }),
      })

      if (response.ok) {
        alert('Interview scheduled successfully')
        setSelectedCandidate(null)
        setInterviewDate('')
        setInterviewNotes('')
        loadCandidates()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error scheduling interview:', error)
      alert('Failed to schedule interview')
    } finally {
      setProcessing(false)
    }
  }

  if (!hasPermission('manager')) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Interview Management</h1>
        <div className="bg-red-800 rounded-lg p-8 border border-red-700 text-center text-white">
          <p>You need manager privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Interview Management</h1>
        <button
          onClick={loadCandidates}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center text-gray-400">
          <p>Loading candidates...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center text-gray-400">
          <p>No candidates waiting for interviews.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {candidate.firstName} {candidate.lastName}
                  </h3>
                  <p className="text-gray-400">{candidate.email}</p>
                  <p className="text-gray-400">{candidate.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    {candidate.jobRequest.category} - {candidate.jobRequest.country}
                  </p>
                  <p className="text-sm text-gray-400">
                    {candidate.jobRequest.employer.companyName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-white">{candidate.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-green-400">{candidate.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Interview Status</p>
                  <p className="text-yellow-400">Pending</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(candidate)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
              >
                Schedule Interview
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Schedule Interview - {selectedCandidate.firstName} {selectedCandidate.lastName}
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Interview Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Interview Notes
                </label>
                <textarea
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Add any notes about the interview setup, requirements, etc."
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={scheduleInterview}
                disabled={processing || !interviewDate.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex-1"
              >
                {processing ? 'Scheduling...' : 'Schedule Interview'}
              </button>
              <button
                onClick={() => {
                  setSelectedCandidate(null)
                  setInterviewDate('')
                  setInterviewNotes('')
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
