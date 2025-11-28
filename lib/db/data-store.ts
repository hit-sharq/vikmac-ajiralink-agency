import type { News, BlogPost, Event, GalleryItem, ContactMessage } from "./schema"

class DataStore {
  private news: News[] = []
  private blogPosts: BlogPost[] = []
  private events: Event[] = []
  private gallery: GalleryItem[] = []
  private contacts: ContactMessage[] = []
  public memberships: any[] = []

  // News methods
  getAllNews() {
    return this.news.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  }

  getNewsById(id: string) {
    return this.news.find((item) => item.id === id)
  }

  createNews(data: Omit<News, "id" | "createdAt" | "updatedAt">) {
    const news: News = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.news.push(news)
    return news
  }

  updateNews(id: string, data: Partial<News>) {
    const index = this.news.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.news[index] = { ...this.news[index], ...data, updatedAt: new Date() }
      return this.news[index]
    }
    return null
  }

  deleteNews(id: string) {
    const index = this.news.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.news.splice(index, 1)
      return true
    }
    return false
  }

  // Blog methods
  getAllBlogPosts() {
    return this.blogPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  }

  getBlogPostById(id: string) {
    return this.blogPosts.find((item) => item.id === id)
  }

  createBlogPost(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) {
    const post: BlogPost = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.blogPosts.push(post)
    return post
  }

  updateBlogPost(id: string, data: Partial<BlogPost>) {
    const index = this.blogPosts.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.blogPosts[index] = { ...this.blogPosts[index], ...data, updatedAt: new Date() }
      return this.blogPosts[index]
    }
    return null
  }

  deleteBlogPost(id: string) {
    const index = this.blogPosts.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.blogPosts.splice(index, 1)
      return true
    }
    return false
  }

  // Event methods
  getAllEvents() {
    return this.events.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  getEventById(id: string) {
    return this.events.find((item) => item.id === id)
  }

  createEvent(data: Omit<Event, "id" | "createdAt" | "updatedAt">) {
    const event: Event = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.events.push(event)
    return event
  }

  updateEvent(id: string, data: Partial<Event>) {
    const index = this.events.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...data, updatedAt: new Date() }
      return this.events[index]
    }
    return null
  }

  deleteEvent(id: string) {
    const index = this.events.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.events.splice(index, 1)
      return true
    }
    return false
  }

  // Gallery methods
  getAllGalleryItems() {
    return this.gallery.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getGalleryItemById(id: string) {
    return this.gallery.find((item) => item.id === id)
  }

  createGalleryItem(data: Omit<GalleryItem, "id" | "createdAt" | "updatedAt">) {
    const item: GalleryItem = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.gallery.push(item)
    return item
  }

  updateGalleryItem(id: string, data: Partial<GalleryItem>) {
    const index = this.gallery.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.gallery[index] = { ...this.gallery[index], ...data, updatedAt: new Date() }
      return this.gallery[index]
    }
    return null
  }

  deleteGalleryItem(id: string) {
    const index = this.gallery.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.gallery.splice(index, 1)
      return true
    }
    return false
  }

  // Contact methods
  getAllContacts() {
    return this.contacts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  createContact(data: Omit<ContactMessage, "id" | "createdAt">) {
    const contact: ContactMessage = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    this.contacts.push(contact)
    return contact
  }
}

export const dataStore = new DataStore()
