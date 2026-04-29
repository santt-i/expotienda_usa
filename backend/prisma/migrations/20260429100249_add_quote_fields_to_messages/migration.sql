-- DropIndex
DROP INDEX "Message_receiverId_idx";

-- DropIndex
DROP INDEX "Message_senderId_idx";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isQuote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quotePrice" DOUBLE PRECISION,
ADD COLUMN     "quoteProductId" INTEGER,
ADD COLUMN     "quoteProductName" TEXT,
ADD COLUMN     "quoteQuantity" INTEGER,
ADD COLUMN     "quoteStatus" TEXT DEFAULT 'pending';
