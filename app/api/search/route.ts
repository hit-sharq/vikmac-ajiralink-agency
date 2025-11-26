import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') // 'news', 'events', 'blog', or 'all'
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const results = []

    // Search News
    if (!type || type === 'all' || type === 'news') {
      const newsQuery = {
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { excerpt: { contains: query, mode: 'insensitive' as const } },
            { content: { contains: query, mode: 'insensitive' as const } },
            { author: { contains: query, mode: 'insensitive' as const } },
          ],
          ...(category && { category: { contains: category, mode: 'insensitive' as const } })
        },
        select: {
          id: true,
          title: true,
          excerpt: true,
          category: true,
          image: true,
          author: true,
          publishedAt: true,
        },
        take: limit,
        skip: offset,
        orderBy: { publishedAt: 'desc' as const }
      }

      const news = await prisma.news.findMany(newsQuery)
      results.push(...news.map(item => ({ ...item, type: 'news', sortDate: item.publishedAt })))
    }

    // Search Events
    if (!type || type === 'all' || type === 'events') {
      const eventsQuery = {
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { description: { contains: query, mode: 'insensitive' as const } },
            { location: { contains: query, mode: 'insensitive' as const } },
          ],
          ...(category && { category: { contains: category, mode: 'insensitive' as const } })
        },
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          time: true,
          location: true,
          image: true,
          category: true,
        },
        take: limit,
        skip: offset,
        orderBy: { date: 'desc' as const }
      }

      const events = await prisma.event.findMany(eventsQuery)
      results.push(...events.map(item => ({ ...item, type: 'events', sortDate: item.date })))
    }

    // Search Blog
    if (!type || type === 'all' || type === 'blog') {
      const blogQuery = {
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { excerpt: { contains: query, mode: 'insensitive' as const } },
            { content: { contains: query, mode: 'insensitive' as const } },
            { author: { contains: query, mode: 'insensitive' as const } },
          ],
          ...(category && { category: { contains: category, mode: 'insensitive' as const } })
        },
        select: {
          id: true,
          title: true,
          excerpt: true,
          category: true,
          image: true,
          author: true,
          publishedAt: true,
        },
        take: limit,
        skip: offset,
        orderBy: { publishedAt: 'desc' as const }
      }

      const blogs = await prisma.blog.findMany(blogQuery)
      results.push(...blogs.map(item => ({ ...item, type: 'blog', sortDate: item.publishedAt })))
    }

    // Sort combined results by date (most recent first)
    results.sort((a, b) => {
      const dateA = new Date(a.sortDate)
      const dateB = new Date(b.sortDate)
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json({
      query,
      results,
      total: results.length,
      limit,
      offset
    })
  } catch (error) {
    console.error("[v0] Error searching:", error)
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 })
  }
}
