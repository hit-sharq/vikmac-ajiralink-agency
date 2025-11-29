import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { findMatchingApplicants } from '@/lib/matching'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Get all job requests that are active (assuming status 'open' or similar)
    const jobRequests = await prisma.jobRequest.findMany({
      where: {
        // Add any filters for active job requests if needed
      }
    })

    let totalAutoApplications = 0

    for (const jobRequest of jobRequests) {
      try {
        // Find matching applicants for this job request
        const matches = await findMatchingApplicants(jobRequest.id)

        // Create auto-applications for matches
        for (const match of matches) {
          // Check if auto-application already exists
          const existing = await prisma.autoApplication.findUnique({
            where: {
              applicantId_jobRequestId: {
                applicantId: match.applicant.id,
                jobRequestId: jobRequest.id
              }
            }
          })

          if (!existing) {
            await prisma.autoApplication.create({
              data: {
                applicantId: match.applicant.id,
                jobRequestId: jobRequest.id,
                matchScore: match.score,
              }
            })
            totalAutoApplications++
          }
        }
      } catch (error) {
        console.error(`Error processing job request ${jobRequest.id}:`, error)
        // Continue with other job requests
      }
    }

    return NextResponse.json({
      message: `Bulk auto-matching completed. Created ${totalAutoApplications} auto-applications for ${jobRequests.length} job requests.`,
      totalAutoApplications,
      jobRequestsProcessed: jobRequests.length
    })
  } catch (error) {
    console.error('Error in bulk auto-matching:', error)
    return NextResponse.json({ error: 'Failed to perform bulk auto-matching' }, { status: 500 })
  }
}
