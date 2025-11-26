"use client"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { ApplicantsPage } from "./pages/ApplicantsPage"
import { JobRequestsPage } from "./pages/JobRequestsPage"
import { ShortlistPage } from "./pages/ShortlistPage"
import { VisaProcessingPage } from "./pages/VisaProcessingPage"
import { PaymentsPage } from "./pages/PaymentsPage"
import { ReportsPage } from "./pages/ReportsPage"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (stored in localStorage)
    const user = localStorage.getItem("desktopUser")
    if (user) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <Route element={<DashboardLayout setIsAuthenticated={setIsAuthenticated} />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/applicants" element={<ApplicantsPage />} />
            <Route path="/job-requests" element={<JobRequestsPage />} />
            <Route path="/shortlist" element={<ShortlistPage />} />
            <Route path="/visa-processing" element={<VisaProcessingPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  )
}

export default App
