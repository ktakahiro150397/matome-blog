import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkReadingTimes() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        readingTimeMinutes: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    console.log("読了時間付きの投稿データ:");
    posts.forEach((post) => {
      console.log(
        `ID: ${post.id}, Slug: ${post.slug}, Title: ${post.title}, 読了時間: ${post.readingTimeMinutes}分`
      );
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error("Error:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkReadingTimes();
