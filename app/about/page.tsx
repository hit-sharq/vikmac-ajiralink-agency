"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import styles from "../privacy/privacy.module.css"
import type { JSX } from "react/jsx-runtime"

interface Section {
  id: string
  title: string
  content: JSX.Element
}

interface Leader {
  id: string
  name: string
  position: string
  role: string
  imageUrl?: string
  order: number
}

export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 },
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const response = await fetch("/api/leadership")
        if (response.ok) {
          const data = await response.json()
          setLeaders(data)
        }
      } catch (error) {
        console.error("Failed to fetch leadership team:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaders()
  }, [])

  const sections: Section[] = [
    {
      id: "introduction",
      title: "About Vikmac",
      content: (
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <p className={styles.text}>
              Vikmac Ajira Link Agency is a premier workforce management and recruitment platform specializing in connecting skilled professionals with employers worldwide. We provide comprehensive staffing solutions, visa processing services, and international deployment support with a focus on transparency, efficiency, and compliance.
            </p>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <img
              src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif"
              alt="Global Workforce Animation"
              style={{ width: "200px", height: "200px", borderRadius: "12px", objectFit: "cover" }}
            />
          </div>
        </div>
      ),
    },
    {
      id: "mission-vision",
      title: "Mission & Vision",
      content: (
        <>
          <h3 className={styles.subheading}>Our Mission</h3>
          <p className={styles.text}>
            To empower workers and employers with seamless, transparent, and efficient global staffing solutions that
            bridge opportunity with talent.
          </p>
          <h3 className={styles.subheading}>Our Vision</h3>
          <p className={styles.text}>
            To be the world's most trusted workforce management platform, enabling millions of professionals to achieve
            their career aspirations globally.
          </p>
        </>
      ),
    },
    {
      id: "services",
      title: "What We Do",
      content: (
        <>
          <p className={styles.text}>We provide comprehensive workforce management solutions:</p>
          <ul className={styles.list}>
            <li>
              <strong>Global Recruitment:</strong> Connecting skilled professionals with employers worldwide through our advanced matching platform
            </li>
            <li>
              <strong>Visa Processing:</strong> Streamlined visa application and processing services for international deployment
            </li>
            <li>
              <strong>Staffing Solutions:</strong> End-to-end staffing services for various industries including domestic work, security, and professional services
            </li>
            <li>
              <strong>Applicant Management:</strong> Comprehensive applicant tracking, background verification, and documentation management
            </li>
            <li>
              <strong>Employer Support:</strong> Dedicated support for employers throughout the recruitment and deployment process
            </li>
            <li>
              <strong>Compliance & Documentation:</strong> Ensuring all processes meet international labor standards and immigration requirements
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "why-choose",
      title: "Why Choose Vikmac",
      content: (
        <>
          <p className={styles.text}>What sets us apart:</p>
          <ul className={styles.list}>
            <li>
              <strong>Extensive Global Database:</strong> Access to thousands of pre-vetted candidates across multiple countries and skill levels
            </li>
            <li>
              <strong>Fast & Efficient Placement:</strong> Average placement time of 2-4 weeks with our streamlined recruitment process
            </li>
            <li>
              <strong>100% Compliance Guarantee:</strong> All placements meet international labor standards and immigration requirements
            </li>
            <li>
              <strong>24/7 Support Network:</strong> Round-the-clock assistance for employers and employees throughout the deployment process
            </li>
            <li>
              <strong>Proven Success Rate:</strong> Over 95% client satisfaction rate with successful long-term placements
            </li>
            <li>
              <strong>Cost-Effective Solutions:</strong> Competitive pricing with no hidden fees and transparent billing
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "team",
      title: "Our Team",
      content: (
        <div style={{ marginTop: "24px" }}>
          {loading ? (
            <p className={styles.text}>Loading team members...</p>
          ) : leaders.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "24px",
                marginTop: "24px",
              }}
            >
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 15px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      height: "200px",
                      backgroundSize: "cover",
                      backgroundPosition: "center top",
                      backgroundColor: leader.imageUrl ? "transparent" : "#f5f5f5",
                      backgroundImage: leader.imageUrl ? `url(${leader.imageUrl})` : "none",
                    }}
                  >
                    {!leader.imageUrl && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "3rem",
                          background: "linear-gradient(135deg, #8eb69b, #235347)",
                          color: "white",
                        }}
                      >
                        👤
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: "16px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "700",
                        margin: "0 0 8px 0",
                        color: "#051f20",
                      }}
                    >
                      {leader.name}
                    </h3>
                    <p
                      style={{
                        color: "#8eb69b",
                        fontWeight: 600,
                        marginBottom: "8px",
                        fontSize: "0.95rem",
                      }}
                    >
                      {leader.position}
                    </p>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#666",
                        lineHeight: "1.5",
                        margin: "0",
                      }}
                    >
                      {leader.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.text}>Team members will be displayed here once added through the admin panel.</p>
          )}
        </div>
      ),
    },
    {
      id: "contact",
      title: "Get Started",
      content: (
        <p className={styles.text}>
          Ready to find the perfect talent for your organization or start your international career journey? Let's connect you with the right opportunities.
        </p>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>About Vikmac | Premier Global Recruitment & Staffing Agency</title>
        <meta
          name="description"
          content="Discover Vikmac Ajira Link Agency, a leading global recruitment platform specializing in workforce management, visa processing, and international staffing solutions."
        />
        <meta
          name="keywords"
          content="Vikmac, recruitment agency, global staffing, workforce management, visa processing, international employment, job placement"
        />
        <meta property="og:title" content="About Vikmac | Premier Global Recruitment & Staffing Agency" />
        <meta
          name="og:description"
          content="Discover Vikmac Ajira Link Agency, a leading global recruitment platform specializing in workforce management, visa processing, and international staffing solutions."
        />
        <meta property="og:url" content="https://vikmac.vercel.app/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Vikmac | Premier Global Recruitment & Staffing Agency" />
        <meta
          name="twitter:description"
          content="Discover Vikmac Ajira Link Agency, a leading global recruitment platform specializing in workforce management, visa processing, and international staffing solutions."
        />
        <link rel="canonical" href="https://vikmac.vercel.app/about" />
      </Head>
      <div className={styles.privacyPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>About Vikmac</h1>
            <p className={styles.heroSubtitle}>Connecting global talent with opportunity</p>
            <p className={styles.lastUpdated}>Empowering businesses with innovative technology</p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.container}>
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el
                }}
                className={`${styles.sectionCard} ${visibleSections.has(section.id) ? styles.visible : ""}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <div className={styles.sectionContent}>{section.content}</div>
              </section>
            ))}
            <div className={styles.ctaSection}>
              <Link href="/contact" className={styles.ctaButton}>
                Contact Us Today
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
