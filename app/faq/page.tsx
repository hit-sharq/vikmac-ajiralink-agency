"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
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
      id: "about-lumyn",
      title: "About Lumyn",
      content: (
        <>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What is Lumyn?</summary>
            <p className={styles.faqAnswer}>
              Lumyn is a forward-thinking tech company specializing in modern digital solutions. We design and develop
              high-performance websites, web applications, and digital experiences that help businesses shine online.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What is Lumyn's mission?</summary>
            <p className={styles.faqAnswer}>
              Our mission is to empower businesses with elegant, efficient, and scalable digital solutions that drive
              growth and success in the modern digital landscape.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>When was Lumyn founded?</summary>
            <p className={styles.faqAnswer}>
              Lumyn was founded by Joshua Mwendwa, a passionate software engineer dedicated to crafting seamless user
              experiences and innovative digital solutions.
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
            <summary className={styles.faqQuestion}>What services does Lumyn offer?</summary>
            <p className={styles.faqAnswer}>
              We offer comprehensive digital solutions including web design and development, branding and digital strategy,
              full-stack application development, cloud integration and hosting, and ongoing maintenance and security.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do you work with businesses of all sizes?</summary>
            <p className={styles.faqAnswer}>
              Yes! We work with startups, small businesses, and established companies. Our scalable solutions are designed
              to grow with your business needs.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How long does a typical project take?</summary>
            <p className={styles.faqAnswer}>
              Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while a full
              web application could take 8-12 weeks or more. We'll provide a detailed timeline during our initial consultation.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do you provide ongoing support?</summary>
            <p className={styles.faqAnswer}>
              Absolutely! We offer maintenance packages for updates, security monitoring, performance optimization,
              and technical support to ensure your digital assets remain secure and up-to-date.
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
            <summary className={styles.faqQuestion}>What is your development process?</summary>
            <p className={styles.faqAnswer}>
              Our process includes discovery and planning, design and prototyping, development and testing,
              deployment and launch, followed by ongoing maintenance and support.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How do you ensure project quality?</summary>
            <p className={styles.faqAnswer}>
              We follow industry best practices with thorough testing, code reviews, performance optimization,
              and security audits. We also provide regular updates and feedback sessions throughout the project.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Can I see examples of your work?</summary>
            <p className={styles.faqAnswer}>
              While we maintain client confidentiality, we can discuss our approach and show relevant case studies.
              Contact us to learn more about how we've helped similar businesses achieve their goals.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What technologies do you use?</summary>
            <p className={styles.faqAnswer}>
              We use modern, scalable technologies including React, Next.js, Node.js, TypeScript, PostgreSQL,
              and cloud platforms like Vercel and AWS. We choose the best tools for each project's specific needs.
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
              Our pricing depends on project scope, complexity, and timeline. We provide custom quotes after understanding
              your specific needs. Contact us for a free consultation and detailed proposal.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do you offer payment plans?</summary>
            <p className={styles.faqAnswer}>
              Yes, we offer flexible payment terms for larger projects. We typically require a deposit to begin work,
              with milestone payments throughout the project lifecycle.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>What is your refund policy?</summary>
            <p className={styles.faqAnswer}>
              We offer a satisfaction guarantee. If you're not happy with our work, we'll work to make it right.
              Refunds are considered on a case-by-case basis for deposits on cancelled projects.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Do you provide contracts?</summary>
            <p className={styles.faqAnswer}>
              Yes, we provide detailed project contracts outlining scope, timeline, deliverables, and terms.
              All agreements are transparent and protect both parties' interests.
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
            <summary className={styles.faqQuestion}>How do I contact Lumyn?</summary>
            <p className={styles.faqAnswer}>
              You can reach us through our contact form on the website or email us directly. We'll respond to all
              inquiries within 24 hours and schedule a free consultation to discuss your project needs.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>Where is Lumyn located?</summary>
            <p className={styles.faqAnswer}>
              Lumyn operates remotely, serving clients worldwide. Our founder Joshua Mwendwa is based in the Minneapolis area,
              allowing us to serve local clients effectively while working with businesses globally.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>How can I provide feedback or suggestions?</summary>
            <p className={styles.faqAnswer}>
              We value your feedback! You can share suggestions through our contact form or email us directly.
              We use client feedback to continuously improve our services and processes.
            </p>
          </details>
        </>
      ),
    },
  ]

  return (
    <>

      <div className={styles.faqPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Frequently Asked Questions</h1>
            <p className={styles.heroSubtitle}>Everything you need to know about Lumyn</p>
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
