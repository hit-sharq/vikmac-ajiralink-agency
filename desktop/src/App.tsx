"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import DashboardLayout from "./layouts/DashboardLayout"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ApplicantsPage from "./pages/ApplicantsPage"
import JobRequestsPage from "./pages/JobRequestsPage"
import ShortlistPage from "./pages/ShortlistPage"
import VisaProcessingPage from "./pages/VisaProcessingPage"
import PaymentsPage from "./pages/PaymentsPage"
import ReportsPage from "./pages/ReportsPage"
import UserManagementPage from "./pages/UserManagementPage"

function AppContent() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route element={<DashboardLayout logout={logout} />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/applicants" element={<ApplicantsPage />} />
          <Route path="/job-requests" element={<JobRequestsPage />} />
          <Route path="/shortlist" element={<ShortlistPage />} />
          <Route path="/visa-processing" element={<VisaProcessingPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
