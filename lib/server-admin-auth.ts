import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey_change_me";

export function verifyAdminToken(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { type?: string };
    return payload.type === "admin" ? payload : null;
  } catch {
    return null;
  }
}
