import { Metadata } from "next"
import styles from "./partners.module.css"
import PartnersClient from "./PartnersClient"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Partners | Lumyn",
  description: "Our valued partners who support our mission.",
}

export default function PartnersPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Our Partners</h1>
        <p className={styles.subtitle}>
          We collaborate with leading organizations to drive innovation and create meaningful impact.
        </p>
      </div>

      <PartnersClient />
    </div>
  )
}
