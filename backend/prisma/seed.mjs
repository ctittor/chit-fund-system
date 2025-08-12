// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.bid.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.emiDetail.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.chit.deleteMany();

  // Super Admin
  const superAdminUser = await prisma.user.create({
    data: {
      email: 'superadmin@chitfund.com',
      password: faker.internet.password(),
      role: 'SUPER_ADMIN'
    }
  });

  // Admins
  for (let i = 0; i < 2; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'ADMIN'
      }
    });
    await prisma.admin.create({
      data: {
        name: faker.person.fullName(),
        userId: user.id
      }
    });
  }

  // Customers
  const customerUsers = [];
  for (let i = 0; i < 100; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'CUSTOMER'
      }
    });
    const customer = await prisma.customer.create({
      data: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        userId: user.id
      }
    });
    customerUsers.push(customer);
  }

  // Chits
  const chits = [];
  for (let i = 0; i < 5; i++) {
    const chit = await prisma.chit.create({
      data: {
        name: `Chit Group ${i + 1}`,
        totalAmount: 50000,
        duration: 10,
        installment: 5000
      }
    });
    chits.push(chit);
  }

  // Subscriptions & EMIs
  for (const customer of customerUsers) {
    const chit = chits[Math.floor(Math.random() * chits.length)];

    await prisma.subscription.create({
      data: {
        customerId: customer.id,
        chitId: chit.id,
        startDate: faker.date.past(),
        status: 'ACTIVE'
      }
    });

    for (let i = 0; i < chit.duration; i++) {
      await prisma.emiDetail.create({
        data: {
          customerId: customer.id,
          chitId: chit.id,
          amount: chit.installment,
          dueDate: faker.date.future(),
          status: faker.helpers.arrayElement(['PAID', 'PENDING', 'MISSED'])
        }
      });
    }
  }

  // Auctions & Bids
  for (const chit of chits) {
    for (let i = 0; i < 5; i++) {
      const auction = await prisma.auction.create({
        data: {
          chitId: chit.id,
          auctionDate: faker.date.future(),
          status: faker.helpers.arrayElement(['SCHEDULED', 'COMPLETED'])
        }
      });

      const shuffledCustomers = faker.helpers.shuffle(customerUsers).slice(0, 10);
      for (const customer of shuffledCustomers) {
        await prisma.bid.create({
          data: {
            auctionId: auction.id,
            customerId: customer.id,
            amount: faker.number.int({ min: 1000, max: 5000 })
          }
        });
      }
    }
  }

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
