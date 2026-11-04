// require("dotenv").config();


// const bcrypt = require("bcryptjs");
// const prisma = require("../src/lib/prisma");

// async function main() {
//   const passwordHash = await bcrypt.hash("Admin@12345", 12);

//   const admin = await prisma.user.upsert({
//     where: {
//       phone: "9000000000",
//     },
//     update: {
//       role: "ADMIN",
//       passwordHash,
//       isActive: true,
//     },
//     create: {
//       name: "Marketplace Admin",
//       phone: "9000000000",
//       email: "admin@anantnagmarketplace.com",
//       passwordHash,
//       role: "ADMIN",
//       isActive: true,
//     },
//     select: {
//       id: true,
//       name: true,
//       phone: true,
//       email: true,
//       role: true,
//       isActive: true,
//     },
//   });

//   console.log("Admin created/updated:");
//   console.log(admin);
// }

// main()
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


















require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../src/lib/prisma");

async function main() {
  const name = process.env.ADMIN_NAME?.trim();
  const phone = process.env.ADMIN_PHONE?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !phone || !email || !password) {
    throw new Error(
      "Set ADMIN_NAME, ADMIN_PHONE, ADMIN_EMAIL and ADMIN_PASSWORD in .env"
    );
  }

  if (password.length < 14) {
    throw new Error("ADMIN_PASSWORD must be at least 14 characters.");
  }

  const existingPhone = await prisma.user.findUnique({
    where: { phone },
  });

  if (existingPhone) {
    throw new Error(
      "This phone number already exists. No user was changed."
    );
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new Error(
      "This email already exists. No user was changed."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name,
      phone,
      email,
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

  console.log("Admin account created successfully:");
  console.log(admin);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });