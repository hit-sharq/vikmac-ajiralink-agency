"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import styles from "./terms.module.css"
import type { JSX } from "react/jsx-runtime" // Added import for JSX

interface Section {
  id: string
  title: string
  content: JSX.Element
}

export default function TermsPage() {
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
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: (
        <p className={styles.text}>
          By accessing and using Vikmac AjiraLink Agency's website and services, you accept and agree to be
          bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or
          services.
        </p>
      ),
    },
    {
      id: "services",
      title: "2. Services",
      content: (
        <>
          <h3 className={styles.subheading}>2.1 Service Description</h3>
          <p className={styles.text}>
            Vikmac AjiraLink Agency provides recruitment services including job placement, visa processing assistance, career counseling,
            employer connections, resume building, interview preparation, and ongoing career development support.
          </p>

          <h3 className={styles.subheading}>2.2 Client Obligations</h3>
          <p className={styles.text}>As a client, you agree to:</p>
          <ul className={styles.list}>
            <li>Provide accurate and complete job requirements and candidate profiles</li>
            <li>Respond to communications in a timely manner</li>
            <li>Provide necessary documentation and access for recruitment processes</li>
            <li>Respect intellectual property rights and licensing agreements</li>
          </ul>

          <h3 className={styles.subheading}>2.3 Service Termination</h3>
          <p className={styles.text}>
            Either party may terminate services with written notice. Vikmac AjiraLink Agency reserves the right to terminate services
            for non-payment or breach of these terms.
          </p>
        </>
      ),
    },
    {
      id: "projects",
      title: "3. Recruitment Process and Deliverables",
      content: (
        <>
          <h3 className={styles.subheading}>3.1 Recruitment Scope</h3>
          <p className={styles.text}>
            Recruitment scope and deliverables will be defined in writing before work begins. Any changes to scope may
            affect timeline and pricing. Vikmac AjiraLink Agency reserves the right to modify recruitment approach for technical reasons.
          </p>

          <h3 className={styles.subheading}>3.2 Recruitment Conduct</h3>
          <p className={styles.text}>During recruitment collaboration, all parties must:</p>
          <ul className={styles.list}>
            <li>Maintain professional and respectful communication</li>
            <li>Meet agreed-upon deadlines and milestones</li>
            <li>Provide constructive feedback and approvals in a timely manner</li>
            <li>Comply with applicable laws and industry standards</li>
          </ul>

          <h3 className={styles.subheading}>3.3 Intellectual Property</h3>
          <p className={styles.text}>
            Upon final payment, clients receive full ownership of recruitment deliverables. Vikmac AjiraLink Agency retains rights to showcase work
            in portfolios unless otherwise agreed. Third-party assets remain subject to their original licenses.
          </p>
        </>
      ),
    },
    {
      id: "website",
      title: "4. Website Use",
      content: (
        <>
          <h3 className={styles.subheading}>4.1 Acceptable Use</h3>
          <p className={styles.text}>You agree not to:</p>
          <ul className={styles.list}>
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the website</li>
            <li>Interfere with or disrupt the website's functionality</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Impersonate others or misrepresent your affiliation with Vikmac AjiraLink Agency</li>
          </ul>

          <h3 className={styles.subheading}>4.2 User Content</h3>
          <p className={styles.text}>
            If you submit content to our website (contact forms, job applications, etc.), you grant Vikmac AjiraLink Agency a non-exclusive, royalty-free
            license to use, reproduce, and display that content. You represent that you own or have permission to share
            any content you submit.
          </p>
        </>
      ),
    },
    {
      id: "intellectual",
      title: "5. Intellectual Property",
      content: (
        <p className={styles.text}>
          All content on the Vikmac AjiraLink Agency website, including text, graphics, logos, images, and software, is the property of
          Vikmac AjiraLink Agency or its content suppliers and is protected by copyright and intellectual property laws. You may not
          reproduce, distribute, or create derivative works without explicit permission.
        </p>
      ),
    },
    {
      id: "payments",
      title: "6. Payments and Refunds",
      content: (
        <>
          <h3 className={styles.subheading}>6.1 Service Fees</h3>
          <p className={styles.text}>
            Service fees are agreed upon in writing before work begins. All fees must be paid according to the
            payment schedule outlined in the service contract. Payment information is processed securely through
            third-party payment processors.
          </p>

          <h3 className={styles.subheading}>6.2 Refund Policy</h3>
          <p className={styles.text}>
            Refunds for services are handled on a case-by-case basis. Requests must be submitted in writing.
            Vikmac AjiraLink Agency reserves the right to deny refund requests for completed work or services already rendered.
          </p>
        </>
      ),
    },
    {
      id: "disclaimer",
      title: "7. Disclaimer of Warranties",
      content: (
        <p className={styles.text}>
          The Vikmac AjiraLink Agency website and services are provided "as is" without warranties of any kind, either express or implied.
          We do not guarantee that the website will be uninterrupted, secure, or error-free.
        </p>
      ),
    },
    {
      id: "liability",
      title: "8. Limitation of Liability",
      content: (
        <p className={styles.text}>
          To the fullest extent permitted by law, Vikmac AjiraLink Agency shall not be liable for any indirect, incidental, special, or
          consequential damages arising from your use of the website or engagement of our services.
        </p>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>Terms and Conditions | Vikmac AjiraLink Agency - Recruitment Services</title>
        <meta
          name="description"
          content="Read the terms and conditions for using Vikmac AjiraLink Agency's recruitment services and website."
        />
        <meta name="keywords" content="Vikmac AjiraLink Agency, recruitment services, terms and conditions, terms of use, employment agency" />
        <meta property="og:title" content="Terms and Conditions | Vikmac AjiraLink Agency - Recruitment Services" />
        <meta
          name="og:description"
          content="Read the terms and conditions for using Vikmac AjiraLink Agency's recruitment services and website."
        />
        <meta property="og:url" content="https://vikmacajiralink.vercel.app/terms" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms and Conditions | Vikmac AjiraLink Agency - Recruitment Services" />
        <meta
          name="twitter:description"
          content="Read the terms and conditions for using Vikmac AjiraLink Agency's recruitment services and website."
        />
        <link rel="canonical" href="https://vikmacajiralink.vercel.app/terms" />
      </Head>
      <div className={styles.termsPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Terms and Conditions</h1>
            <p className={styles.heroSubtitle}>Please read these terms carefully before using our services</p>
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
