-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VerificationCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userid" INTEGER NOT NULL,
    CONSTRAINT "VerificationCode_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_VerificationCode" ("code", "created_at", "id", "updated_at", "userid") SELECT "code", "created_at", "id", "updated_at", "userid" FROM "VerificationCode";
DROP TABLE "VerificationCode";
ALTER TABLE "new_VerificationCode" RENAME TO "VerificationCode";
CREATE UNIQUE INDEX "VerificationCode_code_key" ON "VerificationCode"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
