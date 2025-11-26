import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/events(.*)",
  "/news(.*)",
  "/blog(.*)",
  "/gallery",
  "/contact",
  "/membership",
  "/newsletter",
  "/privacy",
  "/terms",
  "/api/news(.*)",
  "/api/blog(.*)",
  "/api/events(.*)",
  "/api/gallery(.*)",
  "/api/leadership(.*)",
  "/api/contact",
  "/api/membership(.*)", // Allow all membership API routes to be public for form submissions
  "/api/newsletter",
  "/api/stats",
  "/api/partners(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
])

// Simple in-memory rate limiter
const rateLimitMap = new Map()

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 100

function rateLimit(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("remote-address") || "unknown"
  const now = Date.now()

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, startTime: now })
    return true
  }

  const rateData = rateLimitMap.get(ip)

  if (now - rateData.startTime > RATE_LIMIT_WINDOW_MS) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, startTime: now })
    return true
  }

  if (rateData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  rateData.count++
  rateLimitMap.set(ip, rateData)
  return true
}

export default clerkMiddleware(async (auth, request) => {
  if (!rateLimit(request)) {
    return new Response("Too many requests", { status: 429 })
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
