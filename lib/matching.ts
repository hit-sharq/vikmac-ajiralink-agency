import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface MatchCriteria {
  category: string
  country: string
  requiredExperience: number
  gender?: string
  ageMin?: number
  ageMax?: number
}

export interface ApplicantProfile {
  id: string
  category: string
  nationality: string
  yearsOfExperience: number
  gender: string
  dateOfBirth: Date
  passportNumber: string
  autoMatchEnabled: boolean
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDiff = today.getMonth() - dateOfBirth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--
  }

  return age
}

/**
 * Check if applicant matches job criteria
 */
export function calculateMatchScore(applicant: ApplicantProfile, criteria: MatchCriteria): number {
  let score = 0
  let totalCriteria = 0

  // Category match (required)
  totalCriteria++
  if (applicant.category === criteria.category) {
    score += 25
  }

  // Country/Nationality match (required)
  totalCriteria++
  if (applicant.nationality === criteria.country) {
    score += 25
  }

  // Experience match (required)
  totalCriteria++
  if (applicant.yearsOfExperience >= criteria.requiredExperience) {
    score += 20
  } else if (applicant.yearsOfExperience >= criteria.requiredExperience * 0.8) {
    score += 15 // Partial match
  }

  // Gender match (optional)
  if (criteria.gender && criteria.gender !== 'Any') {
    totalCriteria++
    if (applicant.gender === criteria.gender) {
      score += 15
    }
  }

  // Age match (optional)
  if (criteria.ageMin || criteria.ageMax) {
    totalCriteria++
    const age = calculateAge(applicant.dateOfBirth)

    if (criteria.ageMin && criteria.ageMax) {
      if (age >= criteria.ageMin && age <= criteria.ageMax) {
        score += 15
      }
    } else if (criteria.ageMin && age >= criteria.ageMin) {
      score += 10
    } else if (criteria.ageMax && age <= criteria.ageMax) {
      score += 10
    }
  }

  // Passport validation (required - must have valid passport)
  totalCriteria++
  if (applicant.passportNumber && applicant.passportNumber.trim() !== '') {
    score += 15
  }

  return Math.round((score / (totalCriteria * 15)) * 100)
}

/**
 * Find matching applicants for a job request
 */
export async function findMatchingApplicants(jobRequestId: string): Promise<Array<{applicant: ApplicantProfile, score: number}>> {
  // Get job request details
  const jobRequest = await prisma.jobRequest.findUnique({
    where: { id: jobRequestId }
  })

  if (!jobRequest) {
    throw new Error('Job request not found')
  }

  const criteria: MatchCriteria = {
    category: jobRequest.category,
    country: jobRequest.country,
    requiredExperience: jobRequest.requiredExperience,
    gender: jobRequest.gender || undefined,
    ageMin: jobRequest.ageMin || undefined,
    ageMax: jobRequest.ageMax || undefined,
  }

  // Get all applicants who have enabled auto-matching
  const applicants = await prisma.applicant.findMany({
    where: {
      autoMatchEnabled: true,
      status: { in: ['new', 'ready'] } // Only match applicants who are available
    },
    select: {
      id: true,
      category: true,
      nationality: true,
      yearsOfExperience: true,
      gender: true,
      dateOfBirth: true,
      passportNumber: true,
      autoMatchEnabled: true,
    }
  })

  // Calculate match scores
  const matches = applicants
    .map(applicant => ({
      applicant: applicant as ApplicantProfile,
      score: calculateMatchScore(applicant as ApplicantProfile, criteria)
    }))
    .filter(match => match.score >= 60) // Only include matches with 60% or higher score
    .sort((a, b) => b.score - a.score) // Sort by score descending

  return matches
}

/**
 * Find matching jobs for an applicant profile
 */
export async function findMatchingJobs(applicantId: string): Promise<Array<{jobRequest: any, score: number}>> {
  // Get applicant details
  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    select: {
      id: true,
      category: true,
      nationality: true,
      yearsOfExperience: true,
      gender: true,
      dateOfBirth: true,
      passportNumber: true,
      autoMatchEnabled: true,
    }
  })

  if (!applicant || !applicant.autoMatchEnabled) {
    return []
  }

  // Get all open job requests
  const jobRequests = await prisma.jobRequest.findMany({
    where: {
      status: 'open'
    }
  })

  // Calculate match scores
  const matches = jobRequests
    .map(jobRequest => {
      const criteria: MatchCriteria = {
        category: jobRequest.category,
        country: jobRequest.country,
        requiredExperience: jobRequest.requiredExperience,
        gender: jobRequest.gender || undefined,
        ageMin: jobRequest.ageMin || undefined,
        ageMax: jobRequest.ageMax || undefined,
      }

      return {
        jobRequest,
        score: calculateMatchScore(applicant as ApplicantProfile, criteria)
      }
    })
    .filter(match => match.score >= 60) // Only include matches with 60% or higher score
    .sort((a, b) => b.score - a.score) // Sort by score descending

  return matches
}
