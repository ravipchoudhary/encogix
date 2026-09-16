#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { pool } = require('./lib/mysql');

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  for (const statement of schema.split(';').map((item) => item.trim()).filter(Boolean)) {
    await pool.query(statement);
  }
  const [columns] = await pool.query(
    'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = \'contacts\''
  );
  const existingColumns = new Set(columns.map((column) => column.COLUMN_NAME));
  const contactMigrations = [
    ['source', 'ALTER TABLE contacts ADD COLUMN source VARCHAR(100) DEFAULT \'contact\''],
    ['status', 'ALTER TABLE contacts ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT \'new\''],
    ['assigned_employee_id', 'ALTER TABLE contacts ADD COLUMN assigned_employee_id INT NULL'],
    ['notes', 'ALTER TABLE contacts ADD COLUMN notes TEXT'],
  ];
  for (const [column, statement] of contactMigrations) {
    if (!existingColumns.has(column)) await pool.query(statement);
  }
  await pool.end();
  console.log('MySQL schema is ready');
}

main().catch((error) => { console.error('MySQL setup failed:', error.message); process.exit(1); });
