import Link from "next/link"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Vikmac Ajira Link Agency</h3>
            <p className={styles.footerText}>
              Leading workforce management platform. Streamlining global recruitment, deployment, and workforce
              operations with transparency and efficiency.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <nav className={styles.footerLinks}>
              <Link href="/about" className={styles.footerLink}>
                About Us
              </Link>
              <Link href="/applicant-register" className={styles.footerLink}>
                Apply Now
              </Link>
              <Link href="/employer-portal" className={styles.footerLink}>
                Employer Portal
              </Link>
              <Link href="/careers" className={styles.footerLink}>
                Careers
              </Link>
              <Link href="/news" className={styles.footerLink}>
                News
              </Link>
              <Link href="/contact" className={styles.footerLink}>
                Contact Us
              </Link>
            </nav>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>For Applicants</h4>
            <nav className={styles.footerLinks}>
              <Link href="/applicant-register" className={styles.footerLink}>
                Register as Applicant
              </Link>
              <Link href="/visa-tracking" className={styles.footerLink}>
                Track Visa Status
              </Link>
              <Link href="/faq" className={styles.footerLink}>
                FAQ
              </Link>
              <Link href="/newsletter" className={styles.footerLink}>
                Newsletter
              </Link>
            </nav>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Connect</h4>
            <div className={styles.socialLinks}>
              <a href="https://www.facebook.com/vikmac.ajiralink/" className={styles.socialLink} aria-label="Facebook">
                FB
              </a>
              <a href="https://www.instagram.com/_vikmac?igsh=YzljYTk1ODg3Zg%3D%3D" className={styles.socialLink} aria-label="Instagram">
                IG
              </a>
              <a href="https://www.tiktok.com/@vikmac.ajiralink?_t=8qvFDmi7W57&_r=1" className={styles.socialLink} aria-label="TikTok">
                TT
              </a>
            </div>
            <div className={styles.legalLinks}>
              <Link href="/privacy" className={styles.legalLink}>
                Privacy Policy
              </Link>
              <span className={styles.separator}>•</span>
              <Link href="/terms" className={styles.legalLink}>
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Vikmac Ajira Link Agency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
