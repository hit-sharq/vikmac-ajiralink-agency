"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import styles from "./header.module.css"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isSignedIn } = useUser()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || []
  const isAdmin = isSignedIn && user && adminIds.includes(user.id)

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>VA</div>
          <span className={styles.logoText}>VikMac Ajira</span>
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link href="/careers" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Careers
          </Link>
          <Link href="/applicant-register" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Apply Now
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
          <div className={styles.actions}>
            <button
              className={styles.themeToggle}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className={styles.signInBtn}>Sign In</button>
              </SignInButton>
            )}
            
            <Link href="/membership" className={styles.getStartedBtn} onClick={() => setIsMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}