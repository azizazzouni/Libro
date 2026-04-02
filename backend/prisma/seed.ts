import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@librostore.com' },
    update: {},
    create: {
      email: 'admin@librostore.com',
      name: 'Admin',
      passwordHash: await bcrypt.hash('Admin1234!', 12),
      role: 'ADMIN',
    },
  });

  // Test customer
  await prisma.user.upsert({
    where: { email: 'user@librostore.com' },
    update: {},
    create: {
      email: 'user@librostore.com',
      name: 'Test User',
      passwordHash: await bcrypt.hash('User1234!', 12),
      role: 'CUSTOMER',
    },
  });

  // Categories
  const fiction = await prisma.category.upsert({
    where: { slug: 'fiction' },
    update: {},
    create: { name: 'Fiction', slug: 'fiction', description: 'Fictional literature' },
  });

  const scifi = await prisma.category.upsert({
    where: { slug: 'science-fiction' },
    update: {},
    create: { name: 'Science Fiction', slug: 'science-fiction', parentId: fiction.id },
  });

  const nonFiction = await prisma.category.upsert({
    where: { slug: 'non-fiction' },
    update: {},
    create: { name: 'Non-Fiction', slug: 'non-fiction' },
  });

  // Authors
  const tolkien = await prisma.author.upsert({
    where: { slug: 'j-r-r-tolkien' },
    update: {},
    create: { name: 'J.R.R. Tolkien', slug: 'j-r-r-tolkien', bio: 'English author and philologist' },
  });

  const orwell = await prisma.author.upsert({
    where: { slug: 'george-orwell' },
    update: {},
    create: { name: 'George Orwell', slug: 'george-orwell', bio: 'English novelist and essayist' },
  });

  // Books
  const lotr = await prisma.book.upsert({
    where: { slug: 'the-lord-of-the-rings' },
    update: {},
    create: {
      title: 'The Lord of the Rings',
      slug: 'the-lord-of-the-rings',
      description: 'An epic high-fantasy novel set in Middle-earth.',
      isbn: '978-0-261-10236-1',
      price: 24.99,
      stock: 50,
      language: 'en',
      pages: 1178,
      authorId: tolkien.id,
      categories: { create: [{ categoryId: fiction.id }] },
    },
  });

  await prisma.book.upsert({
    where: { slug: 'nineteen-eighty-four' },
    update: {},
    create: {
      title: 'Nineteen Eighty-Four',
      slug: 'nineteen-eighty-four',
      description: 'A dystopian social science fiction novel.',
      isbn: '978-0-14-103614-4',
      price: 12.99,
      stock: 30,
      language: 'en',
      pages: 328,
      authorId: orwell.id,
      categories: { create: [{ categoryId: fiction.id }, { categoryId: scifi.id }] },
    },
  });

  console.log('✅ Seed complete!');
  console.log('   Admin: admin@librostore.com / Admin1234!');
  console.log('   User:  user@librostore.com / User1234!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
