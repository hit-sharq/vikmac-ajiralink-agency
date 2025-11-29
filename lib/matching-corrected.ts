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

export interface CareerCriteria {
  category?: string
  location?: string
  type?: string
  requiredExperience?: number
}

export interface ApplicantProfile {
  id: string
  category: string
  nationality: string
  yearsOfExperience: number
  gender: string
  dateOfBirth: Date
  passportNumber: string
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
  if (applicant.nationality.toLowerCase().includes(criteria.country.toLowerCase()) ||
      criteria.country.toLowerCase().includes(applicant.nationality.toLowerCase()) ||
      applicant.nationality === criteria.country ||
      criteria.country === applicant.nationality) {
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
 * Calculate match score for career matching (simplified version)
 */
export function calculateCareerMatchScore(applicant: ApplicantProfile, criteria: CareerCriteria): number {
  let score = 0
  let totalCriteria = 0

  // Category/title match (required)
  totalCriteria++
  if (criteria.category && applicant.category.toLowerCase().includes(criteria.category.toLowerCase())) {
    score += 25
  }

  // Location match (optional)
  if (criteria.location) {
    totalCriteria++
    if (applicant.nationality.toLowerCase().includes(criteria.location.toLowerCase())) {
      score += 25
    }
  }

  // Experience match (optional)
  if (criteria.requiredExperience !== undefined) {
    totalCriteria++
    if (applicant.yearsOfExperience >= criteria.requiredExperience) {
      score += 20
    } else if (applicant.yearsOfExperience >= criteria.requiredExperience * 0.8) {
      score += 15 // Partial match
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
    where: { id: jobRequestId },
    include: { employer: true }
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

  // Get all applicants who are available (new or ready status)
  const applicants = await prisma.applicant.findMany({
    where: {
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
 * Find matching applicants for a career
 */
export async function findMatchingApplicantsForCareer(careerId: string): Promise<Array<{applicant: ApplicantProfile, score: number}>> {
  // Get career details
  const career = await prisma.career.findUnique({
    where: { id: careerId }
  })

  if (!career) {
    throw new Error('Career not found')
  }

  const criteria: CareerCriteria = {
    category: career.title,
    location: career.location || undefined,
    type: career.type,
    requiredExperience: 0, // Careers may not have required experience, default to 0
  }

  // Get all applicants who are available (new or ready status)
  const applicants = await prisma.applicant.findMany({
    where: {
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
    }
  })

  // Calculate match scores
  const matches = applicants
    .map(applicant => ({
      applicant: applicant as ApplicantProfile,
      score: calculateCareerMatchScore(applicant as ApplicantProfile, criteria)
    }))
    .filter(match => match.score >= 60) // Only include matches with 60% or higher score
    .sort((a, b) => b.score - a.score) // Sort by score descending

  return matches
}

/**
 * Find matching careers for an applicant profile
 */
export async function findMatchingCareers(applicantId: string): Promise<Array<{career: any, score: number}>> {
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
    }
  })

  if (!applicant) {
    return []
  }

  // Get all featured careers (assuming these are active/open)
  const careers = await prisma.career.findMany({
    where: {
      featured: true
    }
  })

  // Calculate match scores
  const matches = careers
    .map(career => {
      const criteria: CareerCriteria = {
        category: career.title,
        location: career.location || undefined,
        type: career.type,
        requiredExperience: 0, // Default to 0 since careers don't have required experience
      }

      return {
        career,
        score: calculateCareerMatchScore(applicant as ApplicantProfile, criteria)
      }
    })
    .filter(match => match.score >= 60) // Only include matches with 60% or higher score
    .sort((a, b) => b.score - a.score) // Sort by score descending

  return matches
}
