"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Eye } from "lucide-react"

interface Applicant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  category: string
  status: string
  dateOfBirth: string
}

export function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    try {
      // Replace with actual API call
      setApplicants([
        {
          id: "1",
          firstName: "John",
          lastName: "Kipchoge",
          email: "john@example.com",
          phone: "+254712345678",
          category: "Driver",
          status: "shortlisted",
          dateOfBirth: "1990-05-15",
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Wanjiru",
          email: "jane@example.com",
          phone: "+254723456789",
          category: "Nanny",
          status: "pending",
          dateOfBirth: "1992-08-20",
        },
      ])
    } catch (error) {
      console.error("Error fetching applicants:", error)
    }
  }

  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || a.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-900 text-yellow-300",
      shortlisted: "bg-blue-900 text-blue-300",
      selected: "bg-green-900 text-green-300",
      rejected: "bg-red-900 text-red-300",
    }
    return colors[status] || "bg-gray-700 text-gray-300"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Applicants</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus size={20} />
          <span>Add Applicant</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">Phone</th>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((applicant) => (
              <tr key={applicant.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="px-6 py-3 text-white">
                  {applicant.firstName} {applicant.lastName}
                </td>
                <td className="px-6 py-3 text-gray-400">{applicant.email}</td>
                <td className="px-6 py-3 text-gray-400">{applicant.category}</td>
                <td className="px-6 py-3 text-gray-400">{applicant.phone}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(applicant.status)}`}>
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-600 rounded transition-colors">
                      <Eye size={18} className="text-gray-400 hover:text-white" />
                    </button>
                    <button className="p-1 hover:bg-gray-600 rounded transition-colors">
                      <Edit2 size={18} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredApplicants.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No applicants found</p>
        </div>
      )}
    </div>
  )
}
