"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import styles from "./privacy.module.css"
import type { JSX } from "react/jsx-runtime"

interface Section {
  id: string
  title: string
  content: JSX.Element
}

export default function PrivacyPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
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

  const sections: Section[] = [
    {
      id: "introduction",
      title: "Introduction",
      content: (
        <p className={styles.text}>
          Lumyn ("we," "us," or "our") is committed to
          protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our website or use our services.
        </p>
      ),
    },
    {
      id: "information-collect",
      title: "Information We Collect",
      content: (
        <>
          <h3 className={styles.subheading}>Personal Information</h3>
          <p className={styles.text}>
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className={styles.list}>
            <li>Register for membership</li>
            <li>Submit a contact form</li>
            <li>Subscribe to our newsletter</li>
            <li>Register for events</li>
            <li>Create an account on our website</li>
          </ul>
          <p className={styles.text}>This information may include:</p>
          <ul className={styles.list}>
            <li>Name and contact information (email address, phone number)</li>
            <li>Professional information (optional)</li>
            <li>Payment information (for services)</li>
          </ul>

          <h3 className={styles.subheading}>Automatically Collected Information</h3>
          <p className={styles.text}>
            When you visit our website, we may automatically collect certain information about your device, including
            information about your web browser, IP address, time zone, and cookies installed on your device.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      content: (
        <>
          <p className={styles.text}>We use the information we collect to:</p>
          <ul className={styles.list}>
            <li>Process service inquiries and maintain client records</li>
            <li>Communicate with you about projects, updates, and services</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you newsletters and promotional materials (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </>
      ),
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      content: (
        <>
          <p className={styles.text}>
            We do not sell, trade, or rent your personal information to third parties. We may share your information
            only in the following circumstances:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>With your consent:</strong> We may share your information when you give us explicit permission
            </li>
            <li>
              <strong>Service providers:</strong> We may share information with third-party service providers who
              perform services on our behalf
            </li>
            <li>
              <strong>Legal requirements:</strong> We may disclose information if required by law or in response to
              valid legal requests
            </li>
            <li>
              <strong>Business partners:</strong> We may share information with business partners as
              required for project operations
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "data-security",
      title: "Data Security",
      content: (
        <p className={styles.text}>
          We implement appropriate technical and organizational security measures to protect your personal information
          against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
          the internet or electronic storage is 100% secure.
        </p>
      ),
    },
    {
      id: "your-rights",
      title: "Your Rights",
      content: (
        <>
          <p className={styles.text}>You have the right to:</p>
          <ul className={styles.list}>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent for data processing (where applicable)</li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: (
        <p className={styles.text}>
          We use cookies and similar tracking technologies to track activity on our website and store certain
          information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      content: (
        <p className={styles.text}>
          If you have questions or concerns about this Privacy Policy, please contact us through our contact form or
          reach out to our leadership team.
        </p>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>Privacy Policy | Lumyn - Modern Digital Solutions</title>
        <meta
          name="description"
          content="Learn about how Lumyn collects, uses, and protects your personal information in our digital solutions services."
        />
        <meta name="keywords" content="Lumyn, digital solutions, privacy policy, data protection, personal information, tech company" />
        <meta property="og:title" content="Privacy Policy | Lumyn - Modern Digital Solutions" />
        <meta
          property="og:description"
          content="Learn about how Lumyn collects, uses, and protects your personal information in our digital solutions services."
        />
        <meta property="og:url" content="https://lumyn.vercel.app/privacy" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Lumyn - Modern Digital Solutions" />
        <meta
          name="twitter:description"
          content="Learn about how Lumyn collects, uses, and protects your personal information in our digital solutions services."
        />
        <link rel="canonical" href="https://lumyn.vercel.app/privacy" />
      </Head>
      <div className={styles.privacyPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Privacy Policy</h1>
            <p className={styles.heroSubtitle}>Your privacy is important to us</p>
            <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>
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
        </div>
      </section>
    </div>
    </>
  )
}
