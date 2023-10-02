-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "username" TEXT,
    "password" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "year" INTEGER,
    "season" INTEGER,
    "slug" TEXT,
    "airingStatus" TEXT,
    "isHiden" BOOLEAN NOT NULL DEFAULT false,
    "studios" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "votes" INTEGER NOT NULL DEFAULT 0,
    "follows" INTEGER NOT NULL DEFAULT 0,
    "format" TEXT,
    "country" TEXT,
    "pictures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "source" TEXT,
    "episodes" INTEGER,
    "score" REAL,
    "title" JSONB NOT NULL,
    "summary" JSONB,
    "dayOfWeek" JSONB,
    "time" JSONB,
    "startDate" JSONB,
    "endDate" JSONB,
    "idExternal" JSONB,
    "scoreExternal" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" JSONB,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relations" (
    "relationType" TEXT NOT NULL,
    "source_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,

    CONSTRAINT "relations_pkey" PRIMARY KEY ("source_id","destination_id")
);

-- CreateTable
CREATE TABLE "followlist" (
    "media_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "watch_status" TEXT NOT NULL DEFAULT 'watching',
    "score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "followlist_pkey" PRIMARY KEY ("media_id","user_id")
);

-- CreateTable
CREATE TABLE "webpush" (
    "device" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "push_subscription" JSONB NOT NULL,
    "useragent" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webpush_pkey" PRIMARY KEY ("device")
);

-- CreateTable
CREATE TABLE "_GenresToMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "genres_key_key" ON "genres"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_GenresToMedia_AB_unique" ON "_GenresToMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_GenresToMedia_B_index" ON "_GenresToMedia"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relations" ADD CONSTRAINT "relations_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relations" ADD CONSTRAINT "relations_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followlist" ADD CONSTRAINT "followlist_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followlist" ADD CONSTRAINT "followlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webpush" ADD CONSTRAINT "webpush_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenresToMedia" ADD CONSTRAINT "_GenresToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenresToMedia" ADD CONSTRAINT "_GenresToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
