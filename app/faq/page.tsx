"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./faq.module.css"
import type { JSX } from "react/jsx-runtime"

interface Section {
  id: string
  title: string
  content: JSX.Element
}

export default function FAQPage() {
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
      id: "about-vikmac",
      title: "About Vikmac AjiraLink Agency",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What is Vikmac AjiraLink Agency?</summary>
            <p className={styles.faqAnswer}>
              Vikmac AjiraLink Agency is a professional recruitment and employment agency that connects job seekers 
              with employers across various industries. We provide job placement, visa processing, interview preparation, 
              and career support services.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What is the mission of Vikmac AjiraLink Agency?</summary>
            <p className={styles.faqAnswer}>
              Our mission is to create strong bridges between employers and job seekers by offering transparent, reliable, 
              and effective employment solutions locally and internationally.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>When was Vikmac AjiraLink Agency founded?</summary>
            <p className={styles.faqAnswer}>
              Vikmac AjiraLink Agency was established by a team of recruitment professionals dedicated to improving access 
              to employment opportunities for people in Kenya and beyond.
            </p>
          </details>
        </>
      ),
    },
    {
      id: "services",
      title: "Services",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What services does Vikmac AjiraLink Agency offer?</summary>
            <p className={styles.faqAnswer}>
              We offer job placement, overseas recruitment, visa processing assistance, CV writing, interview coaching, 
              employer sourcing, and long-term career development support.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do you work with job seekers of all levels?</summary>
            <p className={styles.faqAnswer}>
              Yes! We support entry-level candidates, skilled professionals, and senior executives. We match candidates 
              based on skills, goals, and the requirements of our partner employers.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How long does the recruitment process take?</summary>
            <p className={styles.faqAnswer}>
              Timelines vary depending on the job type and employer requirements. Some placements take 2–4 weeks, while 
              international roles may take longer due to documentation and visa processing.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do you provide ongoing career support?</summary>
            <p className={styles.faqAnswer}>
              Yes! We support candidates beyond placement, including career advice, skill development guidance, and 
              progress monitoring.
            </p>
          </details>
        </>
      ),
    },
    {
      id: "process",
      title: "Our Process",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What is your recruitment process?</summary>
            <p className={styles.faqAnswer}>
              Our recruitment process includes consultation, candidate sourcing, screening, interviews, employer matching, 
              documentation assistance, and placement support.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How do you ensure quality candidates?</summary>
            <p className={styles.faqAnswer}>
              We maintain strict screening procedures, document verification, interview preparation, and continuous 
              communication with both employer and candidate.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Can I see testimonials or case studies?</summary>
            <p className={styles.faqAnswer}>
              Yes, we can provide success stories and placement examples during consultation while maintaining 
              confidentiality where required.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What industries do you recruit for?</summary>
            <p className={styles.faqAnswer}>
              We recruit across multiple sectors including hospitality, security, healthcare, domestic work, driving, 
              construction, and corporate positions.
            </p>
          </details>
        </>
      ),
    },
    {
      id: "pricing",
      title: "Pricing & Terms",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How much do your services cost?</summary>
            <p className={styles.faqAnswer}>
              Pricing depends on the job type, destination country, and documentation requirements. We provide a full 
              quotation after understanding your specific needs.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do you offer payment plans?</summary>
            <p className={styles.faqAnswer}>
              Yes, flexible payment plans are available for certain placements. A deposit is usually required to begin 
              processing, followed by milestone payments.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What is your refund policy?</summary>
            <p className={styles.faqAnswer}>
              Refunds depend on the stage of processing and circumstances. We aim for transparency and fairness, reviewing 
              each case individually.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do you provide contracts?</summary>
            <p className={styles.faqAnswer}>
              Yes. All services include written agreements outlining scope, terms, timelines, and responsibilities for 
              transparency and protection.
            </p>
          </details>
        </>
      ),
    },
    {
      id: "contact-support",
      title: "Contact & Support",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How do I contact Vikmac AjiraLink Agency?</summary>
            <p className={styles.faqAnswer}>
              You can reach us through our website contact form, WhatsApp, or direct email. We respond within 24 hours and 
              schedule consultations when needed.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Where are you located?</summary>
            <p className={styles.faqAnswer}>
              We are located in Nairobi, Kenya, serving clients across Kenya and internationally.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How can I give feedback?</summary>
            <p className={styles.faqAnswer}>
              You can provide feedback via our website or email. We value all suggestions to improve our services.
            </p>
          </details>
        </>
      ),
    },
  ]

  return (
    <div className={styles.faqPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Frequently Asked Questions</h1>
          <p className={styles.heroSubtitle}>Everything you need to know about Vikmac AjiraLink Agency</p>
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
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.sectionContent}>{section.content}</div>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
