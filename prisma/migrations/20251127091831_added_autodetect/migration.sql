-- CreateTable
CREATE TABLE "AutoApplication" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "jobRequestId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "matchScore" DOUBLE PRECISION NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AutoApplication_applicantId_idx" ON "AutoApplication"("applicantId");

-- CreateIndex
CREATE INDEX "AutoApplication_jobRequestId_idx" ON "AutoApplication"("jobRequestId");

-- CreateIndex
CREATE INDEX "AutoApplication_status_idx" ON "AutoApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AutoApplication_applicantId_jobRequestId_key" ON "AutoApplication"("applicantId", "jobRequestId");

-- AddForeignKey
ALTER TABLE "AutoApplication" ADD CONSTRAINT "AutoApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoApplication" ADD CONSTRAINT "AutoApplication_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "JobRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
