"use client"

import Link from "next/link"
import { useState } from "react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import styles from "./header.module.css"
import SearchComponent from "./search"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isSignedIn } = useUser()

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
  const isAdmin = isSignedIn && user && adminIds.includes(user.id)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Vikmac</span>
          <span className={styles.logoSubtext}>Ajira</span>
        </Link>

        <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          <span className={isMenuOpen ? styles.menuIconOpen : styles.menuIcon}></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link href="/applicant-register" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Apply Now
          </Link>
          <Link href="/employer-portal" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Employers
          </Link>
          <Link href="/news" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            News
          </Link>
          <Link href="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
          {isAdmin && (
            <Link href="/admin" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
          )}
          <Link href="/membership" className={styles.joinBtn} onClick={() => setIsMenuOpen(false)}>
            Get Started
          </Link>
          <div className={styles.authButtons}>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className={styles.signInBtn} onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
          <div style={{ marginLeft: "16px" }}>
            <SearchComponent />
          </div>
        </nav>
      </div>
    </header>
  )
}
