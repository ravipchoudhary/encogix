#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { pool } = require('./lib/mysql');

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  for (const statement of schema.split(';').map((item) => item.trim()).filter(Boolean)) {
    await pool.query(statement);
  }
  await pool.end();
  console.log('MySQL schema is ready');
}

main().catch((error) => { console.error('MySQL setup failed:', error.message); process.exit(1); });
