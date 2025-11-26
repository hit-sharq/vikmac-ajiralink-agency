"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import styles from "./gallery.module.css"

interface GalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  createdAt: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching gallery:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]
  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter)

  return (
    <>

      <div className={styles.galleryPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Photo Gallery</h1>
            <p className={styles.heroSubtitle}>Capturing moments and memories from our community</p>
          </div>
        </section>

      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.filterBtn} ${filter === category ? styles.filterBtnActive : ""}`}
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading gallery...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No images yet</h3>
              <p>Check back soon for photos from our events and activities</p>
            </div>
          ) : (
            <div className={styles.galleryGrid}>
              {filteredItems.map((item) => (
                <div key={item.id} className={styles.galleryItem} onClick={() => setSelectedItem(item)}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.imageUrl || "/placeholder.svg?height=400&width=400&query=gallery"}
                      alt={item.title}
                      fill
                      className={styles.image}
                    />
                    <div className={styles.overlay}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemCategory}>{item.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <div className={styles.lightbox} onClick={() => setSelectedItem(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>
              ✕
            </button>
            <div className={styles.lightboxImageWrapper}>
              <Image
                src={selectedItem.imageUrl || "/placeholder.svg?height=800&width=1200&query=gallery"}
                alt={selectedItem.title}
                fill
                className={styles.lightboxImage}
              />
            </div>
            <div className={styles.lightboxInfo}>
              <h2 className={styles.lightboxTitle}>{selectedItem.title}</h2>
              <p className={styles.lightboxDescription}>{selectedItem.description}</p>
              <div className={styles.lightboxMeta}>
                <span className={styles.lightboxCategory}>{selectedItem.category}</span>
                <span className={styles.lightboxDate}>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
