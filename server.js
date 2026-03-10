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
  `);
  const row = dbGet('SELECT COUNT(*) as count FROM admins');
  if (row && row.count === 0) {
    const u = process.env.ADMIN_USERNAME || 'admin';
    const p = process.env.ADMIN_PASSWORD || 'admin123';
    db.run('INSERT INTO admins (username, password) VALUES (?, ?)', [u, bcrypt.hashSync(p, 10)]);
    console.log('Default admin: username=' + u + ', password=' + p);
  }
  try { db.run('ALTER TABLE blogs ADD COLUMN image TEXT'); saveDb(); } catch (_) {}
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
    const { name, email, phone, message } = req.body;
    const resumePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      dbRun('INSERT INTO job_applications (name, email, phone, resume, message) VALUES (?, ?, ?, ?, ?)', [name, email, phone, resumePath, message]);
      res.status(201).json({ message: 'Application submitted successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to submit application' });
    }
  });

  server.post('/api/internships/apply', upload.single('resume'), (req, res) => {
    const { name, email, phone, internship_type, message } = req.body;
    const resumePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      dbRun('INSERT INTO internship_applications (name, email, phone, internship_type, resume, message) VALUES (?, ?, ?, ?, ?, ?)', [name, email, phone, internship_type, resumePath, message]);
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
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token });
    } catch (e) {
      res.status(500).json({ message: 'Login failed' });
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
