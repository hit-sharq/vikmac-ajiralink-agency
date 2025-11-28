import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "ROLE_CHANGED"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET_REQUESTED"

export async function logAudit(action: AuditAction, userId: string, details: Record<string, any> = {}) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        userId,
        details: JSON.stringify(details),
      },
    })
  } catch (error) {
    console.error("[Audit] Failed to log action:", error)
  }
}
