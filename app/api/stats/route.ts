import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    // Fetch basic counts
    const [totalApplicants, totalEmployers, totalDeployed, totalPayments] = await Promise.all([
      prisma.applicant.count(),
      prisma.employer.count(),
      prisma.applicant.count({ where: { status: 'deployed' } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
    ])

    // Fetch applicants by category
    const applicantsByCategory = await prisma.applicant.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } }
    })

    // Fetch applicants by country
    const applicantsByCountry = await prisma.applicant.groupBy({
      by: ['nationality'],
      _count: { nationality: true },
      orderBy: { _count: { nationality: 'desc' } }
    })

    // Fetch payments by month
    const paymentsByMonth = await prisma.payment.groupBy({
      by: ['createdAt'],
      _sum: { amount: true },
      orderBy: { createdAt: 'asc' }
    })

    // Format payments by month
    const formattedPaymentsByMonth = paymentsByMonth.map(payment => ({
      month: payment.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      amount: payment._sum.amount || 0
    }))

    return NextResponse.json({
      totalApplicants,
      totalEmployers,
      totalDeployed,
      totalPayments: totalPayments._sum.amount || 0,
      applicantsByCategory: applicantsByCategory.map(item => ({
        category: item.category,
        count: item._count.category
      })),
      applicantsByCountry: applicantsByCountry.map(item => ({
        country: item.nationality,
        count: item._count.nationality
      })),
      paymentsByMonth: formattedPaymentsByMonth,
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
