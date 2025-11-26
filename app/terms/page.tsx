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
          By accessing and using Lumyn's website and services, you accept and agree to be
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
            Lumyn provides digital solutions including web design and development, branding, full-stack applications,
            cloud integration, and ongoing maintenance services.
          </p>

          <h3 className={styles.subheading}>2.2 Client Obligations</h3>
          <p className={styles.text}>As a client, you agree to:</p>
          <ul className={styles.list}>
            <li>Provide accurate and complete project requirements</li>
            <li>Respond to communications in a timely manner</li>
            <li>Provide necessary access and materials for project completion</li>
            <li>Respect intellectual property rights and licensing agreements</li>
          </ul>

          <h3 className={styles.subheading}>2.3 Service Termination</h3>
          <p className={styles.text}>
            Either party may terminate services with written notice. Lumyn reserves the right to terminate services
            for non-payment or breach of these terms.
          </p>
        </>
      ),
    },
    {
      id: "projects",
      title: "3. Projects and Deliverables",
      content: (
        <>
          <h3 className={styles.subheading}>3.1 Project Scope</h3>
          <p className={styles.text}>
            Project scope and deliverables will be defined in writing before work begins. Any changes to scope may
            affect timeline and pricing. Lumyn reserves the right to modify project approach for technical reasons.
          </p>

          <h3 className={styles.subheading}>3.2 Project Conduct</h3>
          <p className={styles.text}>During project collaboration, all parties must:</p>
          <ul className={styles.list}>
            <li>Maintain professional and respectful communication</li>
            <li>Meet agreed-upon deadlines and milestones</li>
            <li>Provide constructive feedback and approvals in a timely manner</li>
            <li>Comply with applicable laws and industry standards</li>
          </ul>

          <h3 className={styles.subheading}>3.3 Intellectual Property</h3>
          <p className={styles.text}>
            Upon final payment, clients receive full ownership of deliverables. Lumyn retains rights to showcase work
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
            <li>Impersonate others or misrepresent your affiliation with Lumyn</li>
          </ul>

          <h3 className={styles.subheading}>4.2 User Content</h3>
          <p className={styles.text}>
            If you submit content to our website (contact forms, project inquiries, etc.), you grant Lumyn a non-exclusive, royalty-free
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
          All content on the Lumyn website, including text, graphics, logos, images, and software, is the property of
          Lumyn or its content suppliers and is protected by copyright and intellectual property laws. You may not
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
            payment schedule outlined in the project contract. Payment information is processed securely through
            third-party payment processors.
          </p>

          <h3 className={styles.subheading}>6.2 Refund Policy</h3>
          <p className={styles.text}>
            Refunds for services are handled on a case-by-case basis. Requests must be submitted in writing.
            Lumyn reserves the right to deny refund requests for completed work or services already rendered.
          </p>
        </>
      ),
    },
    {
      id: "disclaimer",
      title: "7. Disclaimer of Warranties",
      content: (
        <p className={styles.text}>
          The Lumyn website and services are provided "as is" without warranties of any kind, either express or implied.
          We do not guarantee that the website will be uninterrupted, secure, or error-free.
        </p>
      ),
    },
    {
      id: "liability",
      title: "8. Limitation of Liability",
      content: (
        <p className={styles.text}>
          To the fullest extent permitted by law, Lumyn shall not be liable for any indirect, incidental, special, or
          consequential damages arising from your use of the website or engagement of our services.
        </p>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>Terms and Conditions | Lumyn - Modern Digital Solutions</title>
        <meta
          name="description"
          content="Read the terms and conditions for using Lumyn's digital solutions services and website."
        />
        <meta name="keywords" content="Lumyn, digital solutions, terms and conditions, terms of use, tech company" />
        <meta property="og:title" content="Terms and Conditions | Lumyn - Modern Digital Solutions" />
        <meta
          property="og:description"
          content="Read the terms and conditions for using Lumyn's digital solutions services and website."
        />
        <meta property="og:url" content="https://lumyn.vercel.app/terms" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms and Conditions | Lumyn - Modern Digital Solutions" />
        <meta
          name="twitter:description"
          content="Read the terms and conditions for using Lumyn's digital solutions services and website."
        />
        <link rel="canonical" href="https://lumyn.vercel.app/terms" />
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
