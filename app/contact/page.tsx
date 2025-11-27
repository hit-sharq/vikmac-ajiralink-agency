"use client"

import type React from "react"

import { useState } from "react"
import styles from "./contact.module.css"

// Enhanced contact form with phone number and areas of interest for well-detailed submissions

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    interests: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus("success")
        setFormData({ name: "", email: "", phone: "", subject: "", interests: "", message: "" })
      } else {
        setStatus("error")
        setErrorMessage("Failed to send message. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage("An error occurred. Please try again later.")
    }
  }

  return (
    <div className={styles.contactPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Contact Vikmac Agency</h1>
          <p className={styles.heroSubtitle}>Ready to find the perfect domestic worker or have questions about our services? Get in touch with us today!</p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2 className={styles.infoTitle}>Contact Information</h2>
              <p className={styles.infoText}>
                Have questions about our recruitment services or need assistance finding qualified domestic workers? Reach out to us and we'll get back to you as soon as possible.
              </p>

              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>📧</div>
                  <h3 className={styles.infoCardTitle}>Email</h3>
                  <p className={styles.infoCardText}>vikagencyltd@gmail.com</p>
                  <p className={styles.infoCardText}>director@norineforbessafarisltd.com</p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>📍</div>
                  <h3 className={styles.infoCardTitle}>Address</h3>
                  <p className={styles.infoCardText}>Pioneer Bazzar, Office No. 26, Opposite Cardinal Otunga. Koinange Street</p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>📞</div>
                  <h3 className={styles.infoCardTitle}>Phone</h3>
                  <p className={styles.infoCardText}>Director: Mrs. Elizabeth Kyule +254714727128</p>
                  <p className={styles.infoCardText}>Operations Manager: +254741555222</p>
                  <p className={styles.infoCardText}>Sourcing Manager: +254750091727</p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>🕐</div>
                  <h3 className={styles.infoCardTitle}>Response Time</h3>
                  <p className={styles.infoCardText}>Within 24 hours</p>
                </div>
              </div>

              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>Follow Us</h3>
                <div className={styles.socialLinks}>
                  <a href="https://www.instagram.com/_vikmac?igsh=YzljYTk1ODg3Zg==" className={styles.socialLink}>
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.contactForm}>
              <h2 className={styles.formTitle}>Send Us a Message</h2>

              {status === "success" && (
                <div className={styles.successMessage}>
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              )}

              {status === "error" && (
                <div className={styles.errorMessage}>
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Joshua Mwendwa"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="joshua@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="+254 712 345 678"
                  />
                  {/* Added phone field for more detailed contact information */}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="job-inquiry">Job Inquiry</option>
                    <option value="employer-services">Employer Services</option>
                    <option value="worker-application">Worker Application</option>
                    <option value="visa-support">Visa & Documentation Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="interests" className={styles.label}>
                    Areas of Interest
                  </label>
                  <select
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Select areas of interest (optional)</option>
                    <option value="nanny">Nanny Services</option>
                    <option value="housekeeper">Housekeeper/Cleaner</option>
                    <option value="driver">Driver Services</option>
                    <option value="security">Security Guard</option>
                    <option value="chef">Chef/Cook</option>
                    <option value="gardener">Gardener</option>
                    <option value="elderly-care">Elderly Care</option>
                    <option value="other">Other Positions</option>
                  </select>
                  {/* Added interests field for more detailed contact information */}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                    rows={6}
                    placeholder="Tell us about your requirements, experience, or any questions you have about our recruitment services..."
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
