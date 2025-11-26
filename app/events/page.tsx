"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import styles from "./events.module.css"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  category: string
  registrationLink?: string
  isStaple?: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming")
  const [selectedStapleEvent, setSelectedStapleEvent] = useState<Event | null>(null)
  const [selectedRegularEvent, setSelectedRegularEvent] = useState<Event | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const now = new Date()
  const stapleEvents = events.filter((event) => event.isStaple)
  const upcomingEvents = events.filter((event) => !event.isStaple && new Date(event.date) >= now)
  const pastEvents = events.filter((event) => !event.isStaple && new Date(event.date) < now)
  const displayEvents = filter === "upcoming" ? upcomingEvents : pastEvents

  return (
    <>

      <div className={styles.eventsPage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Lumyn Events</h1>
            <p className={styles.heroSubtitle}>Join us for tech conferences, workshops, and innovation showcases</p>
          </div>
        </section>

      <section className={styles.eventsSection}>
        <div className={styles.container}>
          {stapleEvents.length > 0 && (
            <div className={styles.stapleSection}>
              <h2 className={styles.sectionTitle}>Staple Events & Programs</h2>
              <div className={styles.stapleContainer}>
                <div className={styles.stapleGrid}>
                  {stapleEvents.map((event) => (
                    <article key={event.id} className={styles.stapleCard}>
                      <div className={styles.stapleImageWrapper}>
                        <Image
                          src={event.image || "/placeholder.svg?height=300&width=500&query=event"}
                          alt={event.title}
                          fill
                          className={styles.stapleImage}
                        />
                        <span className={styles.stapleCategory}>{event.category}</span>
                      </div>
                      <div className={styles.stapleContent}>
                        <h3 className={styles.stapleTitle}>{event.title}</h3>
                        <p className={styles.stapleDescription}>{event.description}</p>
                        {event.registrationLink ? (
                          <a
                            href={event.registrationLink}
                            className={styles.stapleReadMore}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Register
                          </a>
                        ) : (
                          <button
                            className={styles.stapleReadMore}
                            onClick={() => setSelectedStapleEvent(event)}
                          >
                            Read More
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
                {selectedStapleEvent && (
                  <div className={styles.modalOverlay} onClick={() => setSelectedStapleEvent(null)}>
                    <div className={styles.stapleDetailCard} onClick={(e) => e.stopPropagation()}>
                      <button className={styles.detailClose} onClick={() => setSelectedStapleEvent(null)}>×</button>
                    <div className={styles.detailImageWrapper}>
                      <Image
                        src={selectedStapleEvent.image || "/placeholder.svg?height=300&width=500&query=event"}
                        alt={selectedStapleEvent.title}
                        fill
                        className={styles.detailImage}
                      />
                    </div>
                    <div className={styles.detailBody}>
                      <h3 className={styles.detailTitle}>{selectedStapleEvent.title}</h3>
                      <p className={styles.detailDescription}>{selectedStapleEvent.description}</p>
                      <div className={styles.detailDetails}>
                        <div className={styles.detailDetail}>
                          <span className={styles.detailIcon}>📅</span>
                          <span>{new Date(selectedStapleEvent.date).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.detailDetail}>
                          <span className={styles.detailIcon}>🕒</span>
                          <span>{selectedStapleEvent.time}</span>
                        </div>
                        <div className={styles.detailDetail}>
                          <span className={styles.detailIcon}>📍</span>
                          <span>{selectedStapleEvent.location}</span>
                        </div>
                        <div className={styles.detailDetail}>
                          <span className={styles.detailIcon}>🏷️</span>
                          <span>{selectedStapleEvent.category}</span>
                        </div>
                      </div>
                      {selectedStapleEvent.registrationLink && (
                        <a
                          href={selectedStapleEvent.registrationLink}
                          className={styles.detailRegisterBtn}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Register Now
                        </a>
                      )}
                    </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${filter === "upcoming" ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming Events ({upcomingEvents.length})
            </button>
            <button
              className={`${styles.filterBtn} ${filter === "past" ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter("past")}
            >
              Past Events ({pastEvents.length})
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading events...</p>
            </div>
          ) : displayEvents.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No {filter} events</h3>
              <p>
                {filter === "upcoming"
                  ? "Check back soon for upcoming events"
                  : "No past events to display at this time"}
              </p>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {displayEvents.map((event) => (
                <article key={event.id} className={styles.stapleCard}>
                  <div className={styles.stapleImageWrapper}>
                    <Image
                      src={event.image || "/placeholder.svg?height=300&width=500&query=event"}
                      alt={event.title}
                      fill
                      className={styles.stapleImage}
                    />
                    <span className={styles.stapleCategory}>{event.category}</span>
                  </div>
                  <div className={styles.stapleContent}>
                    <h3 className={styles.stapleTitle}>{event.title}</h3>
                    <p className={styles.stapleDescription}>{event.description}</p>
                    {event.registrationLink && filter === "upcoming" ? (
                      <a
                        href={event.registrationLink}
                        className={styles.stapleReadMore}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Register
                      </a>
                    ) : (
                      <button
                        className={styles.stapleReadMore}
                        onClick={() => setSelectedRegularEvent(event)}
                      >
                        Read More
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedRegularEvent && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRegularEvent(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedRegularEvent(null)}>×</button>
            <div className={styles.modalImageWrapper}>
              <Image
                src={selectedRegularEvent.image || "/placeholder.svg?height=300&width=500&query=event"}
                alt={selectedRegularEvent.title}
                fill
                className={styles.modalImage}
              />
            </div>
            <div className={styles.modalBody}>
              <h3 className={styles.modalTitle}>{selectedRegularEvent.title}</h3>
              <p className={styles.modalDescription}>{selectedRegularEvent.description}</p>
              <div className={styles.modalDetails}>
                <div className={styles.modalDetail}>
                  <span className={styles.detailIcon}>📅</span>
                  <span>{new Date(selectedRegularEvent.date).toLocaleDateString()}</span>
                </div>
                <div className={styles.modalDetail}>
                  <span className={styles.detailIcon}>🕒</span>
                  <span>{selectedRegularEvent.time}</span>
                </div>
                <div className={styles.modalDetail}>
                  <span className={styles.detailIcon}>📍</span>
                  <span>{selectedRegularEvent.location}</span>
                </div>
                <div className={styles.modalDetail}>
                  <span className={styles.detailIcon}>🏷️</span>
                  <span>{selectedRegularEvent.category}</span>
                </div>
              </div>
              {selectedRegularEvent.registrationLink && filter === "upcoming" && (
                <a
                  href={selectedRegularEvent.registrationLink}
                  className={styles.modalRegisterBtn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
