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
    projectType: "",
    budget: "",
    timeline: "",
    requirements: "",
    goals: "",
    references: "",
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
          projectType: "",
          budget: "",
          timeline: "",
          requirements: "",
          goals: "",
          references: "",
        })
      } else {
        const errorData = await response.json()
        setStatus("error")
        setErrorMessage(errorData.error || "Failed to submit project inquiry. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage("An error occurred. Please try again later.")
    }
  }

  return (
    <>
      <Head>
        <title>Project Inquiry | Custom Development Services - Lumyn</title>
        <meta
          name="description"
          content="Tell us about your project needs. Get custom web development, mobile apps, and digital solutions from Lumyn's expert team."
        />
        <meta name="keywords" content="custom development, web development, mobile apps, project inquiry, digital solutions" />
        <meta property="og:title" content="Project Inquiry | Custom Development Services - Lumyn" />
        <meta
          property="og:description"
          content="Tell us about your project needs. Get custom web development, mobile apps, and digital solutions from Lumyn's expert team."
        />
        <meta property="og:url" content="https://lumyn.vercel.app/membership" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join Lumyn Network | Collaborate on Innovative Projects" />
      </Head>

      <div className={styles.membershipPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>START YOUR PROJECT</div>
            <h1 className={styles.heroTitle}>Tell Us What You Need Built</h1>
            <p className={styles.heroSubtitle}>
              Share your project vision and requirements. We'll create a custom solution that brings your ideas to life
              with our expert development team.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <div className={styles.benefitsIntro}>
              <h2 className={styles.sectionTitle}>Why Choose Lumyn for Your Project?</h2>
              <p className={styles.sectionSubtitle}>
                We combine technical expertise with creative vision to deliver exceptional digital solutions.
                From concept to launch, we're with you every step of the way.
              </p>
            </div>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🚀</div>
                <h3 className={styles.benefitTitle}>Custom Development</h3>
                <p className={styles.benefitText}>
                  Tailored solutions built specifically for your business needs and goals.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>⚡</div>
                <h3 className={styles.benefitTitle}>Fast Delivery</h3>
                <p className={styles.benefitText}>
                  Efficient development process with clear timelines and regular updates.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🎯</div>
                <h3 className={styles.benefitTitle}>Quality Assurance</h3>
                <p className={styles.benefitText}>
                  Rigorous testing and quality checks to ensure your project exceeds expectations.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🛠️</div>
                <h3 className={styles.benefitTitle}>Full Support</h3>
                <p className={styles.benefitText}>
                  Ongoing maintenance and support to keep your digital solution running smoothly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className={styles.formSection}>
          <div className={styles.container}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Tell Us About Your Project</h2>
              <p className={styles.formSubtitle}>
                Share your vision and requirements so we can create something amazing together
              </p>
            </div>

            {status === "success" && (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>🎉</div>
                <h3>Thank You!</h3>
            <p>Your project inquiry has been received! We'll review your requirements and get back to you within 2-3 business days with a detailed proposal.</p>
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
                  <h3 className={styles.cardTitle}>Personal Information</h3>
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
              </div>

              {/* Contact Information */}
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>📞</div>
                  <h3 className={styles.cardTitle}>Contact Details</h3>
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
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>💼</div>
                  <h3 className={styles.cardTitle}>Project Details</h3>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="projectType" className={styles.label}>Project Type *</label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                      className={styles.select}
                    >
                      <option value="">Select project type</option>
                      <option value="website">Website</option>
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="e-commerce">E-commerce Platform</option>
                      <option value="cms">Content Management System</option>
                      <option value="api">API Development</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="company" className={styles.label}>Company/Organization *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Your company or organization name"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="requirements" className={styles.label}>Project Requirements *</label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                    rows={4}
                    placeholder="Describe what you need built, key features, functionality, and any specific requirements..."
                  />
                </div>
              </div>

              {/* Project Scope & Timeline */}
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>📅</div>
                  <h3 className={styles.cardTitle}>Scope & Timeline</h3>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="budget" className={styles.label}>Budget Range *</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className={styles.select}
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-30k">$15,000 - $30,000</option>
                      <option value="30k-50k">$30,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="over-100k">Over $100,000</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="timeline" className={styles.label}>Preferred Timeline *</label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      required
                      className={styles.select}
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="6-months-plus">6+ months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="goals" className={styles.label}>Project Goals & Objectives *</label>
                  <textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                    rows={3}
                    placeholder="What are the main goals and objectives you want to achieve with this project?"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="references" className={styles.label}>References & Inspiration (Optional)</label>
                  <textarea
                    id="references"
                    name="references"
                    value={formData.references}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows={3}
                    placeholder="Share any websites, apps, or examples that inspire your vision..."
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <span className={styles.spinner}></span>
                    Submitting Project Inquiry...
                  </>
                ) : (
              "Submit Project Inquiry →"
                )}
              </button>

              <p className={styles.disclaimer}>
                By submitting this project inquiry, you agree to receive communications from Lumyn about your project.
                We respect your privacy and will never share your information without permission.
              </p>
            </form>
          </div>
        </section>
      </div>
    </>
  )
}
