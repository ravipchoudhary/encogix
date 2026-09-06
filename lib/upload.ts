import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "..", "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
}

export async function saveUploadedFile(file: File | null, fieldPrefix: string): Promise<string | null> {
  if (!file || file.size === 0) return null;
  ensureUploadDir();
  const ext = path.extname(file.name || "") || ".bin";
  const filename = `${fieldPrefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}
