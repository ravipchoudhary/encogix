const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_change_me';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid Authorization header' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type && payload.type !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.admin = payload;
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
    if (payload.type !== 'employee') return res.status(403).json({ message: 'Employee access required' });
    req.employee = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function signAdminToken(admin) {
  return jwt.sign(
    { id: admin.id, username: admin.username, type: 'admin' },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function signEmployeeToken(emp) {
  return jwt.sign(
    { id: emp.id, employee_id: emp.employeeId, type: 'employee' },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

module.exports = {
  JWT_SECRET,
  authMiddleware,
  employeeAuthMiddleware,
  signAdminToken,
  signEmployeeToken,
};
