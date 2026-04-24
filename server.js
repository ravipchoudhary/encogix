require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const next = require('next');
const mysql = require('mysql2/promise');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, 'frontend') });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_change_me';

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10);
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'encogix';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

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

let pool;

async function dbRun(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}
async function dbGet(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows[0] || null;
}
async function dbAll(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
async function dbInsert(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result.insertId || 0;
}

async function ensureDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();
  } catch (err) {
    if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error(
        `MySQL access denied for user '${MYSQL_USER}'@'${MYSQL_HOST}'.\n` +
        `Please set valid MySQL credentials in a .env file or environment variables.\n` +
        `Example in .env:\n` +
        `MYSQL_HOST=localhost\n` +
        `MYSQL_PORT=3306\n` +
        `MYSQL_USER=root\n` +
        `MYSQL_PASSWORD=password\n` +
        `MYSQL_DATABASE=encogix`
      );
    }
    throw err;
  }
}

async function initDb() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      active TINYINT(1) DEFAULT 1
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title TEXT,
      description TEXT,
      image TEXT,
      category TEXT
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title TEXT,
      content TEXT,
      author TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title TEXT,
      location TEXT,
      experience TEXT,
      description TEXT
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      current_company TEXT,
      current_salary TEXT,
      expected_salary TEXT,
      experience TEXT,
      notice_period TEXT,
      resume TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS internship_applications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      internship_type TEXT,
      college TEXT,
      course TEXT,
      resume TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS chatbot_settings (
      id INT PRIMARY KEY,
      data TEXT
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS employees (
      id INT PRIMARY KEY AUTO_INCREMENT,
      employee_id VARCHAR(255) UNIQUE NOT NULL,
      name TEXT NOT NULL,
      username VARCHAR(255),
      email TEXT,
      phone TEXT,
      designation TEXT,
      password VARCHAR(255) NOT NULL,
      dob TEXT,
      join_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT PRIMARY KEY AUTO_INCREMENT,
      employee_id INT NOT NULL,
      date DATE NOT NULL,
      punch_in DATETIME,
      punch_out DATETIME,
      punch_in_location TEXT,
      punch_out_location TEXT,
      UNIQUE KEY attendance_unique (employee_id, date)
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS leave_requests (
      id INT PRIMARY KEY AUTO_INCREMENT,
      employee_id INT NOT NULL,
      from_date DATE,
      to_date DATE,
      reason TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS greetings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      from_employee_id INT NOT NULL,
      to_employee_id INT NOT NULL,
      occasion TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      type VARCHAR(50) NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS conversation_participants (
      id INT PRIMARY KEY AUTO_INCREMENT,
      conversation_id INT NOT NULL,
      employee_id INT NOT NULL,
      UNIQUE KEY conversation_participant_unique (conversation_id, employee_id)
    )
  `);
  await dbRun(`
    CREATE TABLE IF NOT EXISTS conversation_messages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      conversation_id INT NOT NULL,
      from_employee_id INT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const row = await dbGet('SELECT COUNT(*) as count FROM admins');
  if (row && Number(row.count) === 0) {
    const u = process.env.ADMIN_USERNAME || 'admin';
    const p = process.env.ADMIN_PASSWORD || 'admin123';
    await dbRun('INSERT INTO admins (username, password, active) VALUES (?, ?, 1)', [u, bcrypt.hashSync(p, 10)]);
    console.log('Default admin: username=' + u + ', password=' + p);
  }
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
  await ensureDatabase();

  pool = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
  });

  await initDb();

  await app.prepare();

  const server = express();
  server.use(express.json());
  server.use('/uploads', express.static(uploadDir));

  server.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;
    try {
      await dbRun('INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)', [name, email, phone, message]);
      res.status(201).json({ message: 'Contact submission received' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to save contact' });
    }
  });

  server.get('/api/projects', async (req, res) => {
    try {
      res.json(await dbAll('SELECT * FROM projects'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  server.get('/api/blogs', async (req, res) => {
    try {
      res.json(await dbAll('SELECT * FROM blogs ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch blogs' });
    }
  });

  server.get('/api/blogs/:id', async (req, res) => {
    try {
      const blog = await dbGet('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.json(blog);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch blog' });
    }
  });

  server.get('/api/jobs', async (req, res) => {
    try {
      res.json(await dbAll('SELECT * FROM jobs'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch jobs' });
    }
  });

  server.post('/api/jobs/apply', upload.single('resume'), async (req, res) => {
    const { name, email, phone, current_company, current_salary, expected_salary, experience, notice_period, message } = req.body;
    const resumePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      await dbRun('INSERT INTO job_applications (name, email, phone, current_company, current_salary, expected_salary, experience, notice_period, resume, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name || '', email || '', phone || '', current_company || '', current_salary || '', expected_salary || '', experience || '', notice_period || '', resumePath, message || '']);
      res.status(201).json({ message: 'Application submitted successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to submit application' });
    }
  });

  server.post('/api/internships/apply', upload.single('resume'), async (req, res) => {
    const { name, email, phone, internship_type, college, course, message } = req.body;
    const resumePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      await dbRun('INSERT INTO internship_applications (name, email, phone, internship_type, college, course, resume, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, email, phone, internship_type || '', college || '', course || '', resumePath, message || '']);
      res.status(201).json({ message: 'Internship application submitted successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to submit internship application' });
    }
  });

  server.post('/api/chatbot', async (req, res) => {
    const lower = ((req.body && req.body.message) || '').toLowerCase();
    let reply = 'Thank you for reaching out to Encogix Technology. You can ask me about our services, careers, internships, or how to contact us.';
    if (lower.includes('service') || lower.includes('offer')) reply = 'Encogix Technology offers Software Development, Web Development, Mobile App Development, Digital Marketing, Cloud Solutions, and IT Consulting.';
    else if (lower.includes('intern') || lower.includes('internship')) reply = 'We offer internships in Web Development, Software Development, UI/UX Design, and Digital Marketing. Visit the Internship page to learn more and apply.';
    else if (lower.includes('career') || lower.includes('job') || lower.includes('opening')) reply = 'Our Careers page lists current job openings at Encogix Technology. You can apply directly through each job listing.';
    else if (lower.includes('contact') || lower.includes('email') || lower.includes('phone')) reply = 'You can contact Encogix Technology via the Contact page form or email us at contact@encogix.com.';
    try {
      const row = await dbGet('SELECT data FROM chatbot_settings WHERE id = 1');
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

  server.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const admin = await dbGet('SELECT * FROM admins WHERE username = ?', [username]);
      if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ message: 'Invalid credentials' });
      if (admin.active === 0) return res.status(401).json({ message: 'Account is blocked' });
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token });
    } catch (e) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  server.post('/api/admin/create-admin', authMiddleware, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || username.trim().length < 3 || password.length < 6) {
      return res.status(400).json({ message: 'Username (min 3 chars) and password (min 6 chars) required' });
    }
    try {
      const exists = await dbGet('SELECT 1 FROM admins WHERE username = ?', [username.trim()]);
      if (exists) return res.status(400).json({ message: 'Username already exists' });
      const hash = bcrypt.hashSync(password, 10);
      await dbRun('INSERT INTO admins (username, password, active) VALUES (?, ?, 1)', [username.trim(), hash]);
      res.status(201).json({ message: 'Admin created successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create admin' });
    }
  });

  server.get('/api/admin/list-admins', authMiddleware, async (req, res) => {
    try {
      res.json(await dbAll('SELECT id, username, active FROM admins ORDER BY id'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch admins' });
    }
  });
  server.put('/api/admin/admins/:id/block', authMiddleware, async (req, res) => {
    try {
      await dbRun('UPDATE admins SET active = 0 WHERE id = ?', [req.params.id]);
      res.json({ message: 'Admin blocked' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to block admin' });
    }
  });
  server.put('/api/admin/admins/:id/unblock', authMiddleware, async (req, res) => {
    try {
      await dbRun('UPDATE admins SET active = 1 WHERE id = ?', [req.params.id]);
      res.json({ message: 'Admin unblocked' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to unblock admin' });
    }
  });
  server.delete('/api/admin/admins/:id', authMiddleware, async (req, res) => {
    try {
      await dbRun('DELETE FROM admins WHERE id = ?', [req.params.id]);
      res.json({ message: 'Admin deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete admin' });
    }
  });
  server.put('/api/admin/admins/:id/change-password', authMiddleware, async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    try {
      const hash = bcrypt.hashSync(password, 10);
      await dbRun('UPDATE admins SET password = ? WHERE id = ?', [hash, req.params.id]);
      res.json({ message: 'Password updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update password' });
    }
  });

  server.get('/api/admin/stats', authMiddleware, async (req, res) => {
    try {
      const g = async (t) => {
        const row = await dbGet('SELECT COUNT(*) as c FROM ' + t);
        return (row && Number(row.c)) || 0;
      };
      res.json({
        totalLeads: await g('contacts'),
        totalJobApplications: await g('job_applications'),
        totalInternshipApplications: await g('internship_applications'),
        totalBlogPosts: await g('blogs'),
        totalProjects: await g('projects'),
      });
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  server.get('/api/admin/leads', authMiddleware, async (req, res) => {
    try {
      res.json(await dbAll('SELECT * FROM contacts ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch leads' });
    }
  });
  server.get('/api/admin/job-applications', authMiddleware, async (req, res) => {
    try {
      res.json(await dbAll('SELECT * FROM job_applications ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch job applications' });
    }
  });
  server.get('/api/admin/internship-applications', authMiddleware, async (req, res) => {
    try {
      res.json(await dbAll('SELECT * FROM internship_applications ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch internship applications' });
    }
  });

  server.post('/api/admin/blogs', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, content, author } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      const id = await dbInsert('INSERT INTO blogs (title, content, author, image) VALUES (?, ?, ?, ?)', [title, content, author, imagePath]);
      res.status(201).json({ id });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create blog' });
    }
  });
  server.put('/api/admin/blogs/:id', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, content, author } = req.body;
    try {
      const ex = await dbGet('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
      if (!ex) return res.status(404).json({ message: 'Blog not found' });
      const img = req.file ? '/uploads/' + req.file.filename : (ex.image || null);
      await dbRun('UPDATE blogs SET title = ?, content = ?, author = ?, image = ? WHERE id = ?', [title, content, author, img, req.params.id]);
      res.json({ message: 'Blog updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update blog' });
    }
  });
  server.delete('/api/admin/blogs/:id', authMiddleware, async (req, res) => {
    try {
      await dbRun('DELETE FROM blogs WHERE id = ?', [req.params.id]);
      res.json({ message: 'Blog deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete blog' });
    }
  });

  server.post('/api/admin/projects', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, description, category } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      const id = await dbInsert('INSERT INTO projects (title, description, image, category) VALUES (?, ?, ?, ?)', [title, description, imagePath, category]);
      res.status(201).json({ id });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create project' });
    }
  });
  server.put('/api/admin/projects/:id', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, description, category } = req.body;
    try {
      const ex = await dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id]);
      if (!ex) return res.status(404).json({ message: 'Project not found' });
      const img = req.file ? '/uploads/' + req.file.filename : ex.image;
      await dbRun('UPDATE projects SET title = ?, description = ?, image = ?, category = ? WHERE id = ?', [title, description, img, category, req.params.id]);
      res.json({ message: 'Project updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update project' });
    }
  });
  server.delete('/api/admin/projects/:id', authMiddleware, async (req, res) => {
    try {
      await dbRun('DELETE FROM projects WHERE id = ?', [req.params.id]);
      res.json({ message: 'Project deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete project' });
    }
  });

  server.post('/api/admin/jobs', authMiddleware, async (req, res) => {
    const { title, location, experience, description } = req.body;
    try {
      const id = await dbInsert('INSERT INTO jobs (title, location, experience, description) VALUES (?, ?, ?, ?)', [title, location, experience, description]);
      res.status(201).json({ id });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create job' });
    }
  });
  server.put('/api/admin/jobs/:id', authMiddleware, async (req, res) => {
    const { title, location, experience, description } = req.body;
    try {
      await dbRun('UPDATE jobs SET title = ?, location = ?, experience = ?, description = ? WHERE id = ?', [title, location, experience, description, req.params.id]);
      res.json({ message: 'Job updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update job' });
    }
  });
  server.delete('/api/admin/jobs/:id', authMiddleware, async (req, res) => {
    try {
      await dbRun('DELETE FROM jobs WHERE id = ?', [req.params.id]);
      res.json({ message: 'Job deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete job' });
    }
  });

  server.get('/api/admin/chatbot-settings', authMiddleware, async (req, res) => {
    try {
      const row = await dbGet('SELECT data FROM chatbot_settings WHERE id = 1');
      res.json(row && row.data ? JSON.parse(row.data) : {});
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch chatbot settings' });
    }
  });
  server.post('/api/employee/login', async (req, res) => {
    const { employee_id, password } = req.body;
    if (!employee_id || !password) return res.status(400).json({ message: 'Employee ID and password required' });
    try {
      const emp = await dbGet('SELECT * FROM employees WHERE employee_id = ?', [employee_id.trim()]);
      if (!emp || !bcrypt.compareSync(password, emp.password)) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: emp.id, employee_id: emp.employee_id, type: 'employee' }, JWT_SECRET, { expiresIn: '12h' });
      res.json({ token, employee: { id: emp.id, employee_id: emp.employee_id, name: emp.name, designation: emp.designation } });
    } catch (e) {
      res.status(500).json({ message: 'Login failed' });
    }
  });
  server.post('/api/employee/punch-in', employeeAuthMiddleware, async (req, res) => {
    try {
      const empId = req.employee.id;
      const date = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      const loc = (req.body?.latitude != null && req.body?.longitude != null)
        ? `${req.body.latitude},${req.body.longitude}` : null;
      const row = await dbGet('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', [empId, date]);
      if (row && row.punch_in) return res.status(400).json({ message: 'Already punched in today' });
      if (row) await dbRun('UPDATE attendance SET punch_in = ?, punch_in_location = ? WHERE employee_id = ? AND date = ?', [now, loc, empId, date]);
      else await dbRun('INSERT INTO attendance (employee_id, date, punch_in, punch_in_location) VALUES (?, ?, ?, ?)', [empId, date, now, loc]);
      res.json({ message: 'Punched in', punch_in: now, punch_in_location: loc });
    } catch (e) {
      res.status(500).json({ message: 'Failed to punch in' });
    }
  });
  server.post('/api/employee/punch-out', employeeAuthMiddleware, async (req, res) => {
    try {
      const empId = req.employee.id;
      const date = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      const loc = (req.body?.latitude != null && req.body?.longitude != null)
        ? `${req.body.latitude},${req.body.longitude}` : null;
      const row = await dbGet('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', [empId, date]);
      if (!row || !row.punch_in) return res.status(400).json({ message: 'Punch in first' });
      if (row.punch_out) return res.status(400).json({ message: 'Already punched out today' });
      await dbRun('UPDATE attendance SET punch_out = ?, punch_out_location = ? WHERE employee_id = ? AND date = ?', [now, loc, empId, date]);
      res.json({ message: 'Punched out', punch_out: now, punch_out_location: loc });
    } catch (e) {
      res.status(500).json({ message: 'Failed to punch out' });
    }
  });
  server.get('/api/employee/today', employeeAuthMiddleware, async (req, res) => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const row = await dbGet('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', [req.employee.id, date]);
      res.json(row || { punch_in: null, punch_out: null });
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });
  server.get('/api/employee/attendance', employeeAuthMiddleware, async (req, res) => {
    try {
      const rows = await dbAll('SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC LIMIT 30', [req.employee.id]);
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch attendance' });
    }
  });
  server.get('/api/employee/profile', employeeAuthMiddleware, async (req, res) => {
    try {
      const emp = await dbGet('SELECT id, employee_id, name, username, email, phone, designation, dob, join_date, created_at FROM employees WHERE id = ?', [req.employee.id]);
      if (!emp) return res.status(404).json({ message: 'Not found' });
      res.json(emp);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  });
  server.put('/api/employee/profile', employeeAuthMiddleware, async (req, res) => {
    const { username, email, phone, dob } = req.body;
    try {
      await dbRun('UPDATE employees SET username = ?, email = ?, phone = ?, dob = ? WHERE id = ?', [username || null, email || '', phone || '', dob || null, req.employee.id]);
      res.json({ message: 'Profile updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update' });
    }
  });
  server.get('/api/employee/celebrations', employeeAuthMiddleware, async (req, res) => {
    try {
      const today = new Date();
      const mmdd = (m, d) => String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const todayStr = mmdd(today.getMonth() + 1, today.getDate());
      const all = await dbAll('SELECT id, employee_id, name, dob, join_date FROM employees WHERE dob IS NOT NULL OR join_date IS NOT NULL');
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
  server.get('/api/employee/greetings', employeeAuthMiddleware, async (req, res) => {
    try {
      let toId = req.query.to;
      if (toId === 'me') toId = req.employee.id;
      let rows;
      if (toId) rows = await dbAll('SELECT g.*, e.name as from_name FROM greetings g JOIN employees e ON g.from_employee_id = e.id WHERE g.to_employee_id = ? ORDER BY g.created_at DESC LIMIT 50', [toId]);
      else rows = await dbAll('SELECT g.*, e1.name as from_name, e2.name as to_name FROM greetings g JOIN employees e1 ON g.from_employee_id = e1.id JOIN employees e2 ON g.to_employee_id = e2.id ORDER BY g.created_at DESC LIMIT 50');
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.post('/api/employee/greet', employeeAuthMiddleware, async (req, res) => {
    const { to_employee_id, occasion, message } = req.body;
    if (!to_employee_id || !occasion) return res.status(400).json({ message: 'To employee and occasion required' });
    try {
      const id = await dbInsert('INSERT INTO greetings (from_employee_id, to_employee_id, occasion, message) VALUES (?, ?, ?, ?)', [req.employee.id, to_employee_id, occasion, (message || '').substring(0, 500)]);
      res.status(201).json({ id, message: 'Greeting sent' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to send' });
    }
  });
  server.get('/api/employee/leave', employeeAuthMiddleware, async (req, res) => {
    try {
      const rows = await dbAll('SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC', [req.employee.id]);
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch leave' });
    }
  });
  server.post('/api/employee/leave', employeeAuthMiddleware, async (req, res) => {
    const { from_date, to_date, reason } = req.body;
    if (!from_date || !to_date) return res.status(400).json({ message: 'From date and to date required' });
    try {
      const id = await dbInsert('INSERT INTO leave_requests (employee_id, from_date, to_date, reason, status) VALUES (?, ?, ?, ?, ?)', [req.employee.id, from_date, to_date, reason || '', 'pending']);
      res.status(201).json({ id, message: 'Leave request submitted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to submit' });
    }
  });
  server.get('/api/employee/announcements', employeeAuthMiddleware, async (req, res) => {
    try {
      const rows = await dbAll('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 50');
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });
  server.get('/api/employee/chat/employees', employeeAuthMiddleware, async (req, res) => {
    try {
      const me = req.employee.id;
      const rows = await dbAll('SELECT id, employee_id, name FROM employees WHERE id != ? ORDER BY name', [me]);
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });
  server.get('/api/employee/chat/conversations', employeeAuthMiddleware, async (req, res) => {
    try {
      const me = req.employee.id;
      const convos = await dbAll(`
        SELECT c.id, c.type, c.name, c.created_at,
          (SELECT message FROM conversation_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
          (SELECT created_at FROM conversation_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_at
        FROM conversations c
        INNER JOIN conversation_participants p ON p.conversation_id = c.id AND p.employee_id = ?
        ORDER BY COALESCE((SELECT created_at FROM conversation_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1), c.created_at) DESC
      `, [me]);
      const out = [];
      for (const c of convos) {
        const participants = await dbAll('SELECT p.employee_id, e.name FROM conversation_participants p JOIN employees e ON e.id = p.employee_id WHERE p.conversation_id = ?', [c.id]);
        const other = participants.filter((p) => Number(p.employee_id) !== me);
        out.push({
          id: c.id,
          type: c.type,
          name: c.type === 'dm' && other[0] ? other[0].name : (c.name || 'Group'),
          participants,
          last_message: c.last_message,
          last_at: c.last_at || c.created_at
        });
      }
      res.json(out);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });
  server.post('/api/employee/chat/conversations', employeeAuthMiddleware, async (req, res) => {
    const { type, other_employee_id, name, employee_ids } = req.body;
    const me = req.employee.id;
    try {
      if (type === 'dm' && other_employee_id) {
        const otherId = Number(other_employee_id);
        if (!otherId) return res.status(400).json({ message: 'Invalid employee' });
        const ids = [me, otherId].filter((v, i, a) => a.indexOf(v) === i);
        if (ids.length < 2) return res.status(400).json({ message: 'Cannot start DM with yourself' });
        const exists = await dbGet(
          'SELECT c.id FROM conversations c, conversation_participants p1, conversation_participants p2 WHERE c.type = ? AND c.id = p1.conversation_id AND p1.employee_id = ? AND c.id = p2.conversation_id AND p2.employee_id = ? AND p1.employee_id < p2.employee_id LIMIT 1',
          ['dm', ids[0], ids[1]]
        );
        if (exists && exists.id) return res.json({ id: exists.id });
        const cid = await dbInsert('INSERT INTO conversations (type) VALUES (?)', ['dm']);
        for (const eid of ids) {
          await dbRun('INSERT IGNORE INTO conversation_participants (conversation_id, employee_id) VALUES (?, ?)', [cid, eid]);
        }
        return res.status(201).json({ id: cid });
      }
      if (type === 'group' && name && Array.isArray(employee_ids) && employee_ids.length > 0) {
        const ids = [me, ...employee_ids.map(Number)].filter((n, i, arr) => n && arr.indexOf(n) === i);
        const cid = await dbInsert('INSERT INTO conversations (type, name) VALUES (?, ?)', ['group', String(name).trim().substring(0, 100)]);
        for (const eid of ids) {
          await dbRun('INSERT IGNORE INTO conversation_participants (conversation_id, employee_id) VALUES (?, ?)', [cid, eid]);
        }
        return res.status(201).json({ id: cid });
      }
      return res.status(400).json({ message: 'Invalid request' });
    } catch (e) {
      console.error('Error in /api/employee/chat/conversations:', e);
      res.status(500).json({ message: e && e.message ? e.message : 'Failed to create' });
    }
  });
  server.get('/api/employee/chat/conversations/:id', employeeAuthMiddleware, async (req, res) => {
    try {
      const cid = Number(req.params.id);
      const me = req.employee.id;
      const member = await dbGet('SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND employee_id = ?', [cid, me]);
      if (!member) return res.status(403).json({ message: 'Not in conversation' });
      const conv = await dbGet('SELECT * FROM conversations WHERE id = ?', [cid]);
      if (!conv) return res.status(404).json({ message: 'Not found' });
      const participants = await dbAll('SELECT p.employee_id, e.name FROM conversation_participants p JOIN employees e ON e.id = p.employee_id WHERE p.conversation_id = ?', [cid]);
      const other = participants.filter((p) => Number(p.employee_id) !== me);
      const messages = await dbAll('SELECT m.id, m.from_employee_id, m.message, m.created_at, e.name as from_name FROM conversation_messages m JOIN employees e ON e.id = m.from_employee_id WHERE m.conversation_id = ? ORDER BY m.created_at ASC', [cid]);
      res.json({
        id: conv.id,
        type: conv.type,
        name: conv.type === 'dm' && other[0] ? other[0].name : (conv.name || 'Group'),
        participants,
        messages
      });
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });
  server.post('/api/employee/chat/conversations/:id/messages', employeeAuthMiddleware, async (req, res) => {
    const { message } = req.body;
    const cid = Number(req.params.id);
    const me = req.employee.id;
    if (!message || !String(message).trim()) return res.status(400).json({ message: 'Message required' });
    try {
      const member = await dbGet('SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND employee_id = ?', [cid, me]);
      if (!member) return res.status(403).json({ message: 'Not in conversation' });
      const id = await dbInsert('INSERT INTO conversation_messages (conversation_id, from_employee_id, message) VALUES (?, ?, ?)', [cid, me, String(message).trim().substring(0, 2000)]);
      const msg = { id, from_employee_id: me, message: String(message).trim().substring(0, 2000), created_at: new Date().toISOString() };
      res.status(201).json(msg);
    } catch (e) {
      res.status(500).json({ message: 'Failed to send' });
    }
  });

  server.get('/api/admin/employees', authMiddleware, async (req, res) => {
    try {
      res.json(await dbAll('SELECT id, employee_id, name, email, phone, designation, dob, join_date, created_at FROM employees ORDER BY id'));
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch employees' });
    }
  });
  server.post('/api/admin/employees', authMiddleware, async (req, res) => {
    const { employee_id, name, email, phone, designation, password, dob, join_date } = req.body;
    if (!employee_id || !name || !password) return res.status(400).json({ message: 'Employee ID, name and password required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    try {
      const exists = await dbGet('SELECT 1 FROM employees WHERE employee_id = ?', [employee_id.trim()]);
      if (exists) return res.status(400).json({ message: 'Employee ID already exists' });
      const hash = bcrypt.hashSync(password, 10);
      const id = await dbInsert('INSERT INTO employees (employee_id, name, email, phone, designation, password, dob, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [employee_id.trim(), name.trim(), email || '', phone || '', designation || '', hash, dob || null, join_date || null]);
      res.status(201).json({ id, message: 'Employee created' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to create employee' });
    }
  });
  server.put('/api/admin/employees/:id', authMiddleware, async (req, res) => {
    const { name, email, phone, designation, password, dob, join_date } = req.body;
    try {
      const ex = await dbGet('SELECT * FROM employees WHERE id = ?', [req.params.id]);
      if (!ex) return res.status(404).json({ message: 'Employee not found' });
      let sql = 'UPDATE employees SET name = ?, email = ?, phone = ?, designation = ?, dob = ?, join_date = ?';
      const params = [name || ex.name, email || ex.email, phone || ex.phone, designation || ex.designation, dob !== undefined ? (dob || null) : ex.dob, join_date !== undefined ? (join_date || null) : ex.join_date];
      if (password && password.length >= 6) {
        sql += ', password = ?';
        params.push(bcrypt.hashSync(password, 10));
      }
      sql += ' WHERE id = ?';
      params.push(req.params.id);
      await dbRun(sql, params);
      res.json({ message: 'Employee updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update employee' });
    }
  });
  server.delete('/api/admin/employees/:id', authMiddleware, async (req, res) => {
    try {
      await dbRun('DELETE FROM employees WHERE id = ?', [req.params.id]);
      await dbRun('DELETE FROM attendance WHERE employee_id = ?', [req.params.id]);
      res.json({ message: 'Employee deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete employee' });
    }
  });
  server.get('/api/admin/announcements', authMiddleware, async (req, res) => {
    try {
      res.json(await dbAll('SELECT * FROM announcements ORDER BY created_at DESC'));
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.post('/api/admin/announcements', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    try {
      const id = await dbInsert('INSERT INTO announcements (title, content) VALUES (?, ?)', [title, content || '']);
      res.status(201).json({ id });
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.delete('/api/admin/announcements/:id', authMiddleware, async (req, res) => {
    try {
      await dbRun('DELETE FROM announcements WHERE id = ?', [req.params.id]);
      res.json({ message: 'Deleted' });
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.get('/api/admin/leave-requests', authMiddleware, async (req, res) => {
    try {
      const rows = await dbAll(`
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
  server.put('/api/admin/leave-requests/:id', authMiddleware, async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    try {
      await dbRun('UPDATE leave_requests SET status = ? WHERE id = ?', [status, req.params.id]);
      res.json({ message: 'Updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed' });
    }
  });
  server.get('/api/admin/attendance', authMiddleware, async (req, res) => {
    try {
      const rows = await dbAll(`
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

  server.post('/api/admin/chatbot-settings', authMiddleware, async (req, res) => {
    try {
      const data = JSON.stringify(req.body || {});
      const exists = await dbGet('SELECT 1 FROM chatbot_settings WHERE id = 1');
      if (exists) {
        await dbRun('UPDATE chatbot_settings SET data = ? WHERE id = 1', [data]);
      } else {
        await dbRun('INSERT INTO chatbot_settings (id, data) VALUES (1, ?)', [data]);
      }
      res.json({ message: 'Chatbot settings updated' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to update chatbot settings' });
    }
  });

  // Razorpay Payment Routes
  server.post('/api/payment/create-order', async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paisa
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      });
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ message: 'Failed to create payment order' });
    }
  });

  server.post('/api/payment/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification data' });
    }

    try {
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

      if (razorpay_signature === expectedSign) {
        // Payment verified successfully
        // Here you can save payment details to database if needed
        res.json({
          success: true,
          message: 'Payment verified successfully',
          payment_id: razorpay_payment_id,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment verification failed',
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: 'Payment verification error' });
    }
  });

  server.all('*', (req, res) => handle(req, res));

  server.listen(PORT, () => {
    console.log('Encogix running at http://localhost:' + PORT);
  });
}

main().catch(console.error);
