-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "location" TEXT,
    "type" TEXT NOT NULL DEFAULT 'full-time',
    "salary" TEXT,
    "applicationDeadline" TIMESTAMP(3),
    "applicationUrl" TEXT,
    "contactEmail" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Career_type_idx" ON "Career"("type");

-- CreateIndex
CREATE INDEX "Career_featured_idx" ON "Career"("featured");

-- CreateIndex
CREATE INDEX "Career_applicationDeadline_idx" ON "Career"("applicationDeadline");
