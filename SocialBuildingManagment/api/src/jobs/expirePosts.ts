import cron from 'node-cron';
import { prisma } from '../lib/prisma.js';

export function startExpirePostsJob() {
  // Run daily at 3:00 AM
  cron.schedule('0 3 * * *', async () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);

    try {
      const expiredPosts = await prisma.post.findMany({
        where: {
          status: 'ACTIVE',
          createdAt: { lt: cutoff },
        },
        select: { id: true, authorId: true },
      });

      if (expiredPosts.length === 0) return;

      const authorIds = [...new Set(expiredPosts.map((p) => p.authorId))];

      await prisma.$transaction([
        prisma.post.updateMany({
          where: { id: { in: expiredPosts.map((p) => p.id) } },
          data: { status: 'EXPIRED' },
        }),
        ...authorIds.map((authorId) => {
          const count = expiredPosts.filter((p) => p.authorId === authorId).length;
          return prisma.user.update({
            where: { id: authorId },
            data: { activePostCount: { decrement: count } },
          });
        }),
      ]);

      console.log(`Expired ${expiredPosts.length} posts older than 90 days`);
    } catch (err) {
      console.error('Failed to expire posts:', err);
    }
  });

  console.log('Post expiration cron job scheduled (daily at 3:00 AM)');
}
