import { prisma } from './src/lib/prisma';

async function test() {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: { isFeatured: true },
    });
    console.log('Successfully fetched featured jobs:', jobs.length);
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
