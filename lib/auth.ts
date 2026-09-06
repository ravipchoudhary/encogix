export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function getEmployeeToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("employee_token");
}

function parseJwtPayload(token: string): { type?: string; exp?: number } | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    return JSON.parse(atob(base64.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null, expectedType?: "admin" | "employee"): boolean {
  if (!token) return false;
  const payload = parseJwtPayload(token);
  if (!payload?.exp || payload.exp * 1000 < Date.now()) return false;
  if (expectedType && payload.type !== expectedType) return false;
  return true;
}

export function adminAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function employeeAuthHeaders(): HeadersInit {
  const token = getEmployeeToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
