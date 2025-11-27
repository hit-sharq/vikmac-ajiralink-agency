import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { UserCheck, Users, Briefcase, CheckSquare, FileText, CreditCard, BarChart3, Settings } from 'lucide-react'
import './DashboardLayout.css'

interface DashboardLayoutProps {
  setIsAuthenticated: (value: boolean) => void
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ setIsAuthenticated }) => {
  const location = useLocation()

  const navigationSections = [
    {
      title: 'Overview',
      color: 'green',
      items: [
        { name: 'Dashboard', href: '/', icon: BarChart3 }
      ]
    },
    {
      title: 'Applicant Management',
      color: 'blue',
      items: [
        { name: 'Applicants', href: '/applicants', icon: Users },
        { name: 'Shortlist', href: '/shortlist', icon: CheckSquare }
      ]
    },
    {
      title: 'Processing',
      color: 'orange',
      items: [
        { name: 'Job Requests', href: '/job-requests', icon: Briefcase },
        { name: 'Visa Processing', href: '/visa-processing', icon: FileText }
      ]
    },
    {
      title: 'Reports & Admin',
      color: 'purple',
      items: [
        { name: 'Payments', href: '/payments', icon: CreditCard },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
        { name: 'User Management', href: '/user-management', icon: Settings }
      ]
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('desktopUser')
    setIsAuthenticated(false)
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Vikmac Ajira</h2>
          <p>Desktop Admin</p>
        </div>

        <div className="sidebar-content">
          {navigationSections.map((section) => (
            <div key={section.title} className={`navSection navSection-${section.color}`}>
              <h3 className="navSection-title">{section.title}</h3>
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`navBtn ${isActive ? 'navBtnActive' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <UserCheck size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
