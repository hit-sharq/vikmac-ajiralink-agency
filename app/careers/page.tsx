"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import styles from "./careers.module.css"

interface Career {
  id: string
  title: string
  company: string
  description: string
  requirements?: string
  location?: string
  type: string
  salary?: string
  applicationDeadline?: string
  applicationUrl?: string
  contactEmail?: string
  featured: boolean
  image?: string
  commission?: number
  commissionType?: string
  createdAt: string
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      const response = await fetch("/api/careers")
      if (response.ok) {
        const data = await response.json()
        setCareers(data)
      }
    } catch (error) {
      console.error("Failed to fetch careers:", error)
    } finally {
      setLoading(false)
    }
  }

  const careerTypes = ["all", "contract"]

  const filteredCareers = filter === "all"
    ? careers
    : careers.filter(career => career.type === filter)

  const featuredCareers = careers.filter(career => career.featured)

  const handleReadMore = (career: Career) => {
    setSelectedCareer(career)
    setShowDetailModal(true)
  }

  return (
    <>
      <Head>
        <title>Careers | Vikmac AjiraLink Agency - Join Our Team</title>
        <meta
          name="description"
          content="Explore career opportunities at Vikmac AjiraLink Agency. Join our team and work on innovative recruitment and placement solutions."
        />
        <meta name="keywords" content="careers, jobs, employment, opportunities, recruitment, placement, agency" />
        <meta property="og:title" content="Careers | Vikmac AjiraLink Agency - Join Our Team" />
        <meta
          name="og:description"
          content="Explore career opportunities at Vikmac AjiraLink Agency. Join our team and work on innovative recruitment and placement solutions."
        />
      </Head>

      <div className={styles.careersPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <div className={`${styles.container} ${styles.heroContainer}`}>
            <h1 className={styles.heroTitle}>Join Our Team</h1>
            <p className={styles.heroSubtitle}>
              Shape the future of recruitment and placement with us
            </p>
            <p className={styles.heroDescription}>
              We're always looking for talented individuals who are passionate about connecting people with career opportunities.
            </p>
          </div>
        </section>

        {/* Featured Careers Section */}
        {featuredCareers.length > 0 && (
          <section className={styles.featuredSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Featured Opportunities</h2>
              <div className={styles.featuredGrid}>
                {featuredCareers.map((career) => (
                  <div key={career.id} className={styles.featuredCard}>
                    <div className={styles.featuredBadge}>Featured</div>
                    {career.image && (
                      <div className={styles.featuredImage}>
                        <Image
                          src={career.image}
                          alt={career.title}
                          width={400}
                          height={200}
                          className={styles.careerImage}
                        />
                      </div>
                    )}
                    <div className={styles.featuredContent}>
                      <h3 className={styles.featuredTitle}>{career.title}</h3>
                      <p className={styles.featuredCompany}>{career.company}</p>
                      <p className={styles.featuredDescription}>
                        {career.description.length > 100
                          ? `${career.description.substring(0, 100)}...`
                          : career.description}
                      </p>
                      <div className={styles.featuredMeta}>
                        {career.location && <span className={styles.featuredLocation}>📍 {career.location}</span>}
                        <span className={styles.featuredType}>{career.type.replace("-", " ")}</span>
                        {career.salary && <span className={styles.featuredSalary}>💰 {career.salary}</span>}
                        {career.commission && <span className={styles.featuredCommission}>💵 Commission: {career.commission}%</span>}
                      </div>
                      <button
                        className={styles.featuredApplyBtn}
                        onClick={() => handleReadMore(career)}
                      >
                        Learn More →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Careers Section */}
        <section className={styles.careersSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>All Opportunities</h2>
              <div className={styles.filterButtons}>
                {careerTypes.map((type) => (
                  <button
                    key={type}
                    className={`${styles.filterBtn} ${filter === type ? styles.filterBtnActive : ""}`}
                    onClick={() => setFilter(type)}
                  >
                    {type === "all" ? "All" : type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <p>Loading career opportunities...</p>
              </div>
            ) : filteredCareers.length > 0 ? (
              <div className={styles.careersGrid}>
                {filteredCareers.map((career) => (
                  <div key={career.id} className={styles.careerCard}>
                    {career.image && (
                      <div className={styles.careerImageContainer}>
                        <Image
                          src={career.image}
                          alt={career.title}
                          width={300}
                          height={150}
                          className={styles.careerImage}
                        />
                      </div>
                    )}
                    <div className={styles.careerHeader}>
                      <h3 className={styles.careerTitle}>{career.title}</h3>
                      <p className={styles.careerCompany}>{career.company}</p>
                    </div>
                    <p className={styles.careerDescription}>
                      {career.description.length > 120
                        ? `${career.description.substring(0, 120)}...`
                        : career.description}
                    </p>
                    <div className={styles.careerMeta}>
                      {career.location && <span className={styles.careerLocation}>📍 {career.location}</span>}
                      <span className={styles.careerType}>{career.type.replace("-", " ")}</span>
                      {career.salary && (
                        <span className={styles.careerSalary}>💰 {career.salary}</span>
                      )}
                      {career.commission && <span className={styles.careerCommission}>💵 Commission: {career.commission}%</span>}
                      {career.applicationDeadline && (
                        <span className={styles.careerDeadline}>
                          ⏰ Deadline: {new Date(career.applicationDeadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <button
                      className={styles.readMoreBtn}
                      onClick={() => handleReadMore(career)}
                    >
                      Read More →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noCareers}>
                <p>No career opportunities found in this category.</p>
                <button className={styles.resetFilter} onClick={() => setFilter("all")}>
                  Show All Opportunities
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaOverlay}></div>
          <div className={`${styles.container} ${styles.ctaContainer}`}>
            <h2 className={styles.ctaTitle}>Don't See the Right Fit?</h2>
            <p className={styles.ctaText}>
              We're always interested in meeting talented individuals. Send us your resume and let's talk.
            </p>
            <a href="/contact" className={styles.ctaButton}>
              Get In Touch
            </a>
          </div>
        </section>

        {/* Career Detail Modal */}
        {showDetailModal && selectedCareer && (
          <div className={styles.modal} onClick={() => setShowDetailModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{selectedCareer.title}</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowDetailModal(false)}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                {selectedCareer.image && (
                  <div className={styles.modalImage}>
                    <Image
                      src={selectedCareer.image}
                      alt={selectedCareer.title}
                      width={600}
                      height={300}
                      className={styles.modalImage}
                    />
                  </div>
                )}
                <div className={styles.modalMeta}>
                  <div className={styles.modalCompany}>
                    <strong>{selectedCareer.company}</strong>
                  </div>
                  <div className={styles.modalDetails}>
                    {selectedCareer.location && <span className={styles.modalLocation}>📍 {selectedCareer.location}</span>}
                    <span className={styles.modalType}>{selectedCareer.type.replace("-", " ")}</span>
                    {selectedCareer.salary && (
                      <span className={styles.modalSalary}>💰 {selectedCareer.salary}</span>
                    )}
                  </div>
                  {selectedCareer.applicationDeadline && (
                    <div className={styles.modalDeadline}>
                      Application Deadline: {new Date(selectedCareer.applicationDeadline).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className={styles.modalDescription}>
                  <h4>Job Description</h4>
                  <p>{selectedCareer.description}</p>
                </div>

                {selectedCareer.requirements && (
                  <div className={styles.modalRequirements}>
                    <h4>Requirements</h4>
                    <p>{selectedCareer.requirements}</p>
                  </div>
                )}

                {selectedCareer.commission && (
                  <div className={styles.modalCommission}>
                    <h4>Commission</h4>
                    <p>{selectedCareer.commission}% {selectedCareer.commissionType ? `(${selectedCareer.commissionType})` : ''}</p>
                  </div>
                )}

                <div className={styles.modalActions}>
                  {selectedCareer.applicationUrl ? (
                    <a
                      href={selectedCareer.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.applyBtn}
                    >
                      Apply Now →
                    </a>
                  ) : selectedCareer.contactEmail ? (
                    <a
                      href={`mailto:${selectedCareer.contactEmail}?subject=Application for ${selectedCareer.title}`}
                      className={styles.applyBtn}
                    >
                      Apply via Email →
                    </a>
                  ) : (
                    <a href="/contact" className={styles.applyBtn}>
                      Contact Us →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
