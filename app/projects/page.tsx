"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import styles from "./projects.module.css"

interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [initialSelectedId, setInitialSelectedId] = useState<string | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    if (id) {
      setInitialSelectedId(id)
    }
  }, [])

  useEffect(() => {
    if (initialSelectedId && projects.length > 0) {
      const found = projects.find((item) => item.id === initialSelectedId)
      if (found) {
        setSelectedProject(found)
        setInitialSelectedId(null)
      }
    }
  }, [initialSelectedId, projects])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const categories = ["all", "website", "web-app", "mobile-app", "e-commerce", "api", "other"]

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter(project => project.category === filter)

  const featuredProjects = projects.filter(project => project.featured)

  return (
    <>
      <Head>
        <title>Our Projects | Lumyn - Digital Solutions Portfolio</title>
        <meta
          name="description"
          content="Explore our portfolio of successful projects. From web applications to mobile apps, see how Lumyn delivers innovative digital solutions."
        />
        <meta name="keywords" content="projects, portfolio, web development, mobile apps, digital solutions, case studies" />
        <meta property="og:title" content="Our Projects | Lumyn - Digital Solutions Portfolio" />
        <meta
          name="og:description"
          content="Explore our portfolio of successful projects. From web applications to mobile apps, see how Lumyn delivers innovative digital solutions."
        />
        <meta property="og:url" content="https://lumyn.vercel.app/projects" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Projects | Lumyn - Digital Solutions Portfolio" />
        <meta
          name="twitter:description"
          content="Explore our portfolio of successful projects. From web applications to mobile apps, see how Lumyn delivers innovative digital solutions."
        />
        <link rel="canonical" href="https://lumyn.vercel.app/projects" />
      </Head>

      <div className={styles.projectsPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <img
            src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif"
            alt="Developer Coding Animation"
            className={styles.heroGif}
            loading="lazy"
          />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Our Projects</h1>
            <p className={styles.heroSubtitle}>Showcasing Innovation Through Code</p>
            <p className={styles.heroDescription}>
              Discover our portfolio of successful digital solutions, from web applications to mobile experiences.
            </p>
          </div>
        </section>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <section className={styles.featuredSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Featured Projects</h2>
              <div className={styles.featuredGrid}>
                {featuredProjects.map((project) => (
                  <div key={project.id} className={styles.featuredCard}>
                    <div className={styles.featuredImage}>
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.featuredContent}>
                      <h3 className={styles.featuredTitle}>{project.title}</h3>
                      <p className={styles.featuredDescription}>{project.description}</p>
                      <div className={styles.featuredTech}>
                        {project.technologies.map((tech) => (
                          <span key={tech} className={styles.techTag}>
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className={styles.featuredLinks}>
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
                            View Live →
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                            GitHub →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Projects Section */}
        <section className={styles.projectsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>All Projects</h2>
              <div className={styles.filterButtons}>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.filterButton} ${filter === category ? styles.active : ""}`}
                    onClick={() => setFilter(category)}
                  >
                    {category === "all" ? "All" : category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <p>Loading projects...</p>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className={styles.projectsGrid}>
                {filteredProjects.map((project) => (
                  <div key={project.id} className={styles.projectCard}>
                    <div className={styles.projectImage}>
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <div className={styles.projectCategory}>
                        {project.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                    <div className={styles.projectContent}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <p className={styles.projectDescription}>
                        {project.description.length > 80
                          ? `${project.description.substring(0, 80)}...`
                          : project.description}
                      </p>
                      <div className={styles.projectTech}>
                        {project.technologies.slice(0, 2).map((tech) => (
                          <span key={tech} className={styles.techTag}>
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 2 && (
                          <span className={styles.techTag}>+{project.technologies.length - 2}</span>
                        )}
                      </div>
                      <button
                        className={styles.readMoreBtn}
                        onClick={() => {
                          setSelectedProject(project)
                          setShowDetailModal(true)
                        }}
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noProjects}>
                <p>No projects found in this category.</p>
                <button className={styles.resetFilter} onClick={() => setFilter("all")}>
                  Show All Projects
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaOverlay}></div>
          <div className={`${styles.container} ${styles.ctaContainer}`}>
            <h2 className={styles.ctaTitle}>Ready to Start Your Project?</h2>
            <p className={styles.ctaText}>
              Let's discuss your vision and bring it to life with our expert team.
            </p>
            <Link href="/membership" className={styles.ctaButton}>
              Start Your Project
            </Link>
          </div>
        </section>

        {/* Project Detail Modal */}
        {showDetailModal && selectedProject && (
          <div className={styles.modal} onClick={() => setShowDetailModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{selectedProject.title}</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowDetailModal(false)}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalImage}>
                  <Image
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.modalDetails}>
                  <div className={styles.modalMeta}>
                    <span className={styles.modalCategory}>
                      {selectedProject.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {selectedProject.featured && (
                      <span className={styles.featuredBadge}>Featured</span>
                    )}
                  </div>
                  <p className={styles.modalDescription}>{selectedProject.description}</p>
                  <div className={styles.modalTech}>
                    <h4>Technologies:</h4>
                    <div className={styles.modalTechTags}>
                      {selectedProject.technologies.map((tech) => (
                        <span key={tech} className={styles.modalTechTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.modalLinks}>
                    {selectedProject.liveUrl && (
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
                        View Live →
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
