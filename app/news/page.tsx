"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import styles from "./news.module.css"

interface NewsItem {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  createdAt: string
  category: string
  type: "news"
}

interface BlogItem {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  createdAt: string
  category: string
  type: "blog"
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<NewsItem | BlogItem | null>(null)
  const [initialSelectedId, setInitialSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    if (id) {
      setInitialSelectedId(id)
    }
  }, [])

  useEffect(() => {
    if (initialSelectedId && news.length > 0) {
      const found = news.find((item) => item.id === initialSelectedId)
      if (found) {
        setSelectedItem(found)
        setInitialSelectedId(null)
      }
    }
  }, [initialSelectedId, news])

  useEffect(() => {
    fetchNews()
    fetchBlogs()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      const data = await response.json()
      setNews(data.map((item: any) => ({ ...item, type: "news" })))
    } catch (error) {
      console.error("Error fetching news:", error)
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      setBlogs(data.map((item: any) => ({ ...item, type: "blog" })))
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const combinedItems = [...news, ...blogs]

  const filteredItems = filter === "all" ? combinedItems : filter === "blog" ? blogs : filter === "events" ? combinedItems.filter((item) => item.type === "news" && item.category.toLowerCase() === "events") : combinedItems.filter((item) => item.category === filter)

  return (
    <>

      <div className={styles.newsPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Latest News & Updates</h1>
            <p className={styles.heroSubtitle}>Stay informed about Lumyn events, achievements, community news, and blog posts</p>
          </div>
        </section>

      <section className={styles.newsSection}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${filter === "all" ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter("all")}
            >
              All News
            </button>
            <button
              className={`${styles.filterBtn} ${filter === "events" ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter("events")}
            >
              Events
            </button>
            <button
              className={`${styles.filterBtn} ${filter === "achievements" ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter("achievements")}
            >
              Achievements
            </button>
            <button
              className={`${styles.filterBtn} ${filter === "community" ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter("community")}
            >
              Community
            </button>
            <button
              className={`${styles.filterBtn} ${filter === "blog" ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter("blog")}
            >
              Blog
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading news and blogs...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No news or blog posts yet</h3>
              <p>Check back soon for the latest updates from lumyn</p>
            </div>
          ) : (
            <div className={styles.newsGrid}>
              {filteredItems.map((item) => (
                <article key={item.id} className={styles.newsCard}>
                  <div className={styles.newsImageWrapper}>
                    <Image
                      src={item.image || "/placeholder.svg?height=300&width=400&query=news"}
                      alt={item.title}
                      fill
                      className={styles.newsImage}
                    />
                    <span className={styles.newsCategory}>{item.category}</span>
                  </div>
                  <div className={styles.newsContent}>
                    <div className={styles.newsMeta}>
                      <span className={styles.newsAuthor}>{item.author}</span>
                      <span className={styles.newsDate}>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className={styles.newsTitle}>{item.title}</h2>
                    <p className={styles.newsExcerpt}>{item.excerpt}</p>
                    <button
                      className={styles.readMoreBtn}
                      onClick={() => setSelectedItem(item)}
                    >
                      Read More →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {selectedItem && (
            <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
              <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
                <button className={styles.detailClose} onClick={() => setSelectedItem(null)}>×</button>
              <div className={styles.detailImageWrapper}>
                <Image
                  src={selectedItem.image || "/placeholder.svg?height=300&width=500&query=news"}
                  alt={selectedItem.title}
                  fill
                  className={styles.detailImage}
                />
              </div>
              <div className={styles.detailBody}>
                <h3 className={styles.detailTitle}>{selectedItem.title}</h3>
                <p className={styles.detailDescription}>{selectedItem.content}</p>
                <div className={styles.detailDetails}>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>👤</span>
                    <span>{selectedItem.author}</span>
                  </div>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>📅</span>
                    <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>🏷️</span>
                    <span>{selectedItem.category}</span>
                  </div>
                </div>
                <Link href={selectedItem.type === "blog" ? `/blog/${selectedItem.id}` : `/news/${selectedItem.id}`} className={styles.detailReadFullBtn}>
                  Read Full Article →
                </Link>
              </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  )
}
