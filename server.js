require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const next = require('next');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { prisma } = require('./lib/prisma');
const { authMiddleware, employeeAuthMiddleware, signAdminToken, signEmployeeToken } = require('./lib/auth');
const { uniqueProjectSlug } = require('./lib/slug');
const { getChatbotReply } = require('./lib/chatbot-knowledge');

const hasProductionBuild = fs.existsSync(path.join(__dirname, 'frontend', '.next', 'BUILD_ID'));
const dev = process.env.NODE_ENV !== 'production' || !hasProductionBuild;
const app = next({ dev, dir: path.join(__dirname, 'frontend') });
const handle = app.getRequestHandler();

const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.bin';
    cb(null, file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  },
});
const upload = multer({ storage });

function toDateOnly(d = new Date()) {
  return new Date(d.toISOString().split('T')[0]);
}

async function seedDefaultAdmin() {
  const count = await prisma.admin.count();
  if (count === 0) {
    const u = process.env.ADMIN_USERNAME || 'admin';
    const p = process.env.ADMIN_PASSWORD || 'admin123';
    await prisma.admin.create({
      data: { username: u, password: bcrypt.hashSync(p, 10), active: true },
    });
    console.log('Default admin created: username=' + u);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is required. Example:\n' +
      'DATABASE_URL="postgresql://user:password@localhost:5432/encogix?schema=public"'
    );
  }

  await prisma.$connect();
  await seedDefaultAdmin();

  await app.prepare();

  const server = express();
  if (!dev) {
    server.set('trust proxy', true);
    server.use((req, res, next) => {
      try {
        const host = req.get('host') || '';
        const proto = (req.get('x-forwarded-proto') || req.protocol || '').toLowerCase();
        const cleanHost = host.replace(/^www\./i, '');
        const normalizedHost = cleanHost.toLowerCase().replace(/:\d+$/, '').replace(/^\[|\]$/g, '');
        const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(normalizedHost);

        if (!isLocalHost && proto && proto !== 'https') {
          return res.redirect(301, 'https://' + cleanHost + req.originalUrl);
        }
        if (!isLocalHost && host.toLowerCase().startsWith('www.')) {
          return res.redirect(301, 'https://' + cleanHost + req.originalUrl);
        }
      } catch (e) {}
      next();
    });
  }
  server.use(cors({ origin: true, credentials: true }));
  server.use(express.json());
  server.use('/uploads', express.static(uploadDir));

  server.get('/api/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ ok: true, database: 'connected' });
    } catch (e) {
      res.status(503).json({ ok: false, message: 'Database unavailable' });
    }
  });

  server.post('/api/contact', async (req, res) => {
    const { name, email, phone, message, source } = req.body;
    try {
      await prisma.contact.create({
        data: {
          name: name || null,
          email: email || null,
          phone: phone || null,
          message: message || null,
          source: source || 'contact',
          status: 'new',
        },
      });
      res.status(201).json({ message: 'Contact submission received' });
    } catch {
      res.status(500).json({ message: 'Failed to save contact' });
    }
  });

  server.post('/api/audit', async (req, res) => {
    const { name, email, phone, website, message } = req.body;
    try {
      await prisma.contact.create({
        data: {
          name: name || null,
          email: email || null,
          phone: phone || null,
          message: [website ? `Website: ${website}` : '', message || 'Free website audit request'].filter(Boolean).join('\n'),
          source: 'website-audit',
          status: 'new',
        },
      });
      res.status(201).json({ message: 'Audit request received' });
    } catch {
      res.status(500).json({ message: 'Failed to submit audit request' });
    }
  });

  server.get('/api/testimonials', async (_req, res) => {
    try {
      const rows = await prisma.testimonial.findMany({
        where: { active: true },
        orderBy: { sortOrder: 'asc' },
      });
      res.json(rows);
    } catch {
      res.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  });

  function mapProject(p) {
    if (!p) return p;
    return {
      ...p,
      project_url: p.projectUrl ?? p.project_url,
    };
  }

  server.get('/api/projects', async (_req, res) => {
    try {
      const rows = await prisma.project.findMany({ orderBy: { id: 'desc' } });
      res.json(rows.map(mapProject));
    } catch {
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  server.get('/api/projects/:slug', async (req, res) => {
    try {
      const param = decodeURIComponent(req.params.slug);
      const project = await prisma.project.findFirst({ where: { slug: param } });
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.json(mapProject(project));
    } catch {
      res.status(500).json({ message: 'Failed to fetch project' });
    }
  });

  function mapBlog(b) {
    if (!b) return b;
    return { ...b, created_at: b.createdAt };
  }

  function mapContact(c) {
    if (!c) return c;
    return {
      ...c,
      created_at: c.createdAt,
      assigned_employee_id: c.assignedEmployeeId,
    };
  }

  server.get('/api/blogs', async (_req, res) => {
    try {
      const rows = await prisma.blog.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(rows.map(mapBlog));
    } catch {
      res.status(500).json({ message: 'Failed to fetch blogs' });
    }
  });

  server.get('/api/blogs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const blog = await prisma.blog.findUnique({ where: { id } });
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.json(mapBlog(blog));
    } catch {
      res.status(500).json({ message: 'Failed to fetch blog' });
    }
  });

  server.get('/api/jobs', async (_req, res) => {
    try {
      res.json(await prisma.job.findMany());
    } catch {
      res.status(500).json({ message: 'Failed to fetch jobs' });
    }
  });

  server.post('/api/jobs/apply', upload.single('resume'), async (req, res) => {
    const body = req.body;
    const resumePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      await prisma.jobApplication.create({
        data: {
          name: body.name || '',
          email: body.email || '',
          phone: body.phone || '',
          currentCompany: body.current_company || '',
          currentSalary: body.current_salary || '',
          expectedSalary: body.expected_salary || '',
          experience: body.experience || '',
          noticePeriod: body.notice_period || '',
          resume: resumePath,
          message: body.message || '',
        },
      });
      res.status(201).json({ message: 'Application submitted successfully' });
    } catch {
      res.status(500).json({ message: 'Failed to submit application' });
    }
  });

  server.post('/api/internships/apply', upload.single('resume'), async (req, res) => {
    const body = req.body;
    const resumePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      await prisma.internshipApplication.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          internshipType: body.internship_type || '',
          college: body.college || '',
          course: body.course || '',
          resume: resumePath,
          message: body.message || '',
        },
      });
      res.status(201).json({ message: 'Internship application submitted successfully' });
    } catch {
      res.status(500).json({ message: 'Failed to submit internship application' });
    }
  });

  server.post('/api/chatbot', async (req, res) => {
    const message = (req.body && req.body.message) || '';
    let reply = getChatbotReply(message);
    try {
      const row = await prisma.chatbotSetting.findUnique({ where: { id: 1 } });
      if (row?.data) {
        const o = JSON.parse(row.data);
        const lower = message.toLowerCase();
        if (o?.overrides) {
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
      const admin = await prisma.admin.findUnique({ where: { username } });
      if (!admin || !bcrypt.compareSync(password, admin.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      if (!admin.active) return res.status(401).json({ message: 'Account is blocked' });
      res.json({ token: signAdminToken(admin) });
    } catch {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  server.post('/api/admin/create-admin', authMiddleware, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || username.trim().length < 3 || password.length < 6) {
      return res.status(400).json({ message: 'Username (min 3 chars) and password (min 6 chars) required' });
    }
    try {
      const exists = await prisma.admin.findUnique({ where: { username: username.trim() } });
      if (exists) return res.status(400).json({ message: 'Username already exists' });
      await prisma.admin.create({
        data: { username: username.trim(), password: bcrypt.hashSync(password, 10), active: true },
      });
      res.status(201).json({ message: 'Admin created successfully' });
    } catch {
      res.status(500).json({ message: 'Failed to create admin' });
    }
  });

  server.get('/api/admin/list-admins', authMiddleware, async (_req, res) => {
    try {
      const rows = await prisma.admin.findMany({
        select: { id: true, username: true, active: true },
        orderBy: { id: 'asc' },
      });
      res.json(rows);
    } catch {
      res.status(500).json({ message: 'Failed to fetch admins' });
    }
  });

  server.put('/api/admin/admins/:id/block', authMiddleware, async (req, res) => {
    try {
      await prisma.admin.update({ where: { id: parseInt(req.params.id, 10) }, data: { active: false } });
      res.json({ message: 'Admin blocked' });
    } catch {
      res.status(500).json({ message: 'Failed to block admin' });
    }
  });

  server.put('/api/admin/admins/:id/unblock', authMiddleware, async (req, res) => {
    try {
      await prisma.admin.update({ where: { id: parseInt(req.params.id, 10) }, data: { active: true } });
      res.json({ message: 'Admin unblocked' });
    } catch {
      res.status(500).json({ message: 'Failed to unblock admin' });
    }
  });

  server.delete('/api/admin/admins/:id', authMiddleware, async (req, res) => {
    try {
      await prisma.admin.delete({ where: { id: parseInt(req.params.id, 10) } });
      res.json({ message: 'Admin deleted' });
    } catch {
      res.status(500).json({ message: 'Failed to delete admin' });
    }
  });

  server.put('/api/admin/admins/:id/change-password', authMiddleware, async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    try {
      await prisma.admin.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { password: bcrypt.hashSync(password, 10) },
      });
      res.json({ message: 'Password updated' });
    } catch {
      res.status(500).json({ message: 'Failed to update password' });
    }
  });

  server.get('/api/admin/stats', authMiddleware, async (_req, res) => {
    try {
      const [totalLeads, totalJobApplications, totalInternshipApplications, totalBlogPosts, totalProjects, totalEmployees] =
        await Promise.all([
          prisma.contact.count(),
          prisma.jobApplication.count(),
          prisma.internshipApplication.count(),
          prisma.blog.count(),
          prisma.project.count(),
          prisma.employee.count(),
        ]);
      res.json({ totalLeads, totalJobApplications, totalInternshipApplications, totalBlogPosts, totalProjects, totalEmployees });
    } catch {
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  server.get('/api/admin/leads', authMiddleware, async (_req, res) => {
    try {
      const rows = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        include: { assignedEmployee: { select: { id: true, name: true, employeeId: true } } },
      });
      res.json(rows.map(mapContact));
    } catch {
      res.status(500).json({ message: 'Failed to fetch leads' });
    }
  });

  server.put('/api/admin/leads/:id', authMiddleware, async (req, res) => {
    const { status, assignedEmployeeId, notes } = req.body;
    try {
      await prisma.contact.update({
        where: { id: parseInt(req.params.id, 10) },
        data: {
          ...(status !== undefined ? { status } : {}),
          ...(assignedEmployeeId !== undefined ? { assignedEmployeeId: assignedEmployeeId || null } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
      });
      res.json({ message: 'Lead updated' });
    } catch {
      res.status(500).json({ message: 'Failed to update lead' });
    }
  });

  server.get('/api/admin/job-applications', authMiddleware, async (_req, res) => {
    try {
      res.json(await prisma.jobApplication.findMany({ orderBy: { createdAt: 'desc' } }));
    } catch {
      res.status(500).json({ message: 'Failed to fetch job applications' });
    }
  });

  server.get('/api/admin/internship-applications', authMiddleware, async (_req, res) => {
    try {
      res.json(await prisma.internshipApplication.findMany({ orderBy: { createdAt: 'desc' } }));
    } catch {
      res.status(500).json({ message: 'Failed to fetch internship applications' });
    }
  });

  server.post('/api/admin/blogs', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, content, author } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      const blog = await prisma.blog.create({ data: { title, content, author, image: imagePath } });
      res.status(201).json({ id: blog.id });
    } catch {
      res.status(500).json({ message: 'Failed to create blog' });
    }
  });

  server.put('/api/admin/blogs/:id', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, content, author } = req.body;
    try {
      const ex = await prisma.blog.findUnique({ where: { id: parseInt(req.params.id, 10) } });
      if (!ex) return res.status(404).json({ message: 'Blog not found' });
      const img = req.file ? '/uploads/' + req.file.filename : ex.image;
      await prisma.blog.update({
        where: { id: ex.id },
        data: { title, content, author, image: img },
      });
      res.json({ message: 'Blog updated' });
    } catch {
      res.status(500).json({ message: 'Failed to update blog' });
    }
  });

  server.delete('/api/admin/blogs/:id', authMiddleware, async (req, res) => {
    try {
      await prisma.blog.delete({ where: { id: parseInt(req.params.id, 10) } });
      res.json({ message: 'Blog deleted' });
    } catch {
      res.status(500).json({ message: 'Failed to delete blog' });
    }
  });

  server.post('/api/admin/projects', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, description, category, client, technologies, project_url, industry, results } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;
    try {
      const slug = await uniqueProjectSlug(prisma, title);
      const project = await prisma.project.create({
        data: {
          title: title || null,
          description: description || null,
          image: imagePath,
          category: category || null,
          client: client || null,
          technologies: technologies || null,
          projectUrl: project_url || null,
          industry: industry || null,
          results: results || null,
          slug,
        },
      });
      res.status(201).json({ id: project.id, slug });
    } catch {
      res.status(500).json({ message: 'Failed to create project' });
    }
  });

  server.put('/api/admin/projects/:id', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, description, category, client, technologies, project_url, industry, results } = req.body;
    try {
      const id = parseInt(req.params.id, 10);
      const ex = await prisma.project.findUnique({ where: { id } });
      if (!ex) return res.status(404).json({ message: 'Project not found' });
      const img = req.file ? '/uploads/' + req.file.filename : ex.image;
      const slug = await uniqueProjectSlug(prisma, title, id);
      await prisma.project.update({
        where: { id },
        data: {
          title: title || null,
          description: description || null,
          image: img,
          category: category || null,
          client: client || null,
          technologies: technologies || null,
          projectUrl: project_url || null,
          industry: industry || null,
          results: results || null,
          slug,
        },
      });
      res.json({ message: 'Project updated', slug });
    } catch {
      res.status(500).json({ message: 'Failed to update project' });
    }
  });

  server.delete('/api/admin/projects/:id', authMiddleware, async (req, res) => {
    try {
      await prisma.project.delete({ where: { id: parseInt(req.params.id, 10) } });
      res.json({ message: 'Project deleted' });
    } catch {
      res.status(500).json({ message: 'Failed to delete project' });
    }
  });

  server.post('/api/admin/jobs', authMiddleware, async (req, res) => {
    const { title, location, experience, description } = req.body;
    try {
      const job = await prisma.job.create({ data: { title, location, experience, description } });
      res.status(201).json({ id: job.id });
    } catch {
      res.status(500).json({ message: 'Failed to create job' });
    }
  });

  server.put('/api/admin/jobs/:id', authMiddleware, async (req, res) => {
    const { title, location, experience, description } = req.body;
    try {
      await prisma.job.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { title, location, experience, description },
      });
      res.json({ message: 'Job updated' });
    } catch {
      res.status(500).json({ message: 'Failed to update job' });
    }
  });

  server.delete('/api/admin/jobs/:id', authMiddleware, async (req, res) => {
    try {
      await prisma.job.delete({ where: { id: parseInt(req.params.id, 10) } });
      res.json({ message: 'Job deleted' });
    } catch {
      res.status(500).json({ message: 'Failed to delete job' });
    }
  });

  server.get('/api/admin/chatbot-settings', authMiddleware, async (_req, res) => {
    try {
      const row = await prisma.chatbotSetting.findUnique({ where: { id: 1 } });
      res.json(row?.data ? JSON.parse(row.data) : {});
    } catch {
      res.status(500).json({ message: 'Failed to fetch chatbot settings' });
    }
  });

  server.post('/api/admin/chatbot-settings', authMiddleware, async (req, res) => {
    try {
      const data = JSON.stringify(req.body || {});
      await prisma.chatbotSetting.upsert({
        where: { id: 1 },
        update: { data },
        create: { id: 1, data },
      });
      res.json({ message: 'Chatbot settings updated' });
    } catch {
      res.status(500).json({ message: 'Failed to update chatbot settings' });
    }
  });

  server.post('/api/employee/login', async (req, res) => {
    const { employee_id, password } = req.body;
    if (!employee_id || !password) return res.status(400).json({ message: 'Employee ID and password required' });
    try {
      const emp = await prisma.employee.findUnique({ where: { employeeId: employee_id.trim() } });
      if (!emp || !bcrypt.compareSync(password, emp.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      res.json({
        token: signEmployeeToken(emp),
        employee: { id: emp.id, employee_id: emp.employeeId, name: emp.name, designation: emp.designation },
      });
    } catch {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  server.get('/api/employee/leads', employeeAuthMiddleware, async (req, res) => {
    try {
      const rows = await prisma.contact.findMany({
        where: { assignedEmployeeId: req.employee.id },
        orderBy: { createdAt: 'desc' },
      });
      res.json(rows.map(mapContact));
    } catch {
      res.status(500).json({ message: 'Failed to fetch leads' });
    }
  });

  server.put('/api/employee/leads/:id', employeeAuthMiddleware, async (req, res) => {
    const { status, notes } = req.body;
    try {
      const lead = await prisma.contact.findFirst({
        where: { id: parseInt(req.params.id, 10), assignedEmployeeId: req.employee.id },
      });
      if (!lead) return res.status(404).json({ message: 'Lead not found or not assigned to you' });
      await prisma.contact.update({
        where: { id: lead.id },
        data: {
          ...(status !== undefined ? { status } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
      });
      res.json({ message: 'Lead updated' });
    } catch {
      res.status(500).json({ message: 'Failed to update lead' });
    }
  });

  server.post('/api/employee/punch-in', employeeAuthMiddleware, async (req, res) => {
    try {
      const empId = req.employee.id;
      const date = toDateOnly();
      const now = new Date();
      const loc = req.body?.latitude != null && req.body?.longitude != null
        ? `${req.body.latitude},${req.body.longitude}` : null;
      const row = await prisma.attendance.findUnique({
        where: { attendance_unique: { employeeId: empId, date } },
      });
      if (row?.punchIn) return res.status(400).json({ message: 'Already punched in today' });
      if (row) {
        await prisma.attendance.update({
          where: { id: row.id },
          data: { punchIn: now, punchInLocation: loc },
        });
      } else {
        await prisma.attendance.create({
          data: { employeeId: empId, date, punchIn: now, punchInLocation: loc },
        });
      }
      res.json({ message: 'Punched in', punch_in: now, punch_in_location: loc });
    } catch {
      res.status(500).json({ message: 'Failed to punch in' });
    }
  });

  server.post('/api/employee/punch-out', employeeAuthMiddleware, async (req, res) => {
    try {
      const empId = req.employee.id;
      const date = toDateOnly();
      const now = new Date();
      const loc = req.body?.latitude != null && req.body?.longitude != null
        ? `${req.body.latitude},${req.body.longitude}` : null;
      const row = await prisma.attendance.findUnique({
        where: { attendance_unique: { employeeId: empId, date } },
      });
      if (!row?.punchIn) return res.status(400).json({ message: 'Punch in first' });
      if (row.punchOut) return res.status(400).json({ message: 'Already punched out today' });
      await prisma.attendance.update({
        where: { id: row.id },
        data: { punchOut: now, punchOutLocation: loc },
      });
      res.json({ message: 'Punched out', punch_out: now, punch_out_location: loc });
    } catch {
      res.status(500).json({ message: 'Failed to punch out' });
    }
  });

  server.get('/api/employee/today', employeeAuthMiddleware, async (req, res) => {
    try {
      const date = toDateOnly();
      const row = await prisma.attendance.findUnique({
        where: { attendance_unique: { employeeId: req.employee.id, date } },
      });
      res.json(row ? {
        punch_in: row.punchIn,
        punch_out: row.punchOut,
        punch_in_location: row.punchInLocation,
        punch_out_location: row.punchOutLocation,
        date: row.date,
      } : { punch_in: null, punch_out: null });
    } catch {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });

  server.get('/api/employee/attendance', employeeAuthMiddleware, async (req, res) => {
    try {
      const rows = await prisma.attendance.findMany({
        where: { employeeId: req.employee.id },
        orderBy: { date: 'desc' },
        take: 30,
      });
      res.json(rows.map((a) => ({
        id: a.id,
        date: a.date,
        punch_in: a.punchIn,
        punch_out: a.punchOut,
        punch_in_location: a.punchInLocation,
        punch_out_location: a.punchOutLocation,
      })));
    } catch {
      res.status(500).json({ message: 'Failed to fetch attendance' });
    }
  });

  server.get('/api/employee/profile', employeeAuthMiddleware, async (req, res) => {
    try {
      const emp = await prisma.employee.findUnique({
        where: { id: req.employee.id },
        select: {
          id: true, employeeId: true, name: true, username: true, email: true,
          phone: true, designation: true, dob: true, joinDate: true, createdAt: true,
        },
      });
      if (!emp) return res.status(404).json({ message: 'Not found' });
      res.json({
        ...emp,
        employee_id: emp.employeeId,
        join_date: emp.joinDate,
        created_at: emp.createdAt,
      });
    } catch {
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  });

  server.put('/api/employee/profile', employeeAuthMiddleware, async (req, res) => {
    const { username, email, phone, dob } = req.body;
    try {
      await prisma.employee.update({
        where: { id: req.employee.id },
        data: { username: username || null, email: email || '', phone: phone || '', dob: dob || null },
      });
      res.json({ message: 'Profile updated' });
    } catch {
      res.status(500).json({ message: 'Failed to update' });
    }
  });

  server.get('/api/employee/celebrations', employeeAuthMiddleware, async (_req, res) => {
    try {
      const today = new Date();
      const mmdd = (m, d) => String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const todayStr = mmdd(today.getMonth() + 1, today.getDate());
      const all = await prisma.employee.findMany({
        where: { OR: [{ dob: { not: null } }, { joinDate: { not: null } }] },
        select: { id: true, employeeId: true, name: true, dob: true, joinDate: true },
      });
      const birthdays = all.filter((e) => e.dob && e.dob.length >= 10 && e.dob.slice(5, 10) === todayStr);
      const anniversaries = all.filter((e) => e.joinDate && e.joinDate.length >= 10 && e.joinDate.slice(5, 10) === todayStr);
      const upcomingBdays = [];
      const upcomingAnniv = [];
      for (let i = 1; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const str = mmdd(d.getMonth() + 1, d.getDate());
        all.filter((e) => e.dob && e.dob.length >= 10 && e.dob.slice(5, 10) === str)
          .forEach((e) => upcomingBdays.push({ ...e, employee_id: e.employeeId, date: str, daysAway: i }));
        all.filter((e) => e.joinDate && e.joinDate.length >= 10 && e.joinDate.slice(5, 10) === str)
          .forEach((e) => upcomingAnniv.push({ ...e, employee_id: e.employeeId, date: str, daysAway: i }));
      }
      res.json({ birthdays, anniversaries, upcoming: { birthdays: upcomingBdays, anniversaries: upcomingAnniv } });
    } catch {
      res.status(500).json({ message: 'Failed' });
    }
  });

  server.get('/api/employee/greetings', employeeAuthMiddleware, async (req, res) => {
    try {
      let toId = req.query.to;
      if (toId === 'me') toId = req.employee.id;
      let rows;
      if (toId) {
        rows = await prisma.greeting.findMany({
          where: { toEmployeeId: parseInt(toId, 10) },
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: { fromEmployee: { select: { name: true } } },
        });
        rows = rows.map((g) => ({ ...g, from_name: g.fromEmployee.name }));
      } else {
        rows = await prisma.greeting.findMany({
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            fromEmployee: { select: { name: true } },
            toEmployee: { select: { name: true } },
          },
        });
        rows = rows.map((g) => ({ ...g, from_name: g.fromEmployee.name, to_name: g.toEmployee.name }));
      }
      res.json(rows);
    } catch {
      res.status(500).json({ message: 'Failed' });
    }
  });

  server.post('/api/employee/greet', employeeAuthMiddleware, async (req, res) => {
    const { to_employee_id, occasion, message } = req.body;
    if (!to_employee_id || !occasion) return res.status(400).json({ message: 'To employee and occasion required' });
    try {
      const g = await prisma.greeting.create({
        data: {
          fromEmployeeId: req.employee.id,
          toEmployeeId: parseInt(to_employee_id, 10),
          occasion,
          message: (message || '').substring(0, 500),
        },
      });
      res.status(201).json({ id: g.id, message: 'Greeting sent' });
    } catch {
      res.status(500).json({ message: 'Failed to send' });
    }
  });

  server.get('/api/employee/leave', employeeAuthMiddleware, async (req, res) => {
    try {
      const rows = await prisma.leaveRequest.findMany({
        where: { employeeId: req.employee.id },
        orderBy: { createdAt: 'desc' },
      });
      res.json(rows);
    } catch {
      res.status(500).json({ message: 'Failed to fetch leave' });
    }
  });

  server.post('/api/employee/leave', employeeAuthMiddleware, async (req, res) => {
    const { from_date, to_date, reason } = req.body;
    if (!from_date || !to_date) return res.status(400).json({ message: 'From date and to date required' });
    try {
      const lr = await prisma.leaveRequest.create({
        data: {
          employeeId: req.employee.id,
          fromDate: new Date(from_date),
          toDate: new Date(to_date),
          reason: reason || '',
          status: 'pending',
        },
      });
      res.status(201).json({ id: lr.id, message: 'Leave request submitted' });
    } catch {
      res.status(500).json({ message: 'Failed to submit' });
    }
  });

  server.get('/api/employee/announcements', employeeAuthMiddleware, async (_req, res) => {
    try {
      res.json(await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }));
    } catch {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });

  server.get('/api/employee/chat/employees', employeeAuthMiddleware, async (req, res) => {
    try {
      const rows = await prisma.employee.findMany({
        where: { NOT: { id: req.employee.id } },
        select: { id: true, employeeId: true, name: true },
        orderBy: { name: 'asc' },
      });
      res.json(rows.map((e) => ({ id: e.id, employee_id: e.employeeId, name: e.name })));
    } catch {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });

  server.get('/api/employee/chat/conversations', employeeAuthMiddleware, async (req, res) => {
    try {
      const me = req.employee.id;
      const participations = await prisma.conversationParticipant.findMany({
        where: { employeeId: me },
        include: {
          conversation: {
            include: {
              messages: { orderBy: { createdAt: 'desc' }, take: 1 },
              participants: { include: { employee: { select: { id: true, name: true, employeeId: true } } } },
            },
          },
        },
      });
      const out = participations.map((p) => {
        const c = p.conversation;
        const last = c.messages[0];
        const participants = c.participants.map((x) => ({
          employee_id: x.employeeId,
          name: x.employee.name,
        }));
        const other = participants.filter((x) => x.employee_id !== me);
        return {
          id: c.id,
          type: c.type,
          name: c.type === 'dm' && other[0] ? other[0].name : (c.name || 'Group'),
          participants,
          last_message: last?.message,
          last_at: last?.createdAt || c.createdAt,
        };
      });
      out.sort((a, b) => new Date(b.last_at) - new Date(a.last_at));
      res.json(out);
    } catch {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });

  server.post('/api/employee/chat/conversations', employeeAuthMiddleware, async (req, res) => {
    const { type, other_employee_id, name, employee_ids } = req.body;
    const me = req.employee.id;
    try {
      if (type === 'dm' && other_employee_id) {
        const otherId = Number(other_employee_id);
        if (!otherId || otherId === me) return res.status(400).json({ message: 'Invalid employee' });
        const ids = [me, otherId].sort((a, b) => a - b);
        const existing = await prisma.conversation.findFirst({
          where: {
            type: 'dm',
            participants: { every: { employeeId: { in: ids } } },
          },
          include: { participants: true },
        });
        if (existing && existing.participants.length === 2) {
          return res.json({ id: existing.id });
        }
        const conv = await prisma.conversation.create({
          data: {
            type: 'dm',
            participants: { create: ids.map((eid) => ({ employeeId: eid })) },
          },
        });
        return res.status(201).json({ id: conv.id });
      }
      if (type === 'group' && name && Array.isArray(employee_ids) && employee_ids.length > 0) {
        const ids = [me, ...employee_ids.map(Number)].filter((n, i, arr) => n && arr.indexOf(n) === i);
        const conv = await prisma.conversation.create({
          data: {
            type: 'group',
            name: String(name).trim().substring(0, 100),
            participants: { create: ids.map((eid) => ({ employeeId: eid })) },
          },
        });
        return res.status(201).json({ id: conv.id });
      }
      return res.status(400).json({ message: 'Invalid request' });
    } catch (e) {
      res.status(500).json({ message: e?.message || 'Failed to create' });
    }
  });

  server.get('/api/employee/chat/conversations/:id', employeeAuthMiddleware, async (req, res) => {
    try {
      const cid = Number(req.params.id);
      const me = req.employee.id;
      const member = await prisma.conversationParticipant.findFirst({
        where: { conversationId: cid, employeeId: me },
      });
      if (!member) return res.status(403).json({ message: 'Not in conversation' });
      const conv = await prisma.conversation.findUnique({
        where: { id: cid },
        include: {
          participants: { include: { employee: { select: { id: true, name: true } } } },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: { fromEmployee: { select: { name: true } } },
          },
        },
      });
      if (!conv) return res.status(404).json({ message: 'Not found' });
      const participants = conv.participants.map((p) => ({
        employee_id: p.employeeId,
        name: p.employee.name,
      }));
      const other = participants.filter((p) => p.employee_id !== me);
      res.json({
        id: conv.id,
        type: conv.type,
        name: conv.type === 'dm' && other[0] ? other[0].name : (conv.name || 'Group'),
        participants,
        messages: conv.messages.map((m) => ({
          id: m.id,
          from_employee_id: m.fromEmployeeId,
          message: m.message,
          created_at: m.createdAt,
          from_name: m.fromEmployee.name,
        })),
      });
    } catch {
      res.status(500).json({ message: 'Failed to fetch' });
    }
  });

  server.post('/api/employee/chat/conversations/:id/messages', employeeAuthMiddleware, async (req, res) => {
    const { message } = req.body;
    const cid = Number(req.params.id);
    const me = req.employee.id;
    if (!message || !String(message).trim()) return res.status(400).json({ message: 'Message required' });
    try {
      const member = await prisma.conversationParticipant.findFirst({
        where: { conversationId: cid, employeeId: me },
      });
      if (!member) return res.status(403).json({ message: 'Not in conversation' });
      const msg = await prisma.conversationMessage.create({
        data: {
          conversationId: cid,
          fromEmployeeId: me,
          message: String(message).trim().substring(0, 2000),
        },
      });
      res.status(201).json({
        id: msg.id,
        from_employee_id: me,
        message: msg.message,
        created_at: msg.createdAt,
      });
    } catch {
      res.status(500).json({ message: 'Failed to send' });
    }
  });

  server.get('/api/admin/employees', authMiddleware, async (_req, res) => {
    try {
      const rows = await prisma.employee.findMany({
        select: {
          id: true, employeeId: true, name: true, email: true, phone: true,
          designation: true, dob: true, joinDate: true, createdAt: true,
        },
        orderBy: { id: 'asc' },
      });
      res.json(rows.map((e) => ({
        id: e.id,
        employee_id: e.employeeId,
        name: e.name,
        email: e.email,
        phone: e.phone,
        designation: e.designation,
        dob: e.dob,
        join_date: e.joinDate,
        created_at: e.createdAt,
      })));
    } catch {
      res.status(500).json({ message: 'Failed to fetch employees' });
    }
  });

  server.post('/api/admin/employees', authMiddleware, async (req, res) => {
    const { employee_id, name, email, phone, designation, password, dob, join_date } = req.body;
    if (!employee_id || !name || !password) return res.status(400).json({ message: 'Employee ID, name and password required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    try {
      const exists = await prisma.employee.findUnique({ where: { employeeId: employee_id.trim() } });
      if (exists) return res.status(400).json({ message: 'Employee ID already exists' });
      const emp = await prisma.employee.create({
        data: {
          employeeId: employee_id.trim(),
          name: name.trim(),
          email: email || '',
          phone: phone || '',
          designation: designation || '',
          password: bcrypt.hashSync(password, 10),
          dob: dob || null,
          joinDate: join_date || null,
        },
      });
      res.status(201).json({ id: emp.id, message: 'Employee created' });
    } catch {
      res.status(500).json({ message: 'Failed to create employee' });
    }
  });

  server.put('/api/admin/employees/:id', authMiddleware, async (req, res) => {
    const { name, email, phone, designation, password, dob, join_date } = req.body;
    try {
      const id = parseInt(req.params.id, 10);
      const ex = await prisma.employee.findUnique({ where: { id } });
      if (!ex) return res.status(404).json({ message: 'Employee not found' });
      const data = {
        name: name || ex.name,
        email: email ?? ex.email,
        phone: phone ?? ex.phone,
        designation: designation ?? ex.designation,
        dob: dob !== undefined ? (dob || null) : ex.dob,
        joinDate: join_date !== undefined ? (join_date || null) : ex.joinDate,
      };
      if (password && password.length >= 6) data.password = bcrypt.hashSync(password, 10);
      await prisma.employee.update({ where: { id }, data });
      res.json({ message: 'Employee updated' });
    } catch {
      res.status(500).json({ message: 'Failed to update employee' });
    }
  });

  server.delete('/api/admin/employees/:id', authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await prisma.attendance.deleteMany({ where: { employeeId: id } });
      await prisma.employee.delete({ where: { id } });
      res.json({ message: 'Employee deleted' });
    } catch {
      res.status(500).json({ message: 'Failed to delete employee' });
    }
  });

  server.get('/api/admin/announcements', authMiddleware, async (_req, res) => {
    try {
      res.json(await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } }));
    } catch {
      res.status(500).json({ message: 'Failed' });
    }
  });

  server.post('/api/admin/announcements', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    try {
      const a = await prisma.announcement.create({ data: { title, content: content || '' } });
      res.status(201).json({ id: a.id });
    } catch {
      res.status(500).json({ message: 'Failed' });
    }
  });

  server.delete('/api/admin/announcements/:id', authMiddleware, async (req, res) => {
    try {
      await prisma.announcement.delete({ where: { id: parseInt(req.params.id, 10) } });
      res.json({ message: 'Deleted' });
    } catch {
      res.status(500).json({ message: 'Failed' });
    }
  });

  server.get('/api/admin/leave-requests', authMiddleware, async (_req, res) => {
    try {
      const rows = await prisma.leaveRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          employee: { select: { employeeId: true, name: true, designation: true } },
        },
      });
      res.json(rows.map((l) => ({
        ...l,
        employee_id: l.employee.employeeId,
        name: l.employee.name,
        designation: l.employee.designation,
      })));
    } catch {
      res.status(500).json({ message: 'Failed' });
    }
  });

  server.put('/api/admin/leave-requests/:id', authMiddleware, async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    try {
      await prisma.leaveRequest.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { status },
      });
      res.json({ message: 'Updated' });
    } catch {
      res.status(500).json({ message: 'Failed' });
    }
  });

  server.get('/api/admin/attendance', authMiddleware, async (_req, res) => {
    try {
      const rows = await prisma.attendance.findMany({
        orderBy: [{ date: 'desc' }, { punchIn: 'desc' }],
        take: 500,
        include: {
          employee: { select: { employeeId: true, name: true, designation: true } },
        },
      });
      res.json(rows.map((a) => ({
        id: a.id,
        date: a.date,
        punch_in: a.punchIn,
        punch_out: a.punchOut,
        employee_id: a.employee.employeeId,
        name: a.employee.name,
        designation: a.employee.designation,
      })));
    } catch {
      res.status(500).json({ message: 'Failed to fetch attendance' });
    }
  });

  if (razorpay) {
    server.post('/api/payment/create-order', async (req, res) => {
      const { amount, currency = 'INR', receipt } = req.body;
      if (!amount || amount <= 0) return res.status(400).json({ message: 'Valid amount is required' });
      try {
        const order = await razorpay.orders.create({
          amount: amount * 100,
          currency,
          receipt: receipt || `receipt_${Date.now()}`,
        });
        res.json({ id: order.id, amount: order.amount, currency: order.currency, receipt: order.receipt });
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
        const expectedSign = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(sign).digest('hex');
        if (razorpay_signature === expectedSign) {
          res.json({ success: true, message: 'Payment verified successfully', payment_id: razorpay_payment_id });
        } else {
          res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Payment verification error' });
      }
    });
  }

  server.all('*', (req, res) => handle(req, res));

  const startServer = (port) => new Promise((resolve, reject) => {
    const listener = server.listen(port, () => {
      if (port !== DEFAULT_PORT) {
        console.log(`Port ${DEFAULT_PORT} is busy, using ${port} instead.`);
      }
      console.log(`Encogix running at http://localhost:${port}`);
      resolve();
    });

    listener.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        if (port < DEFAULT_PORT + 20) {
          startServer(port + 1).then(resolve).catch(reject);
          return;
        }
      }
      reject(err);
    });
  });

  await startServer(DEFAULT_PORT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
