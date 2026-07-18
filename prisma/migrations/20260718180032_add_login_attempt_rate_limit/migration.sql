-- CreateTable
CREATE TABLE "login_attempts" (
    "id" UUID NOT NULL,
    "ip_address" VARCHAR(64) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_attempt_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blocked_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "login_attempts_ip_address_key" ON "login_attempts"("ip_address");

-- CreateIndex
CREATE INDEX "login_attempts_blocked_until_idx" ON "login_attempts"("blocked_until");
