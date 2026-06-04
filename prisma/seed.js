const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const count = await prisma.admin.count();
  if (count === 0) {
    await prisma.admin.create({
      data: {
        username: adminUser,
        password: bcrypt.hashSync(adminPass, 10),
        active: true,
      },
    });
    console.log(`Default admin: username=${adminUser}`);
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: 'Rahul Sharma',
          company: 'RetailKart India',
          designation: 'Founder & CEO',
          rating: 5,
          text: 'Encogix built our ecommerce platform on time and within budget. Sales increased 40% within three months of launch.',
          sortOrder: 1,
        },
        {
          name: 'Priya Mehta',
          company: 'Confidential Client',
          designation: 'Operations Head',
          rating: 5,
          text: 'Their CRM and automation solutions saved our team 15+ hours per week. Professional team and clear communication throughout.',
          sortOrder: 2,
        },
        {
          name: 'Amit Verma',
          company: 'HealthFirst Clinics',
          designation: 'Director',
          rating: 5,
          text: 'From website redesign to SEO, Encogix helped us rank locally in Noida and Greater Noida. Highly recommended IT partner.',
          sortOrder: 3,
        },
      ],
    });
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: 'Ecommerce Platform for Fashion Retailer',
          description: 'Full-stack ecommerce with payment gateway, inventory sync, and admin dashboard.',
          category: 'Ecommerce',
          client: 'Confidential Client',
          industry: 'Retail',
          technologies: 'Next.js, Node.js, PostgreSQL, Razorpay',
          results: '40% increase in online sales, 2.5s average page load',
          slug: 'ecommerce-fashion-retailer',
        },
        {
          title: 'CRM & Lead Management System',
          description: 'Custom CRM with lead assignment, follow-ups, and reporting for sales teams.',
          category: 'Custom Software',
          client: 'Confidential Client',
          industry: 'B2B Services',
          technologies: 'React, Express, PostgreSQL',
          results: '35% faster lead response time',
          slug: 'crm-lead-management',
        },
        {
          title: 'Healthcare Appointment Booking App',
          description: 'Mobile-friendly booking system with doctor schedules and SMS reminders.',
          category: 'Web & Mobile',
          client: 'HealthFirst Clinics',
          industry: 'Healthcare',
          technologies: 'React Native, Node.js, PostgreSQL',
          results: '60% reduction in phone booking calls',
          slug: 'healthcare-appointment-app',
        },
      ],
    });
  }

  await prisma.chatbotSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, data: JSON.stringify({ overrides: {} }) },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
