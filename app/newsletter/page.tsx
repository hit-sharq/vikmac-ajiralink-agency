"use client"

import type React from "react"

import { useState } from "react"
import Head from "next/head"
import styles from "./newsletter.module.css"

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus("success")
        setMessage("Thank you for subscribing! You'll receive our latest updates.")
        setEmail("")
      } else {
        const data = await response.json()
        setStatus("error")
        setMessage(data.error || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred. Please try again later.")
    }
  }

  return (
    <>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Stay Connected with Lumyn</h1>
          <p className={styles.subtitle}>
            Subscribe to our newsletter and never miss an update about upcoming events, news, and community activities.
          </p>

        <div className={styles.benefits}>
          <h2 className={styles.benefitsTitle}>What You'll Get:</h2>
          <ul className={styles.benefitsList}>
            <li>Weekly updates on upcoming tech events and activities</li>
            <li>Exclusive member-only content and opportunities</li>
            <li>Tech conference and workshop announcements</li>
            <li>Community news and achievements</li>
            <li>Networking and professional development opportunities</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={styles.input}
              required
              disabled={status === "loading"}
            />
            <button type="submit" className={styles.button} disabled={status === "loading"}>
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </div>

          {status === "success" && <p className={styles.successMessage}>{message}</p>}
          {status === "error" && <p className={styles.errorMessage}>{message}</p>}
        </form>

        <p className={styles.privacy}>
          We respect your privacy. Your email will only be used for Lumyn updates. You can unsubscribe at any time.
        </p>
      </div>
    </div>
    </>
  )
}
