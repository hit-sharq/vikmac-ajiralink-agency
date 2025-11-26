"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import styles from "./sponsorship.module.css"

interface SponsorshipTier {
  id: string
  name: string
  amount: string
  color: string
  benefits: string[]
}

const sponsorshipTiers: SponsorshipTier[] = [
  {
    id: "supporter",
    name: "Supporter",
    amount: "$100",
    color: "#051F20",
    benefits: [
      "Recognition on Lumyn's social media platforms",
      "A personalized thank-you email from the Lumyn team",
      "Invitation to attend one of our tech events or webinars",
    ],
  },
  {
    id: "advocate",
    name: "Advocate",
    amount: "$250",
    color: "#0B2B26",
    benefits: [
      "All benefits from the Supporter level",
      "Logo or name featured on project showcases and promotional materials",
      "Verbal recognition at one of our major tech events",
    ],
  },
  {
    id: "partner",
    name: "Partner",
    amount: "$500",
    color: "#163832",
    benefits: [
      "All benefits from the Advocate level",
      "Logo or name featured on Lumyn's website and newsletters",
      "Opportunity to showcase your business or organization at a Lumyn event",
      "Special recognition at our annual tech conferences",
    ],
  },
  {
    id: "custom",
    name: "Custom Sponsorship",
    amount: "Open",
    color: "#235347",
    benefits: [
      "Open contributions of any amount",
      "Discussion of aligned sponsorship opportunities",
      "In-kind donations, services, or monetary contributions",
      "Support to help Lumyn innovate and grow",
    ],
  },
]

export default function SponsorshipPage() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.2 },
    )

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>Sponsorship Opportunities | Lumyn - Tech Company</title>
        <meta
          name="description"
          content="Partner with Lumyn, a forward-thinking tech company. Support our digital solutions and gain recognition through various sponsorship levels."
        />
        <meta name="keywords" content="Lumyn, tech company, sponsorship, partner, support, digital solutions, web development" />
        <meta property="og:title" content="Sponsorship Opportunities | Lumyn - Tech Company" />
        <meta
          property="og:description"
          content="Partner with Lumyn, a forward-thinking tech company. Support our digital solutions and gain recognition through various sponsorship levels."
        />
        <meta property="og:url" content="https://lumyn.vercel.app/sponsorship" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sponsorship Opportunities | Lumyn - Tech Company" />
        <meta
          name="twitter:description"
          content="Partner with Lumyn, a forward-thinking tech company. Support our digital solutions and gain recognition through various sponsorship levels."
        />
        <link rel="canonical" href="https://lumyn.vercel.app/sponsorship" />
      </Head>
      <div className={styles.sponsorshipPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Partner With Lumyn</h1>
            <p className={styles.heroSubtitle}>
              Support our mission of creating innovative digital solutions and empowering businesses
            </p>
            <p className={styles.heroDescription}>
              Your sponsorship will help us build cutting-edge technology and drive digital transformation
            </p>
          </div>
        </section>

      {/* Sponsorship Tiers Section */}
      <section className={styles.tiersSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Sponsorship Opportunities</h2>
          <p className={styles.sectionDescription}>
            Choose a sponsorship level that aligns with your organization's goals and budget
          </p>

          <div className={styles.tiersContainer}>
            {sponsorshipTiers.map((tier, index) => (
              <div
                key={tier.id}
                id={tier.id}
                ref={(el) => {
                  cardRefs.current[tier.id] = el
                }}
                className={`${styles.tierCard} ${visibleCards.has(tier.id) ? styles.visible : ""}`}
                style={{
                  backgroundColor: tier.color,
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <div className={styles.tierHeader}>
                  <h3 className={styles.tierName}>{tier.name}</h3>
                  <p className={styles.tierAmount}>{tier.amount}</p>
                </div>
                <ul className={styles.benefitsList}>
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className={styles.benefitItem}>
                      <span className={styles.checkmark}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Sponsor Section */}
      <section className={styles.howToSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How to Become a Sponsor</h2>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Contact Us</h3>
              <p className={styles.stepDescription}>
                Reach out to discuss your sponsorship interests and preferred level
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Send Contribution</h3>
              <p className={styles.stepDescription}>
                Financial contributions can be sent via CashApp ($lumynumn) or other payment methods
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Get Recognition</h3>
              <p className={styles.stepDescription}>
                Receive your sponsorship benefits and recognition across our platforms and events
              </p>
            </div>
          </div>

          <div className={styles.ctaContainer}>
            <Link href="/contact" className={styles.primaryButton}>
              Contact Us for Sponsorship
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Get in Touch</h2>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Contact Information</h3>
              <p className={styles.contactText}>
                <strong>Email:</strong>
                <br />
                <a href="mailto:lumyntechnologies@gmail.com" className={styles.contactLink}>
                  lumyntechnologies@gmail.com
                </a>
              </p>
              <p className={styles.contactText}>
                <strong>Location:</strong> Remote & On-site Services
              </p>
              <p className={styles.contactText}>
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>

            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Payment Options</h3>
              <p className={styles.contactText}>
                <strong>Important:</strong> Payments are made after discussions with founders and Lumyn leaders. Please do not make any payments until you have spoken with us.
              </p>
              <p className={styles.contactText}>
                <strong>Instagram:</strong>{" "}
                <a
                  href="https://www.instagram.com/j_lee087/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  @j_lee087
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to Make an Impact?</h2>
          <p className={styles.ctaDescription}>
            Join us in driving innovation and supporting cutting-edge digital solutions
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className={styles.primaryButton}>
              Become a Sponsor
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
