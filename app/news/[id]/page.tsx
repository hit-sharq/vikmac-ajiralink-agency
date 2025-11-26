"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./article.module.css"

interface NewsItem {
  id: string
  title: string
  content: string
  image: string
  author: string
  createdAt: string
  category: string
}

export default function NewsArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}`)
      if (response.ok) {
        const data = await response.json()
        setArticle(data)
      } else {
        router.push("/news")
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      router.push("/news")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading article...</p>
      </div>
    )
  }

  if (!article) {
    return null
  }

  return (
    <div className={styles.articlePage}>
      <article className={styles.article}>
        <div className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <span className={styles.category}>{article.category}</span>
            <span className={styles.date}>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.author}>By {article.author}</div>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={article.image || "/placeholder.svg?height=600&width=1200&query=news article"}
            alt={article.title}
            fill
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.content}>
          <div className={styles.contentInner} dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        <div className={styles.backButton}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ← Back to News
          </button>
        </div>
      </article>
    </div>
  )
}
