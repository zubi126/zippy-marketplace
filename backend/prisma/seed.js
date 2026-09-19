require("dotenv").config();


const bcrypt = require("bcryptjs");
const prisma = require("../src/lib/prisma");

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: {
      phone: "9000000000",
    },
    update: {
      role: "ADMIN",
      passwordHash,
      isActive: true,
    },
    create: {
      name: "Marketplace Admin",
      phone: "9000000000",
      email: "admin@anantnagmarketplace.com",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  console.log("Admin created/updated:");
  console.log(admin);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });