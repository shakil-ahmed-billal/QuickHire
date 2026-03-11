import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@quickhire.com' },
    update: {},
    create: {
      name: 'QuickHire Admin',
      email: 'admin@quickhire.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Categories
  const categories = [
    { name: 'Engineering', slug: 'engineering', icon: '⚙️' },
    { name: 'Design', slug: 'design', icon: '🎨' },
    { name: 'Marketing', slug: 'marketing', icon: '📢' },
    { name: 'Finance', slug: 'finance', icon: '💰' },
    { name: 'Healthcare', slug: 'healthcare', icon: '🏥' },
    { name: 'Education', slug: 'education', icon: '📚' },
    { name: 'Sales', slug: 'sales', icon: '💼' },
    { name: 'Customer Service', slug: 'customer-service', icon: '🎧' },
    { name: 'Data Science', slug: 'data-science', icon: '📊' },
    { name: 'Product', slug: 'product', icon: '🚀' },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log('✅ Categories created:', categories.length);

  // Create Sample Jobs
  const jobs = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechVision Ltd',
      location: 'Dhaka, Bangladesh',
      type: 'FULL_TIME' as const,
      salary: 'BDT 80,000 - 120,000/month',
      description: 'We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern CSS frameworks. You will build stunning user interfaces and collaborate with our product team.',
      requirements: '• 3+ years of React experience\n• TypeScript proficiency\n• Experience with Next.js\n• Strong CSS/Tailwind skills',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      categoryId: createdCategories['engineering'],
      postedById: admin.id,
    },
    {
      title: 'UI/UX Designer',
      company: 'Creative Studios',
      location: 'Remote',
      type: 'REMOTE' as const,
      salary: 'BDT 60,000 - 90,000/month',
      description: 'Join our design team to create beautiful, intuitive user experiences for our growing SaaS platform. You will own the design process from wireframes to final pixel-perfect mockups.',
      requirements: '• Proficiency in Figma\n• Strong portfolio\n• UX research skills\n• Motion design is a plus',
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      categoryId: createdCategories['design'],
      postedById: admin.id,
    },
    {
      title: 'Digital Marketing Manager',
      company: 'GrowthHack Agency',
      location: 'Chittagong, Bangladesh',
      type: 'FULL_TIME' as const,
      salary: 'BDT 50,000 - 80,000/month',
      description: 'Lead our digital marketing campaigns across SEO, paid ads, and social media. Drive customer acquisition and growth for our clients.',
      requirements: '• 4+ years digital marketing\n• Google Ads certified\n• SEO/SEM expertise\n• Analytics tools proficiency',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      categoryId: createdCategories['marketing'],
      postedById: admin.id,
    },
    {
      title: 'Backend Node.js Developer',
      company: 'StartupHive',
      location: 'Dhaka, Bangladesh',
      type: 'FULL_TIME' as const,
      salary: 'BDT 70,000 - 110,000/month',
      description: 'Build and scale our backend APIs using Node.js, Express, and PostgreSQL. Work on exciting challenges in a fast-paced startup environment.',
      requirements: '• Node.js & Express\n• PostgreSQL/Prisma\n• REST API design\n• Docker knowledge preferred',
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      categoryId: createdCategories['engineering'],
      postedById: admin.id,
    },
    {
      title: 'Data Analyst',
      company: 'DataMind Corp',
      location: 'Remote',
      type: 'PART_TIME' as const,
      salary: 'BDT 40,000 - 60,000/month',
      description: 'Analyze business data to derive actionable insights. Create dashboards and reports for leadership team.',
      requirements: '• Python/SQL proficiency\n• Tableau or Power BI\n• Statistical analysis\n• Excel advanced skills',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      categoryId: createdCategories['data-science'],
      postedById: admin.id,
    },
    {
      title: 'Product Manager',
      company: 'Innova Tech',
      location: 'Sylhet, Bangladesh',
      type: 'FULL_TIME' as const,
      salary: 'BDT 90,000 - 140,000/month',
      description: 'Own the product roadmap and work with engineering and design teams to deliver world-class features. Drive strategy and execution.',
      requirements: '• 3+ years PM experience\n• Agile/Scrum expertise\n• Strong analytical skills\n• Excellent communication',
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      categoryId: createdCategories['product'],
      postedById: admin.id,
    },
  ];

  for (const job of jobs) {
    await prisma.jobPost.create({ data: job });
  }
  console.log('✅ Sample jobs created:', jobs.length);

  console.log('\n🎉 Database seeding complete!');
  console.log('📧 Admin login: admin@quickhire.com / Admin@123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
