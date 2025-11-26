'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import styles from './search.module.css'

interface SearchResult {
  id: string
  title: string
  excerpt?: string
  description?: string
  category: string
  image: string
  author?: string
  type: 'news' | 'events' | 'blog'
  sortDate: string
  date?: string
  time?: string
  location?: string
}

interface SearchResponse {
  query: string
  results: SearchResult[]
  total: number
  limit: number
  offset: number
}

export default function SearchComponent() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const performSearch = async (searchQuery: string, searchType: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: searchType,
        limit: '10'
      })

      const response = await fetch(`/api/search?${params}`)
      const data: SearchResponse = await response.json()
      setResults(data.results)
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query, type)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, type])

  const getLink = (result: SearchResult) => {
    switch (result.type) {
      case 'news':
        return `/news/${result.id}`
      case 'events':
        return `/events`
      case 'blog':
        return `/blog/${result.id}`
      default:
        return '/'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'news':
        return 'News'
      case 'events':
        return 'Event'
      case 'blog':
        return 'Blog'
      default:
        return type
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search news, events, blog..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          {query && (
            <button
              className={styles.clearButton}
              onClick={() => {
                setQuery('')
                setResults([])
                setShowResults(false)
              }}
            >
              <X className={styles.clearIcon} />
            </button>
          )}
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={styles.searchSelect}
        >
          <option value="all">All</option>
          <option value="news">News</option>
          <option value="events">Events</option>
          <option value="blog">Blog</option>
        </select>
      </div>

      {showResults && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            {loading ? 'Searching...' : `Found ${results.length} results`}
          </div>
          {results.length === 0 && !loading ? (
            <div className={styles.noResults}>
              No results found
            </div>
          ) : (
            <div className={styles.resultsList}>
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={getLink(result)}
                  className={styles.resultItem}
                  onClick={() => setShowResults(false)}
                >
                  <div className={styles.resultContent}>
                    <div className={styles.resultMeta}>
                      <span className={`${styles.resultType} ${styles[`type${result.type}`]}`}>
                        {getTypeLabel(result.type)}
                      </span>
                      <span className={styles.resultCategory}>
                        {result.category}
                      </span>
                    </div>
                    <h3 className={styles.resultTitle}>
                      {result.title}
                    </h3>
                    <p className={styles.resultExcerpt}>
                      {result.excerpt || result.description || ''}
                    </p>
                    {result.author && (
                      <p className={styles.resultAuthor}>
                        By {result.author}
                      </p>
                    )}
                    {result.location && (
                      <p className={styles.resultLocation}>
                        📍 {result.location}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
