require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const next = require('next');

const initSqlJs = require('sql.js');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, 'frontend') });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_change_me';

const dbPath = path.join(__dirname, 'backend', 'database', 'encogix.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.bin';
    cb(null, file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  },
});
const upload = multer({ storage });

let db;
let saveDb;

function dbRun(sql, params = []) {
  db.run(sql, params);
  saveDb();
}
function dbGet(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) row = stmt.getAsObject();
  stmt.free();
  return row;
}
function dbAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}
function dbLastId() {
  const r = db.exec('SELECT last_insert_rowid() as id');
  return r[0] && r[0].values[0] ? r[0].values[0][0] : 0;
}

function initDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, message TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, image TEXT, category TEXT);
    CREATE TABLE IF NOT EXISTS blogs (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, author TEXT, image TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, location TEXT, experience TEXT, description TEXT);
    CREATE TABLE IF NOT EXISTS job_applications (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, resume TEXT, message TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS internship_applications (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, internship_type TEXT, resume TEXT, message TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS chatbot_settings (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT);
    CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, employee_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, email TEXT, phone TEXT, designation TEXT, password TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, employee_id INTEGER NOT NULL, date TEXT NOT NULL, punch_in TEXT, punch_out TEXT, UNIQUE(employee_id, date));
    CREATE TABLE IF NOT EXISTS leave_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, employee_id INTEGER NOT NULL, from_date TEXT, to_date TEXT, reason TEXT, status TEXT DEFAULT 'pending', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS announcements (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS chat_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
  `);
  const row = dbGet('SELECT COUNT(*) as count FROM admins');
  if (row && row.count === 0) {
    const u = process.env.ADMIN_USERNAME || 'admin';
    const p = process.env.ADMIN_PASSWORD || 'admin123';
    db.run('INSERT INTO admins (username, password) VALUES (?, ?)', [u, bcrypt.hashSync(p, 10)]);
    console.log('Default admin: username=' + u + ', password=' + p);
  }
  try { db.run('ALTER TABLE blogs ADD COLUMN image TEXT'); saveDb(); } catch (_) {}
  try { db.run('ALTER TABLE internship_applications ADD COLUMN college TEXT'); saveDb(); } catch (_) {}
  try { db.run('ALTER TABLE internship_applications ADD COLUMN course TEXT'); saveDb(); } catch (_) {}
  try { db.run('ALTER TABLE admins ADD COLUMN active INTEGER DEFAULT 1'); saveDb(); } catch (_) {}
  try { db.run('ALTER TABLE employees ADD COLUMN dob TEXT'); saveDb(); } catch (_) {}
  try { db.run('ALTER TABLE employees ADD COLUMN join_date TEXT'); saveDb(); } catch (_) {}
  try { db.run('ALTER TABLE employees ADD COLUMN username TEXT'); saveDb(); } catch (_) {}
  try { db.run('CREATE TABLE IF NOT EXISTS greetings (id INTEGER PRIMARY KEY AUTOINCREMENT, from_employee_id INTEGER NOT NULL, to_employee_id INTEGER NOT NULL, occasion TEXT, message TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)'); saveDb(); } catch (_) {}
  try { db.run('ALTER TABLE attendance ADD COLUMN punch_in_location TEXT'); saveDb(); } catch (_) {}
  try { db.run('ALTER TABLE attendance ADD COLUMN punch_out_location TEXT'); saveDb(); } catch (_) {}
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid Authorization header' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function employeeAuthMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid Authorization header' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'employee') return res.status(401).json({ message: 'Invalid token' });
    req.employee = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

async function main() {
  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    db = new SQL.Database();
  }
  saveDb = () => fs.writeFileSync(dbPath, Buffer.from(db.export()));

  initDb();

  await app.prepare();

  const server = express();
  server.use(express.json());
  server.use('/uploads', express.static(uploadDir));

  server.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;
    try {
      dbRun('INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)', [name, email, phone, message]);
      res.status(201).json({ message: 'Contact submission received' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to save contact' });
    }
  });

  server.get('/api/projects', (req, res) => {
    try {
      res.json(dbAll('SELECT * FROM projects'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  server.get('/api/blogs', (req, res) => {
    try {
      res.json(dbAll('SELECT * FROM blogs ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch blogs' });
    }
  });

  server.get('/api/blogs/:id', (req, res) => {
    try {
      const blog = dbGet('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.json(blog);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch blog' });
    }
  });

  server.get('/api/jobs', (req, res) => {
    try {
      res.json(dbAll('SELECT * FROM jobs'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch jobs' });
    }
  });

  server.post('/api/jobs/apply', upload.single('resume'), (req, res) => {
    const { name, email, phone, current_company, current_salary, expected_salary, experience, notice_period, message } = req.body;
    const resumePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      dbRun('INSERT INTO job_applications (name, email, phone, current_company, current_salary, expected_salary, experience, notice_period, resume, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name || '', email || '', phone || '', current_company || '', current_salary || '', expected_salary || '', experience || '', notice_period || '', resumePath, message || '']);
      res.status(201).json({ message: 'Application submitted successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to submit application' });
    }
  });

  server.post('/api/internships/apply', upload.single('resume'), (req, res) => {
    const { name, email, phone, internship_type, college, course, message } = req.body;
    const resumePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      dbRun('INSERT INTO internship_applications (name, email, phone, internship_type, college, course, resume, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, email, phone, internship_type || '', college || '', course || '', resumePath, message || '']);
      res.status(201).json({ message: 'Internship application submitted successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to submit internship application' });
    }
  });

  server.post('/api/chatbot', (req, res) => {
    const lower = ((req.body && req.body.message) || '').toLowerCase();
    let reply = 'Thank you for reaching out to Encogix Technology. You can ask me about our services, careers, internships, or how to contact us.';
    if (lower.includes('service') || lower.includes('offer')) reply = 'Encogix Technology offers Software Development, Web Development, Mobile App Development, Digital Marketing, Cloud Solutions, and IT Consulting.';
    else if (lower.includes('intern') || lower.includes('internship')) reply = 'We offer internships in Web Development, Software Development, UI/UX Design, and Digital Marketing. Visit the Internship page to learn more and apply.';
    else if (lower.includes('career') || lower.includes('job') || lower.includes('opening')) reply = 'Our Careers page lists current job openings at Encogix Technology. You can apply directly through each job listing.';
    else if (lower.includes('contact') || lower.includes('email') || lower.includes('phone')) reply = 'You can contact Encogix Technology via the Contact page form or email us at contact@encogix.com.';
    try {
      const row = dbGet('SELECT data FROM chatbot_settings WHERE id = 1');
      if (row && row.data) {
        const o = JSON.parse(row.data);
        if (o && o.overrides) {
          for (const k of Object.keys(o.overrides)) {
            if (lower.includes(k.toLowerCase())) { reply = o.overrides[k]; break; }
          }
        }
      }
    } catch (_) {}
    res.json({ reply });
  });

  server.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    try {
      const admin = dbGet('SELECT * FROM admins WHERE username = ?', [username]);
      if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ message: 'Invalid credentials' });
      if (admin.active === 0) return res.status(401).json({ message: 'Account is blocked' });
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token });
    } catch (e) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  server.post('/api/admin/create-admin', authMiddleware, (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || username.trim().length < 3 || password.length < 6) {
      return res.status(400).json({ message: 'Username (min 3 chars) and password (min 6 chars) required' });
    }
    try {
      const exists = dbGet('SELECT 1 FROM admins WHERE username = ?', [username.trim()]);
      if (exists) return res.status(400).json({ message: 'Username already exists' });
      const hash = bcrypt.hashSync(password, 10);
      dbRun('INSERT INTO admins (username, password, active) VALUES (?, ?, 1)', [username.trim(), hash]);
      res.status(201).json({ message: 'Admin created successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create admin' });
    }
  });

  server.get('/api/admin/list-admins', authMiddleware, (req, res) => {
    try {
      res.json(dbAll('SELECT id, username, active FROM admins ORDER BY id'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch admins' });
    }
  });
  server.put('/api/admin/admins/:id/block', authMiddleware, (req, res) => {
    try {
      dbRun('UPDATE admins SET active = 0 WHERE id = ?', [req.params.id]);
      res.json({ message: 'Admin blocked' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to block admin' });
    }
  });
  server.put('/api/admin/admins/:id/unblock', authMiddleware, (req, res) => {
    try {
      dbRun('UPDATE admins SET active = 1 WHERE id = ?', [req.params.id]);
      res.json({ message: 'Admin unblocked' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to unblock admin' });
    }
  });
  server.delete('/api/admin/admins/:id', authMiddleware, (req, res) => {
    try {
      dbRun('DELETE FROM admins WHERE id = ?', [req.params.id]);
      res.json({ message: 'Admin deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete admin' });
    }
  });
  server.put('/api/admin/admins/:id/change-password', authMiddleware, (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    try {
      const hash = bcrypt.hashSync(password, 10);
      dbRun('UPDATE admins SET password = ? WHERE id = ?', [hash, req.params.id]);
      res.json({ message: 'Password updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update password' });
    }
  });

  server.get('/api/admin/stats', authMiddleware, (req, res) => {
    try {
      const g = (t) => (dbGet('SELECT COUNT(*) as c FROM ' + t) || {}).c || 0;
      res.json({
        totalLeads: g('contacts'),
        totalJobApplications: g('job_applications'),
        totalInternshipApplications: g('internship_applications'),
        totalBlogPosts: g('blogs'),
        totalProjects: g('projects'),
      });
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  server.get('/api/admin/leads', authMiddleware, (req, res) => {
    try {
      res.json(dbAll('SELECT * FROM contacts ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch leads' });
    }
  });
  server.get('/api/admin/job-applications', authMiddleware, (req, res) => {
    try {
      res.json(dbAll('SELECT * FROM job_applications ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch job applications' });
    }
  });
  server.get('/api/admin/internship-applications', authMiddleware, (req, res) => {
    try {
      res.json(dbAll('SELECT * FROM internship_applications ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch internship applications' });
    }
  });

  server.post('/api/admin/blogs', authMiddleware, upload.single('image'), (req, res) => {
    const { title, content, author } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      dbRun('INSERT INTO blogs (title, content, author, image) VALUES (?, ?, ?, ?)', [title, content, author, imagePath]);
      res.status(201).json({ id: dbLastId() });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create blog' });
    }
  });
  server.put('/api/admin/blogs/:id', authMiddleware, upload.single('image'), (req, res) => {
    const { title, content, author } = req.body;
    try {
      const ex = dbGet('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
      if (!ex) return res.status(404).json({ message: 'Blog not found' });
      const img = req.file ? '/uploads/' + req.file.filename : (ex.image || null);
      dbRun('UPDATE blogs SET title = ?, content = ?, author = ?, image = ? WHERE id = ?', [title, content, author, img, req.params.id]);
      res.json({ message: 'Blog updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update blog' });
    }
  });
  server.delete('/api/admin/blogs/:id', authMiddleware, (req, res) => {
    try {
      dbRun('DELETE FROM blogs WHERE id = ?', [req.params.id]);
      res.json({ message: 'Blog deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete blog' });
    }
  });

  server.post('/api/admin/projects', authMiddleware, upload.single('image'), (req, res) => {
    const { title, description, category } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      dbRun('INSERT INTO projects (title, description, image, category) VALUES (?, ?, ?, ?)', [title, description, imagePath, category]);
      res.status(201).json({ id: dbLastId() });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create project' });
    }
  });
  server.put('/api/admin/projects/:id', authMiddleware, upload.single('image'), (req, res) => {
    const { title, description, category } = req.body;
    try {
      const ex = dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id]);
      if (!ex) return res.status(404).json({ message: 'Project not found' });
      const img = req.file ? '/uploads/' + req.file.filename : ex.image;
      dbRun('UPDATE projects SET title = ?, description = ?, image = ?, category = ? WHERE id = ?', [title, description, img, category, req.params.id]);
      res.json({ message: 'Project updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update project' });
    }
  });
  server.delete('/api/admin/projects/:id', authMiddleware, (req, res) => {
    try {
      dbRun('DELETE FROM projects WHERE id = ?', [req.params.id]);
      res.json({ message: 'Project deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete project' });
    }
  });

  server.post('/api/admin/jobs', authMiddleware, (req, res) => {
    const { title, location, experience, description } = req.body;
    try {
      dbRun('INSERT INTO jobs (title, location, experience, description) VALUES (?, ?, ?, ?)', [title, location, experience, description]);
      res.status(201).json({ id: dbLastId() });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create job' });
    }
  });
  server.put('/api/admin/jobs/:id', authMiddleware, (req, res) => {
    const { title, location, experience, description } = req.body;
    try {
      dbRun('UPDATE jobs SET title = ?, location = ?, experience = ?, description = ? WHERE id = ?', [title, location, experience, description, req.params.id]);
      res.json({ message: 'Job updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update job' });
    }
  });
  server.delete('/api/admin/jobs/:id', authMiddleware, (req, res) => {
    try {
      dbRun('DELETE FROM jobs WHERE id = ?', [req.params.id]);
      res.json({ message: 'Job deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete job' });
    }
  });

  server.get('/api/admin/chatbot-settings', authMiddleware, (req, res) => {
    try {
      const row = dbGet('SELECT data FROM chatbot_settings WHERE id = 1');
      res.json(row && row.data ? JSON.parse(row.data) : {});
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch chatbot settings' });
    }
  });
  server.post('/api/employee/login', (req, res) => {
    const { employee_id, password } = req.body;
    if (!employee_id || !password) return res.status(400).json({ message: 'Employee ID and password required' });
    try {
      const emp = dbGet('SELECT * FROM employees WHERE employee_id = ?', [employee_id.trim()]);
      if (!emp || !bcrypt.compareSync(password, emp.password)) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: emp.id, employee_id: emp.employee_id, type: 'employee' }, JWT_SECRET, { expiresIn: '12h' });
      res.json({ token, employee: { id: emp.id, employee_id: emp.employee_id, name: emp.name, designation: emp.designation } });
    } catch (e) {
      res.status(500).json({ message: 'Login failed' });
    }
  });
  server.post('/api/employee/punch-in', employeeAuthMiddleware, (req, res) => {
    try {
      const empId = req.employee.id;
      const date = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      const loc = (req.body?.latitude != null && req.body?.longitude != null)
        ? `${req.body.latitude},${req.body.longitude}` : null;
      const row = dbGet('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', [empId, date]);
      if (row && row.punch_in) return res.status(400).json({ message: 'Already punched in today' });
      if (row) dbRun('UPDATE attendance SET punch_in = ?, punch_in_location = ? WHERE employee_id = ? AND date = ?', [now, loc, empId, date]);
      else dbRun('INSERT INTO attendance (employee_id, date, punch_in, punch_in_location) VALUES (?, ?, ?, ?)', [empId, date, now, loc]);
      res.json({ message: 'Punched in', punch_in: now, punch_in_location: loc });
    } catch (e) {
      res.status(500).json({ message: 'Failed to punch in' });
    }
  });
  server.post('/api/employee/punch-out', employeeAuthMiddleware, (req, res) => {
    try {
      const empId = req.employee.id;
      const date = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      const loc = (req.body?.latitude != null && req.body?.longitude != null)
        ? `${req.body.latitude},${req.body.longitude}` : null;
      const row = dbGet('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', [empId, date]);
      if (!row || !row.punch_in) return res.status(400).json({ message: 'Punch in first' });
      if (row.punch_out) return res.status(400).json({ message: 'Already punched out today' });
      dbRun('UPDATE attendance SET punch_out = ?, punch_out_location = ? WHERE employee_id = ? AND date = ?', [now, loc, empId, date]);
      res.json({ message: 'Punched out', punch_out: now, punch_out_location: loc });
    } catch (e) {
      res.status(500).json({ message: 'Failed to punch out' });
    }
  });
  server.get('/api/employee/today', employeeAuthMiddleware, (req, res) => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const row = dbGet('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', [req.employee.id, date]);
      res.json(row || { punch_in: null, punch_out: null });
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });
  server.get('/api/employee/attendance', employeeAuthMiddleware, (req, res) => {
    try {
      const rows = dbAll('SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC LIMIT 30', [req.employee.id]);
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch attendance' });
    }
  });
  server.get('/api/employee/profile', employeeAuthMiddleware, (req, res) => {
    try {
      const emp = dbGet('SELECT id, employee_id, name, username, email, phone, designation, dob, join_date, created_at FROM employees WHERE id = ?', [req.employee.id]);
      if (!emp) return res.status(404).json({ message: 'Not found' });
      res.json(emp);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  });
  server.put('/api/employee/profile', employeeAuthMiddleware, (req, res) => {
    const { username, email, phone, dob } = req.body;
    try {
      dbRun('UPDATE employees SET username = ?, email = ?, phone = ?, dob = ? WHERE id = ?', [username || null, email || '', phone || '', dob || null, req.employee.id]);
      res.json({ message: 'Profile updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update' });
    }
  });
  server.get('/api/employee/celebrations', employeeAuthMiddleware, (req, res) => {
    try {
      const today = new Date();
      const mmdd = (m, d) => String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const todayStr = mmdd(today.getMonth() + 1, today.getDate());
      const all = dbAll('SELECT id, employee_id, name, dob, join_date FROM employees WHERE dob IS NOT NULL OR join_date IS NOT NULL');
      const birthdays = all.filter((e) => e.dob && e.dob.length >= 10 && e.dob.slice(5, 10) === todayStr);
      const anniversaries = all.filter((e) => e.join_date && e.join_date.length >= 10 && e.join_date.slice(5, 10) === todayStr);
      const upcomingBdays = [];
      const upcomingAnniv = [];
      for (let i = 1; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const str = mmdd(d.getMonth() + 1, d.getDate());
        all.filter((e) => e.dob && e.dob.length >= 10 && e.dob.slice(5, 10) === str).forEach((e) => upcomingBdays.push({ ...e, date: str, daysAway: i }));
        all.filter((e) => e.join_date && e.join_date.length >= 10 && e.join_date.slice(5, 10) === str).forEach((e) => upcomingAnniv.push({ ...e, date: str, daysAway: i }));
      }
      res.json({ birthdays, anniversaries, upcoming: { birthdays: upcomingBdays, anniversaries: upcomingAnniv } });
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.get('/api/employee/greetings', employeeAuthMiddleware, (req, res) => {
    try {
      let toId = req.query.to;
      if (toId === 'me') toId = req.employee.id;
      let rows;
      if (toId) rows = dbAll('SELECT g.*, e.name as from_name FROM greetings g JOIN employees e ON g.from_employee_id = e.id WHERE g.to_employee_id = ? ORDER BY g.created_at DESC LIMIT 50', [toId]);
      else rows = dbAll('SELECT g.*, e1.name as from_name, e2.name as to_name FROM greetings g JOIN employees e1 ON g.from_employee_id = e1.id JOIN employees e2 ON g.to_employee_id = e2.id ORDER BY g.created_at DESC LIMIT 50');
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.post('/api/employee/greet', employeeAuthMiddleware, (req, res) => {
    const { to_employee_id, occasion, message } = req.body;
    if (!to_employee_id || !occasion) return res.status(400).json({ message: 'To employee and occasion required' });
    try {
      dbRun('INSERT INTO greetings (from_employee_id, to_employee_id, occasion, message) VALUES (?, ?, ?, ?)', [req.employee.id, to_employee_id, occasion, (message || '').substring(0, 500)]);
      res.status(201).json({ id: dbLastId(), message: 'Greeting sent' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to send' });
    }
  });
  server.get('/api/employee/leave', employeeAuthMiddleware, (req, res) => {
    try {
      const rows = dbAll('SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC', [req.employee.id]);
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch leave' });
    }
  });
  server.post('/api/employee/leave', employeeAuthMiddleware, (req, res) => {
    const { from_date, to_date, reason } = req.body;
    if (!from_date || !to_date) return res.status(400).json({ message: 'From date and to date required' });
    try {
      dbRun('INSERT INTO leave_requests (employee_id, from_date, to_date, reason, status) VALUES (?, ?, ?, ?, ?)', [req.employee.id, from_date, to_date, reason || '', 'pending']);
      res.status(201).json({ id: dbLastId(), message: 'Leave request submitted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to submit' });
    }
  });
  server.get('/api/employee/announcements', employeeAuthMiddleware, (req, res) => {
    try {
      const rows = dbAll('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 50');
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });
  server.get('/api/employee/chat', employeeAuthMiddleware, (req, res) => {
    try {
      const rows = dbAll('SELECT * FROM chat_messages ORDER BY created_at ASC LIMIT 100');
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });
  server.post('/api/employee/chat', employeeAuthMiddleware, (req, res) => {
    const { username, message } = req.body;
    if (!username || !message || !username.trim()) return res.status(400).json({ message: 'Username and message required' });
    try {
      dbRun('INSERT INTO chat_messages (username, message) VALUES (?, ?)', [username.trim().substring(0, 50), String(message).trim().substring(0, 500)]);
      res.status(201).json({ id: dbLastId(), message: 'Sent' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to send' });
    }
  });

  server.get('/api/admin/employees', authMiddleware, (req, res) => {
    try {
      res.json(dbAll('SELECT id, employee_id, name, email, phone, designation, dob, join_date, created_at FROM employees ORDER BY id'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch employees' });
    }
  });
  server.post('/api/admin/employees', authMiddleware, (req, res) => {
    const { employee_id, name, email, phone, designation, password, dob, join_date } = req.body;
    if (!employee_id || !name || !password) return res.status(400).json({ message: 'Employee ID, name and password required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    try {
      const exists = dbGet('SELECT 1 FROM employees WHERE employee_id = ?', [employee_id.trim()]);
      if (exists) return res.status(400).json({ message: 'Employee ID already exists' });
      const hash = bcrypt.hashSync(password, 10);
      dbRun('INSERT INTO employees (employee_id, name, email, phone, designation, password, dob, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [employee_id.trim(), name.trim(), email || '', phone || '', designation || '', hash, dob || null, join_date || null]);
      res.status(201).json({ id: dbLastId(), message: 'Employee created' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create employee' });
    }
  });
  server.put('/api/admin/employees/:id', authMiddleware, (req, res) => {
    const { name, email, phone, designation, password, dob, join_date } = req.body;
    try {
      const ex = dbGet('SELECT * FROM employees WHERE id = ?', [req.params.id]);
      if (!ex) return res.status(404).json({ message: 'Employee not found' });
      let sql = 'UPDATE employees SET name = ?, email = ?, phone = ?, designation = ?, dob = ?, join_date = ?';
      const params = [name || ex.name, email || ex.email, phone || ex.phone, designation || ex.designation, dob !== undefined ? (dob || null) : ex.dob, join_date !== undefined ? (join_date || null) : ex.join_date];
      if (password && password.length >= 6) {
        sql += ', password = ?';
        params.push(bcrypt.hashSync(password, 10));
      }
      sql += ' WHERE id = ?';
      params.push(req.params.id);
      dbRun(sql, params);
      res.json({ message: 'Employee updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update employee' });
    }
  });
  server.delete('/api/admin/employees/:id', authMiddleware, (req, res) => {
    try {
      dbRun('DELETE FROM employees WHERE id = ?', [req.params.id]);
      dbRun('DELETE FROM attendance WHERE employee_id = ?', [req.params.id]);
      res.json({ message: 'Employee deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete employee' });
    }
  });
  server.get('/api/admin/announcements', authMiddleware, (req, res) => {
    try {
      res.json(dbAll('SELECT * FROM announcements ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.post('/api/admin/announcements', authMiddleware, (req, res) => {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    try {
      dbRun('INSERT INTO announcements (title, content) VALUES (?, ?)', [title, content || '']);
      res.status(201).json({ id: dbLastId() });
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.delete('/api/admin/announcements/:id', authMiddleware, (req, res) => {
    try {
      dbRun('DELETE FROM announcements WHERE id = ?', [req.params.id]);
      res.json({ message: 'Deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.get('/api/admin/leave-requests', authMiddleware, (req, res) => {
    try {
      const rows = dbAll(`
        SELECT l.*, e.employee_id, e.name, e.designation
        FROM leave_requests l
        JOIN employees e ON l.employee_id = e.id
        ORDER BY l.created_at DESC
      `);
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.put('/api/admin/leave-requests/:id', authMiddleware, (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    try {
      dbRun('UPDATE leave_requests SET status = ? WHERE id = ?', [status, req.params.id]);
      res.json({ message: 'Updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.get('/api/admin/attendance', authMiddleware, (req, res) => {
    try {
      const rows = dbAll(`
        SELECT a.id, a.date, a.punch_in, a.punch_out, e.employee_id, e.name, e.designation
        FROM attendance a
        JOIN employees e ON a.employee_id = e.id
        ORDER BY a.date DESC, a.punch_in DESC
        LIMIT 500
      `);
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch attendance' });
    }
  });

  server.post('/api/admin/chatbot-settings', authMiddleware, (req, res) => {
    try {
      const data = JSON.stringify(req.body || {});
      const exists = dbGet('SELECT 1 FROM chatbot_settings WHERE id = 1');
      if (exists) {
        dbRun('UPDATE chatbot_settings SET data = ? WHERE id = 1', [data]);
      } else {
        dbRun('INSERT INTO chatbot_settings (id, data) VALUES (1, ?)', [data]);
      }
      res.json({ message: 'Chatbot settings updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update chatbot settings' });
    }
  });

  server.all('*', (req, res) => handle(req, res));

  server.listen(PORT, () => {
    console.log('Encogix running at http://localhost:' + PORT);
  });
}

main().catch(console.error);
