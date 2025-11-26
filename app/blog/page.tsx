"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import styles from "./blog.module.css"

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  createdAt: string
  category: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

      <div className={styles.blogPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Lumyn Blog</h1>
            <p className={styles.heroSubtitle}>Stories, insights, and experiences from our community</p>
          </div>
        </section>

      <section className={styles.blogSection}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading blog posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No blog posts yet</h3>
              <p>Check back soon for stories and insights from our community</p>
            </div>
          ) : (
            <div className={styles.blogGrid}>
              {posts.map((post, index) => (
                <article key={post.id} className={index === 0 ? styles.featuredPost : styles.blogCard}>
                  <div className={styles.blogImageWrapper}>
                    <Image
                      src={post.image || "/placeholder.svg?height=400&width=600&query=blog post"}
                      alt={post.title}
                      fill
                      className={styles.blogImage}
                    />
                  </div>
                  <div className={styles.blogContent}>
                    <div className={styles.blogMeta}>
                      <span className={styles.blogAuthor}>{post.author}</span>
                      <span className={styles.blogDate}>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className={styles.blogTitle}>{post.title}</h2>
                    <p className={styles.blogExcerpt}>{post.excerpt}</p>
                    {post.category && (
                      <div className={styles.tags}>
                        <span className={styles.tag}>
                          {post.category}
                        </span>
                      </div>
                    )}
                    <button
                      className={styles.readMoreBtn}
                      onClick={() => setSelectedPost(post)}
                    >
                      Read Full Post →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {selectedPost && (
            <div className={styles.modalOverlay} onClick={() => setSelectedPost(null)}>
              <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
                <button className={styles.detailClose} onClick={() => setSelectedPost(null)}>×</button>
              <div className={styles.detailImageWrapper}>
                <Image
                  src={selectedPost.image || "/placeholder.svg?height=300&width=500&query=blog"}
                  alt={selectedPost.title}
                  fill
                  className={styles.detailImage}
                />
              </div>
              <div className={styles.detailBody}>
                <h3 className={styles.detailTitle}>{selectedPost.title}</h3>
                <p className={styles.detailDescription}>{selectedPost.content}</p>
                <div className={styles.detailDetails}>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>👤</span>
                    <span>{selectedPost.author}</span>
                  </div>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>📅</span>
                    <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.detailDetail}>
                    <span className={styles.detailIcon}>🏷️</span>
                    <span>{selectedPost.category}</span>
                  </div>
                </div>
                <Link href={`/blog/${selectedPost.id}`} className={styles.detailReadFullBtn}>
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
