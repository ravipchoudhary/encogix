require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db } = require('./lib/mysql');

async function main() {
  if ((await db.admin.count()) === 0) {
    await db.admin.create({ data: { username: process.env.ADMIN_USERNAME || 'admin', password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10), active: true } });
  }
  if ((await db.chatbotSetting.findUnique({ where: { id: 1 } })) === null) {
    await db.chatbotSetting.create({ data: { id: 1, data: JSON.stringify({ overrides: {} }) } });
  }
  await db.$disconnect();
}

main().catch((error) => { console.error(error); process.exit(1); });
