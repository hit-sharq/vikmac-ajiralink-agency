"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Head from "next/head"
import styles from "./membership.module.css"

export default function MembershipPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus("success")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          inquiryType: "",
          message: "",
        })
      } else {
        const errorData = await response.json()
        setStatus("error")
        setErrorMessage(errorData.error || "Failed to submit inquiry. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage("An error occurred. Please try again later.")
    }
  }

  return (
    <>
      <Head>
        <title>Membership Inquiry | VicMac AjiraLink Agency</title>
        <meta
          name="description"
          content="Inquire about membership opportunities with VicMac AjiraLink Agency. Join our network of employers and access qualified workers across East Africa."
        />
        <meta name="keywords" content="employment agency membership, job placement network, East Africa recruitment, business membership, membership inquiry" />
        <meta property="og:title" content="Membership Inquiry | VicMac AjiraLink Agency" />
        <meta
          property="og:description"
          content="Inquire about membership opportunities with VicMac AjiraLink Agency."
        />
        <meta property="og:url" content="https://vikmac-ajira.com/membership" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join VicMac AjiraLink Agency | Membership Inquiry" />
      </Head>

      <div className={styles.membershipPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>BECOME A MEMBER</div>
            <h1 className={styles.heroTitle}>Join VicMac AjiraLink Agency Network</h1>
            <p className={styles.heroSubtitle}>
              Access qualified workers and expand your business opportunities. Become a member of our extensive
              employment network across East Africa.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <div className={styles.benefitsIntro}>
              <h2 className={styles.sectionTitle}>Why Become a Member of VicMac AjiraLink Agency?</h2>
              <p className={styles.sectionSubtitle}>
                Join our growing network of employers and access qualified talent across East Africa.
                Membership provides exclusive access to our recruitment services and job placement opportunities.
              </p>
            </div>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🌍</div>
                <h3 className={styles.benefitTitle}>East African Network</h3>
                <p className={styles.benefitText}>
                  Access to qualified workers and job opportunities across Kenya, Tanzania, and Uganda.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>👥</div>
                <h3 className={styles.benefitTitle}>Verified Candidates</h3>
                <p className={styles.benefitText}>
                  Pre-screened and qualified applicants ready for immediate placement.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>💼</div>
                <h3 className={styles.benefitTitle}>Business Growth</h3>
                <p className={styles.benefitText}>
                  Expand your business through our extensive employment network and recruitment services.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🤝</div>
                <h3 className={styles.benefitTitle}>Member Support</h3>
                <p className={styles.benefitText}>
                  Dedicated support and resources to help members succeed in the employment sector.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section className={styles.formSection}>
          <div className={styles.container}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Membership Inquiry</h2>
              <p className={styles.formSubtitle}>
                Have questions about membership? Send us your inquiry and we'll provide detailed information about joining our network.
              </p>
            </div>

            {status === "success" && (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>🎉</div>
                <h3>Thank You!</h3>
                <p>Your membership inquiry has been received! We'll review your questions and get back to you within 2-3 business days with detailed information about our membership opportunities.</p>
              </div>
            )}

            {status === "error" && (
              <div className={styles.errorMessage}>
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Personal Information */}
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>👤</div>
                  <h3 className={styles.cardTitle}>Contact Information</h3>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>
              </div>

              {/* Organization & Inquiry */}
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>🏢</div>
                  <h3 className={styles.cardTitle}>Organization & Inquiry</h3>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.label}>Company/Organization (Optional)</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Your company or organization name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="inquiryType" className={styles.label}>Inquiry Type *</label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Select inquiry type</option>
                    <option value="membership-benefits">Membership Benefits</option>
                    <option value="membership-fees">Membership Fees & Costs</option>
                    <option value="recruitment-services">Recruitment Services</option>
                    <option value="job-placement">Job Placement Opportunities</option>
                    <option value="member-support">Member Support Services</option>
                    <option value="other">Other Questions</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                    rows={5}
                    placeholder="Please describe your inquiry, questions, or what you'd like to learn about our membership opportunities..."
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <span className={styles.spinner}></span>
                    Submitting Inquiry...
                  </>
                ) : (
                  "Submit Inquiry →"
                )}
              </button>

              <p className={styles.disclaimer}>
                By submitting this inquiry, you agree to receive communications from VicMac AjiraLink Agency about membership opportunities.
                We respect your privacy and will never share your information without permission.
              </p>
            </form>
          </div>
        </section>
      </div>
    </>
  )
}
