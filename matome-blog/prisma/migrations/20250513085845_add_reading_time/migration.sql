-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "videoId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "readingTime" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Post" ("content", "excerpt", "id", "publishedAt", "slug", "title", "updatedAt", "videoId", "videoUrl") SELECT "content", "excerpt", "id", "publishedAt", "slug", "title", "updatedAt", "videoId", "videoUrl" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
