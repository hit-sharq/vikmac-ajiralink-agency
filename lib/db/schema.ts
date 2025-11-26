// Database schema types for the application
export interface News {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface GalleryItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
}
