const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

const tableNames = {
  admin: 'admins', contact: 'contacts', project: 'projects', blog: 'blogs', job: 'jobs',
  jobApplication: 'job_applications', internshipApplication: 'internship_applications',
  chatbotSetting: 'chatbot_settings', employee: 'employees', attendance: 'attendance',
  leaveRequest: 'leave_requests', announcement: 'announcements', greeting: 'greetings',
  conversation: 'conversations', conversationParticipant: 'conversation_participants',
  conversationMessage: 'conversation_messages', testimonial: 'testimonials', service: 'services',
};

const fieldNames = {
  employeeId: 'employee_id', assignedEmployeeId: 'assigned_employee_id', createdAt: 'created_at',
  projectUrl: 'project_url', currentCompany: 'current_company', currentSalary: 'current_salary',
  expectedSalary: 'expected_salary', noticePeriod: 'notice_period', internshipType: 'internship_type',
  joinDate: 'join_date', punchIn: 'punch_in', punchOut: 'punch_out', punchInLocation: 'punch_in_location',
  punchOutLocation: 'punch_out_location', fromDate: 'from_date', toDate: 'to_date', fromEmployeeId: 'from_employee_id',
  toEmployeeId: 'to_employee_id', conversationId: 'conversation_id', fromEmployeeId: 'from_employee_id',
  employeeId: 'employee_id', sortOrder: 'sort_order',
};

function column(field) {
  return fieldNames[field] || field.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
}
function table(model) {
  if (!tableNames[model]) throw new Error(`Unknown model: ${model}`);
  return tableNames[model];
}
function valueFor(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value;
}

const rawUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
if (!rawUrl) throw new Error('MYSQL_URL is required. Example: mysql://user:password@host:3306/encogix');
const url = new URL(rawUrl.replace(/^mysql2?:/, 'http:'));
const pool = mysql.createPool({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ''),
  ssl: url.searchParams.get('ssl-mode') === 'REQUIRED' || url.searchParams.get('ssl') === 'true' ? {} : undefined,
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
});

function buildWhere(where = {}, params = []) {
  const parts = [];
  for (const [key, value] of Object.entries(where || {})) {
    if ((key === 'attendance_unique' || key === 'conversation_participant_unique') && value && typeof value === 'object') {
      const nested = buildWhere(value, params);
      if (nested) parts.push(`(${nested})`);
      continue;
    }
    if (key === 'OR') {
      const groups = value.map((item) => buildWhere(item, params)).filter(Boolean);
      if (groups.length) parts.push(`(${groups.join(' OR ')})`);
      continue;
    }
    if (key === 'NOT') {
      const nested = buildWhere(value, params);
      if (nested) parts.push(`NOT (${nested})`);
      continue;
    }
    if (key === 'participants' || key === 'conversation' || key === 'employee' || key === 'assignedEmployee') continue;
    const col = column(key);
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      if (value.not !== undefined) {
        if (value.not === null) parts.push(`\`${col}\` IS NOT NULL`);
        else { parts.push(`\`${col}\` <> ?`); params.push(valueFor(value.not)); }
      } else if (Array.isArray(value.in)) {
        parts.push(`\`${col}\` IN (${value.in.map(() => '?').join(',')})`);
        params.push(...value.in.map(valueFor));
      } else if (value.gte !== undefined || value.lte !== undefined) {
        if (value.gte !== undefined) { parts.push(`\`${col}\` >= ?`); params.push(valueFor(value.gte)); }
        if (value.lte !== undefined) { parts.push(`\`${col}\` <= ?`); params.push(valueFor(value.lte)); }
      } else continue;
    } else if (value === null) parts.push(`\`${col}\` IS NULL`);
    else { parts.push(`\`${col}\` = ?`); params.push(valueFor(value)); }
  }
  return parts.join(' AND ');
}

