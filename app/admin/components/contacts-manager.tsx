"use client"

import { useState, useEffect } from "react"
import styles from "./manager.module.css"

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

export default function ContactsManager() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contact")
      const data = await response.json()
      setContacts(data)
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Messages ({contacts.length})</h1>
        <p className={styles.subtitle}>All contact form submissions are automatically sent to the admin email</p>
      </div>

      <div className={styles.list}>
        {contacts.length === 0 ? (
          <p className={styles.empty}>No contact messages yet.</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className={styles.card} onClick={() => setSelectedContact(contact)}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{contact.subject}</h3>
                <p className={styles.cardExcerpt}>{contact.message.substring(0, 100)}...</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardAuthor}>{contact.name}</span>
                  <span>{contact.email}</span>
                  <span className={styles.cardDate}>{new Date(contact.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedContact && (
        <div className={styles.modal} onClick={() => setSelectedContact(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedContact(null)}>
              ✕
            </button>
            <h2 className={styles.modalTitle}>{selectedContact.subject}</h2>
            <div className={styles.modalMeta}>
              <p>
                <strong>From:</strong> {selectedContact.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedContact.email}
              </p>
              <p>
                <strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}
              </p>
            </div>
            <div className={styles.modalBody}>
              <p>{selectedContact.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
