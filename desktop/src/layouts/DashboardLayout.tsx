"use client"

import { Outlet, Link, useLocation } from "react-router-dom"
import { Menu, LogOut, Users, FileText, CheckSquare, Plane, CreditCard, BarChart3 } from "lucide-react"
import { useState } from "react"

interface DashboardLayoutProps {
  setIsAuthenticated: (value: boolean) => void
}

export function DashboardLayout({ setIsAuthenticated }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/applicants", label: "Applicants", icon: Users },
    { path: "/job-requests", label: "Job Requests", icon: FileText },
    { path: "/shortlist", label: "Shortlist", icon: CheckSquare },
    { path: "/visa-processing", label: "Visa Processing", icon: Plane },
    { path: "/payments", label: "Payments", icon: CreditCard },
    { path: "/reports", label: "Reports", icon: BarChart3 },
  ]

  const handleLogout = () => {
    localStorage.removeItem("desktopUser")
    setIsAuthenticated(false)
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-lg font-bold">Vikmac Ajira</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-700 rounded">
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">Office Management System</h2>
          <div className="flex items-center space-x-4">
            <div className="text-gray-400 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-900 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
