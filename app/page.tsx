"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import styles from "./page.module.css"

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  image: string
}

interface News {
  id: string
  title: string
  excerpt: string
  image?: string
  publishedAt: string
}

interface Stats {
  members: number
  events: number
  news: number
  yearsActive: number
}

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [stats, setStats] = useState<Stats>({ members: 5000, events: 0, news: 0, yearsActive: 1 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsRes = await fetch("/api/events")
        const eventsData = await eventsRes.json()
        const upcoming = eventsData.filter((event: Event) => new Date(event.date) >= new Date()).slice(0, 3)
        setUpcomingEvents(upcoming)

        const newsRes = await fetch("/api/news")
        const newsData = await newsRes.json()
        setLatestNews(newsData.slice(0, 3))

        setStats((prev) => ({
          ...prev,
          events: eventsData.length,
          news: newsData.length,
        }))
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroGradient}>Global Talent</span> Meets <br />Opportunity
          </h1>
          <p className={styles.heroSubtitle}>
            Connecting exceptional professionals with forward-thinking companies worldwide
          </p>
          <p className={styles.heroDescription}>
            Streamlining recruitment, visa processing, and international deployment with transparency and efficiency.
          </p>
          <div className={styles.heroActions}>
            <Link href="/applicant-register" className={styles.primaryBtn}>
              Find Opportunities
            </Link>
            <Link href="/employer-portal" className={styles.secondaryBtn}>
              For Employers
            </Link>
          </div>
          <div className={styles.statsPreview}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.members}+</span>
              <span className={styles.statLabel}>Professionals</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.events}+</span>
              <span className={styles.statLabel}>Placements</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.yearsActive}+</span>
              <span className={styles.statLabel}>Years</span>
            </div>
          </div>
          <div className={styles.trustBadges}>
            <span className={styles.trustBadge}>Trusted by 500+ Companies</span>
            <span className={styles.trustBadge}>Operating in 50+ Countries</span>
          </div>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.aboutGradient}></div>
        <div className={styles.aboutContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Transforming Workforce Management</h2>
            <p className={styles.sectionSubtitle}>
              We bridge the gap between skilled professionals and employers globally, making international recruitment seamless and efficient.
            </p>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🌍</div>
              <h3 className={styles.statNumberLarge}>50+</h3>
              <p className={styles.statLabelLarge}>Countries Served</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🤝</div>
              <h3 className={styles.statNumberLarge}>10K+</h3>
              <p className={styles.statLabelLarge}>Successful Placements</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚡</div>
              <h3 className={styles.statNumberLarge}>48h</h3>
              <p className={styles.statLabelLarge}>Avg. Response Time</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏆</div>
              <h3 className={styles.statNumberLarge}>98%</h3>
              <p className={styles.statLabelLarge}>Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaOverlay}></div>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Accelerate Your Career or Team?</h2>
          <p className={styles.ctaText}>
            Whether you're an employer looking for skilled workers or a professional seeking global opportunities, we're here to connect you with the right fit.
          </p>
          <Link href="/membership" className={styles.ctaButton}>
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}