function selectList(select) {
  if (!select) return '*';
  return Object.keys(select).filter((key) => select[key]).map((key) => `\`${column(key)}\` AS \`${key}\``).join(', ') || '*';
}
function mapRow(row) {
  if (!row) return row;
  const output = {};
  for (const [key, value] of Object.entries(row)) {
    const camel = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    output[camel] = value;
  }
  return output;
}
function mapData(data) {
  return Object.fromEntries(Object.entries(data || {}).filter(([key, value]) => !value || typeof value !== 'object' || value instanceof Date).map(([key, value]) => [column(key), valueFor(value)]));
}

async function find(model, args = {}, single = false) {
  const params = [];
  const where = buildWhere(args.where, params);
  let sql = `SELECT ${selectList(args.select)} FROM \`${table(model)}\``;
  if (where) sql += ` WHERE ${where}`;
  if (args.orderBy) {
    const orders = Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy];
    sql += ' ORDER BY ' + orders.map((o) => `${column(Object.keys(o)[0])} ${String(Object.values(o)[0]).toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`).join(', ');
  }
  if (args.take) sql += ' LIMIT ?';
  if (args.take) params.push(Number(args.take));
  const [rows] = await pool.query(sql, params);
  return single ? mapRow(rows[0]) || null : rows.map(mapRow);
}

function relationRows(model, row, include) {
  if (!include || !row) return Promise.resolve(row);
  const tasks = Object.entries(include).map(async ([relation, options]) => {
    const config = {
      assignedEmployee: ['employee', { id: row.assignedEmployeeId }],
      fromEmployee: ['employee', { id: row.fromEmployeeId }],
      toEmployee: ['employee', { id: row.toEmployeeId }],
    }[relation];
    if (config) row[relation] = await find(config[0], { where: config[1], select: options.select }, true);
    return row;
  });
  return Promise.all(tasks).then(() => row);
}

function modelApi(model) {
  return {
    findUnique: (args) => find(model, args, true).then((row) => relationRows(model, row, args.include)),
    findFirst: (args) => find(model, { ...args, take: 1 }, true).then((row) => relationRows(model, row, args.include)),
    findMany: async (args = {}) => {
      const rows = await find(model, args);
      return Promise.all(rows.map((row) => relationRows(model, row, args.include)));
    },
    count: async (args = {}) => (await find(model, args)).length,
    create: async ({ data }) => {
      const nested = data.participants?.create;
      const fields = mapData(data);
      const keys = Object.keys(fields);
      const [result] = await pool.query(`INSERT INTO \`${table(model)}\` (${keys.map((k) => `\`${k}\``).join(',')}) VALUES (${keys.map(() => '?').join(',')})`, keys.map((key) => fields[key]));
      const row = await find(model, { where: { id: result.insertId } }, true);
      if (nested && model === 'conversation') for (const participant of nested) await modelApi('conversationParticipant').create({ data: { conversationId: result.insertId, ...participant } });
      return row;
    },
    createMany: async ({ data }) => { for (const item of data) await modelApi(model).create({ data: item }); return { count: data.length }; },
    update: async ({ where, data }) => {
      const params = [];
      const condition = buildWhere(where, params);
      const fields = mapData(data);
      const keys = Object.keys(fields);
      await pool.query(`UPDATE \`${table(model)}\` SET ${keys.map((key) => `\`${key}\` = ?`).join(', ')} WHERE ${condition}`, [...keys.map((key) => fields[key]), ...params]);
      return find(model, { where }, true);
    },
    delete: async ({ where }) => { const row = await find(model, { where }, true); const params = []; const condition = buildWhere(where, params); await pool.query(`DELETE FROM \`${table(model)}\` WHERE ${condition}`, params); return row; },
    upsert: async ({ where, update, create }) => { const row = await find(model, { where }, true); return row ? modelApi(model).update({ where, data: update }) : modelApi(model).create({ data: create }); },
  };
}

/** @type {any} */
const db = new Proxy({
  $connect: () => pool.query('SELECT 1'),
  $disconnect: () => pool.end(),
  $queryRaw: () => pool.query('SELECT 1'),
}, { get(target, property) { return target[property] || modelApi(property); } });

module.exports = { db, pool };
