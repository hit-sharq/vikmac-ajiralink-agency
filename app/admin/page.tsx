"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import styles from "./admin.module.css"
import NewsManager from "./components/news-manager"
import BlogManager from "./components/blog-manager"
import EventsManager from "./components/events-manager"
import GalleryManager from "./components/gallery-manager"
import MembersManager from "./components/members-manager"
import ContactsManager from "./components/contacts-manager"
import LeadershipManager from "./components/leadership-manager"
import CareersManager from "./components/careers-manager"
import PartnersManager from "./components/partners-manager"
import ApplicantsManager from "./components/applicants-manager.tsx"
import EmployersManager from "./components/employers-manager.tsx"
import JobRequestsManager from "./components/job-requests-manager.tsx"
import MatchingManager from "./components/matching-manager.tsx"
import VisaProcessingManager from "./components/visa-processing-manager.tsx"
import PaymentsManager from "./components/payments-manager.tsx"
import ReportsManager from "./components/reports-manager.tsx"
import UsersManager from "./components/users-manager.tsx"

type Tab =
  | "news"
  | "blog"
  | "events"
  | "gallery"
  | "members"
  | "contacts"
  | "leadership"
  | "careers"
  | "partners"
  | "applicants"
  | "matching"
  | "visa-processing"
  | "payments"
  | "reports"
  | "users"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("news")
  const { user, isSignedIn, isLoaded } = useUser()

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
  const isAdmin = isSignedIn && user && adminIds.includes(user.id)

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>Access Denied</h1>
          <p className={styles.loginSubtitle}>You do not have permission to access the admin panel.</p>
          <p className={styles.loginHint}>Please sign in with an admin account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Vikmac Admin Panel</h2>
          <p className={styles.adminName}>{user.fullName || user.emailAddresses[0].emailAddress}</p>
        </div>
        <nav className={styles.nav}>
          <div className={`${styles.navSection} ${styles.vikmacSection}`}>
            <h3 className={styles.navSectionTitle}>Content Management</h3>
            <button
              className={`${styles.navBtn} ${activeTab === "news" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("news")}
            >
              News
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "blog" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("blog")}
            >
              Blog
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "events" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "gallery" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("gallery")}
            >
              Gallery
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "members" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("members")}
            >
              Members
            </button>

            <button
              className={`${styles.navBtn} ${activeTab === "leadership" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("leadership")}
            >
              Leadership
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "contacts" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("contacts")}
            >
              Contact Messages
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "careers" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("careers")}
            >
              Careers
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "partners" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("partners")}
            >
              Partners
            </button>
          </div>
          <div className={`${styles.navSection} ${styles.vikmacSection}`}>
            <h3 className={styles.navSectionTitle}>VicMac Management</h3>
            <button
              className={`${styles.navBtn} ${activeTab === "applicants" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("applicants")}
            >
              Applicants
            </button>

            <button
              className={`${styles.navBtn} ${activeTab === "matching" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("matching")}
            >
              Matching
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "visa-processing" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("visa-processing")}
            >
              Visa Processing
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "payments" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              Payments
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "reports" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("reports")}
            >
              Reports
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === "users" ? styles.navBtnActive : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
          </div>
          <div className={`${styles.navSection} ${styles.gdprSection}`}>
            <h3 className={styles.navSectionTitle}>GDPR</h3>
            <button
              className={styles.navBtn}
              onClick={async () => {
                try {
                  const response = await fetch("/api/gdpr/export")
                  const data = await response.json()
                  if (response.ok) {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "gdpr-export.json"
                    a.click()
                    URL.revokeObjectURL(url)
                  } else {
                    alert("Export failed: " + data.error)
                  }
                } catch (error) {
                  alert("Export failed")
                }
              }}
            >
              Export Data
            </button>
            <button
              className={styles.navBtn}
              onClick={async () => {
                if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
                  try {
                    const response = await fetch("/api/gdpr/delete", { method: "DELETE" })
                    const data = await response.json()
                    if (response.ok) {
                      alert("Data deleted successfully")
                    } else {
                      alert("Delete failed: " + data.error)
                    }
                  } catch (error) {
                    alert("Delete failed")
                  }
                }
              }}
            >
              Delete Data
            </button>
          </div>
        </nav>
      </div>

      <div className={styles.content}>
        {activeTab === "news" && <NewsManager />}
        {activeTab === "blog" && <BlogManager />}
        {activeTab === "events" && <EventsManager />}
        {activeTab === "gallery" && <GalleryManager />}
        {activeTab === "members" && <MembersManager />}
        {activeTab === "leadership" && <LeadershipManager />}
        {activeTab === "contacts" && <ContactsManager />}
        {activeTab === "careers" && <CareersManager />}
        {activeTab === "partners" && <PartnersManager />}
        {activeTab === "applicants" && <ApplicantsManager />}
        {activeTab === "matching" && <MatchingManager />}
        {activeTab === "visa-processing" && <VisaProcessingManager />}
        {activeTab === "payments" && <PaymentsManager />}
        {activeTab === "reports" && <ReportsManager />}
        {activeTab === "users" && <UsersManager />}
      </div>
    </div>
  )
}
