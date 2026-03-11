import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';
import { cloudinary } from '../src/config/cloudinary';
import path from 'path';
import fs from 'fs';

async function uploadToCloudinary(filePath: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `quickhire/${folder}`,
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${filePath} to Cloudinary:`, error);
    return null;
  }
}

async function main() {
  console.log('Clearing existing data...');
  await prisma.application.deleteMany();
  await prisma.jobPost.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Start',
      email: 'admin@quickhire.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const categoryNames = [
    'Design',
    'Sales',
    'Marketing',
    'Finance',
    'Technology',
    'Engineering',
    'Business',
    'Human Resource',
  ];

  // Placeholder SVGs to be used if Cloudinary upload fails or for structure
  const categoryIconsMap: Record<string, string> = {
    'Design': 'Design',
    'Sales': 'Sales',
    'Marketing': 'Marketing',
    'Finance': 'Finance',
    'Technology': 'Technology',
    'Engineering': 'Engineering',
    'Business': 'Business',
    'Human Resource': 'Human Resource',
  };

  console.log('Seeding categories...');
  const categoriesMap: Record<string, any> = {};
  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(' ', '-');
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon: categoryIconsMap[name],
      },
    });
    categoriesMap[name] = category;
  }

  const logosDir = path.join(process.cwd(), '../frontend/public/assets/logos');
  const getLogoPath = (logoName: string) => path.join(logosDir, logoName);

  const featuredJobsData = [
    {
      company: 'Revolut',
      logoFile: 'revolut.png',
      title: 'Email Marketing',
      location: 'Madrid, Spain',
      type: 'FULL_TIME',
      salary: '$30k-40k',
      description: 'Revolut is looking for Email Marketing to help team ma ...',
      tags: ['Marketing', 'Design'],
      isFeatured: true,
      categoryName: 'Marketing',
    },
    {
      company: 'Dropbox',
      logoFile: 'dropbox.png',
      title: 'Brand Designer',
      location: 'San Fransisco, US',
      type: 'FULL_TIME',
      salary: '$50k-70k',
      description: 'Dropbox is looking for Brand Designer to help the team t ...',
      tags: ['Design', 'Business'],
      isFeatured: true,
      categoryName: 'Design',
    },
    {
      company: 'Pitch',
      logoFile: 'pitch.png',
      title: 'Email Marketing',
      location: 'Berlin, Germany',
      type: 'FULL_TIME',
      salary: '$40k-50k',
      description: 'Pitch is looking for Customer Manager to join marketing t ...',
      tags: ['Marketing'],
      isFeatured: true,
      categoryName: 'Marketing',
    },
    {
      company: 'Blinkist',
      logoFile: 'blinkist.png',
      title: 'Visual Designer',
      location: 'Granada, Spain',
      type: 'FULL_TIME',
      salary: '$45k-60k',
      description: 'Blinkist is looking for Visual Designer to help team desi ...',
      tags: ['Design'],
      isFeatured: true,
      categoryName: 'Design',
    },
    {
      company: 'ClassPass',
      logoFile: 'classpass.png',
      title: 'Product Designer',
      location: 'Manchester, UK',
      type: 'FULL_TIME',
      salary: '$60k-80k',
      description: 'ClassPass is looking for Product Designer to help us...',
      tags: ['Marketing', 'Design'],
      isFeatured: true,
      categoryName: 'Design',
    },
    {
      company: 'Canva',
      logoFile: 'canva.png',
      title: 'Lead Designer',
      location: 'Ontario, Canada',
      type: 'FULL_TIME',
      salary: '$80k-100k',
      description: 'Canva is looking for Lead Engineer to help develop n ...',
      tags: ['Design', 'Business'],
      isFeatured: true,
      categoryName: 'Design',
    },
    {
      company: 'GoDaddy',
      logoFile: 'godaddy.png',
      title: 'Brand Designer',
      location: 'San Fransisco, US',
      type: 'FULL_TIME',
      salary: '$60k-75k',
      description: 'GoDaddy is looking for Brand Designer to help us...',
      tags: ['Design'],
      isFeatured: true,
      categoryName: 'Design',
    },
    {
      company: 'Twitter',
      logoFile: 'twitter.png',
      title: 'Frontend Developer',
      location: 'San Fransisco, US',
      type: 'FULL_TIME',
      salary: '$90k-120k',
      description: 'Twitter is looking for Frontend Developer to help us...',
      tags: ['Design', 'Engineering'],
      isFeatured: true,
      categoryName: 'Engineering',
    },
  ];

  const latestJobsData = [
    {
      company: 'Nomad',
      logoFile: 'nomad.png',
      title: 'Social Media Assistant',
      location: 'Paris, France',
      type: 'FULL_TIME',
      salary: '$25k-30k',
      description: 'Social Media Assistant role in Paris, France',
      tags: ['Full-Time', 'Marketing', 'Design'],
      isFeatured: false,
      categoryName: 'Marketing',
    },
    {
      company: 'Netlify',
      logoFile: 'netlify.png',
      title: 'Social Media Assistant',
      location: 'Paris, France',
      type: 'FULL_TIME',
      salary: '$28k-35k',
      description: 'Social Media Assistant role in Netlify',
      tags: ['Full-Time', 'Marketing', 'Design'],
      isFeatured: false,
      categoryName: 'Marketing',
    },
    {
      company: 'Dropbox',
      logoFile: 'dropbox.png',
      title: 'Brand Designer',
      location: 'San Fransisco, USA',
      type: 'FULL_TIME',
      salary: '$65k-80k',
      description: 'Dropbox Brand Designer role',
      tags: ['Full-Time', 'Marketing', 'Design'],
      isFeatured: false,
      categoryName: 'Design',
    },
    {
      company: 'Maze',
      logoFile: 'maze.png',
      title: 'Brand Designer',
      location: 'San Fransisco, USA',
      type: 'FULL_TIME',
      salary: '$70k-85k',
      description: 'Maze is looking for a Brand Designer',
      tags: ['Full-Time', 'Marketing', 'Design'],
      isFeatured: false,
      categoryName: 'Design',
    },
  ];

  const allJobs = [...featuredJobsData, ...latestJobsData];

  console.log('Seeding jobs and uploading logos...');
  for (const job of allJobs) {
    const category = categoriesMap[job.categoryName];
    if (category) {
      let companyLogo = null;
      if (fs.existsSync(getLogoPath(job.logoFile))) {
        companyLogo = await uploadToCloudinary(getLogoPath(job.logoFile), 'logos');
      }

      await prisma.jobPost.create({
        data: {
          title: job.title,
          company: job.company,
          companyLogo: companyLogo,
          location: job.location,
          type: 'FULL_TIME',
          salary: job.salary,
          description: job.description,
          tags: job.tags,
          isFeatured: job.isFeatured,
          categoryId: category.id,
          postedById: adminUser.id,
        },
      });
    }
  }

  console.log('Database seeded successfully with Cloudinary URLs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

