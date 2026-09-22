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
  const [internshipColumns] = await pool.query(
    'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = \'internship_applications\''
  );
  const existingInternshipColumns = new Set(internshipColumns.map((column) => column.COLUMN_NAME));
  const internshipMigrations = [
    ['registration_id', 'ALTER TABLE internship_applications ADD COLUMN registration_id VARCHAR(32) UNIQUE'],
    ['payment_amount', 'ALTER TABLE internship_applications ADD COLUMN payment_amount DECIMAL(10,2) NULL'],
    ['payment_status', 'ALTER TABLE internship_applications ADD COLUMN payment_status VARCHAR(32) NOT NULL DEFAULT \'pending\''],
    ['payment_id', 'ALTER TABLE internship_applications ADD COLUMN payment_id VARCHAR(191) NULL'],
    ['order_id', 'ALTER TABLE internship_applications ADD COLUMN order_id VARCHAR(191) NULL'],
  ];
  for (const [column, statement] of internshipMigrations) {
    if (!existingInternshipColumns.has(column)) await pool.query(statement);
  }
  const [testimonialColumns] = await pool.query(
    'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = \'testimonials\''
  );
  const existingTestimonialColumns = new Set(testimonialColumns.map((column) => column.COLUMN_NAME));
  if (!existingTestimonialColumns.has('logo')) {
    await pool.query('ALTER TABLE testimonials ADD COLUMN logo VARCHAR(500) NULL');
  }
  await pool.end();
  console.log('MySQL schema is ready');
}

main().catch((error) => { console.error('MySQL setup failed:', error.message); process.exit(1); });
