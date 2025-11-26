"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./post.module.css"

interface BlogPost {
  id: string
  title: string
  content: string
  image: string
  author: string
  createdAt: string
  category: string
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string)
    }
  }, [params.id])

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        router.push("/blog")
      }
    } catch (error) {
      console.error("Error fetching blog post:", error)
      router.push("/blog")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading post...</p>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className={styles.postPage}>
      <article className={styles.post}>
        <div className={styles.postHeader}>
          <div className={styles.postMeta}>
            <span className={styles.author}>By {post.author}</span>
            <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={post.image || "/placeholder.svg?height=600&width=1200&query=blog post"}
            alt={post.title}
            fill
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.content}>
          <div className={styles.contentInner} dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className={styles.backButton}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ← Back to Blog
          </button>
        </div>
      </article>
    </div>
  )
}
