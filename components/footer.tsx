"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import styles from "./footer.module.css"

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/vikmac.ajiralink/" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/_vikmac/" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/vikmac-ajira" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/vikmac_ajira" },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <div className={styles.footerLogoIcon}>VA</div>
              <span className={styles.footerLogoText}>Vikmac Ajira</span>
            </div>
            <p className={styles.footerDescription}>
              Leading global recruitment and workforce management platform connecting exceptional talent with forward-thinking companies worldwide.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={styles.socialLink}
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Platform</h4>
            <nav className={styles.footerLinks}>
              <Link href="/about" className={styles.footerLink}>
                About Us
              </Link>
              <Link href="/applicant-register" className={styles.footerLink}>
                Find Jobs
              </Link>
              <Link href="/employer-portal" className={styles.footerLink}>
                For Employers
              </Link>
              <Link href="/careers" className={styles.footerLink}>
                Careers
              </Link>
              <Link href="/pricing" className={styles.footerLink}>
                Pricing
              </Link>
            </nav>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Resources</h4>
            <nav className={styles.footerLinks}>
              <Link href="/visa-tracking" className={styles.footerLink}>
                Visa Tracking
              </Link>
              <Link href="/faq" className={styles.footerLink}>
                FAQ
              </Link>
              <Link href="/blog" className={styles.footerLink}>
                Blog
              </Link>
              <Link href="/newsletter" className={styles.footerLink}>
                Newsletter
              </Link>
              <Link href="/help" className={styles.footerLink}>
                Help Center
              </Link>
            </nav>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Legal</h4>
            <nav className={styles.footerLinks}>
              <Link href="/privacy" className={styles.footerLink}>
                Privacy Policy
              </Link>
              <Link href="/terms" className={styles.footerLink}>
                Terms of Service
              </Link>
              <Link href="/compliance" className={styles.footerLink}>
                Compliance
              </Link>
              <Link href="/contact" className={styles.footerLink}>
                Contact Us
              </Link>
            </nav>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Vikmac Ajira Link Agency. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>
              Privacy
            </Link>
            <span className={styles.separator}>•</span>
            <Link href="/terms" className={styles.legalLink}>
              Terms
            </Link>
            <span className={styles.separator}>•</span>
            <Link href="/cookies" className={styles.legalLink}>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}