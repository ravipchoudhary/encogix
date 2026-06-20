# Frontend API Call Migration Guide

## Overview

The frontend now needs to use the `apiCall` utility (or specific methods like `getAPI`, `postAPI`, etc.) to ensure API calls work correctly in the separated architecture.

## Why This Is Important

- **Local Development**: Calls need to route to `http://localhost:5000` (backend)
- **Production**: Calls need to route to your actual backend domain
- **Environment-Based**: Automatically uses `NEXT_PUBLIC_API_URL` from `.env.local` or `.env.production`

## New API Utility

Location: `frontend/lib/api-client.ts`

Available functions:
- `apiCall(endpoint, options)` - General purpose
- `getAPI(endpoint, options)` - GET requests
- `postAPI(endpoint, data, options)` - POST requests  
- `putAPI(endpoint, data, options)` - PUT requests
- `deleteAPI(endpoint, options)` - DELETE requests
- `uploadAPI(endpoint, formData, options)` - File uploads

## Migration Examples

### Before (Old Way)
```typescript
// ❌ This won't work in separated architecture
const res = await fetch('/api/projects');
const data = await res.json();
```

### After (New Way)
```typescript
// ✅ Correct way using API utility
import { getAPI } from '@/lib/api-client';

const data = await getAPI('/api/projects');
```

## Common Patterns

### GET Request
**Before:**
```typescript
const res = await fetch('/api/projects');
const projects = await res.json();
```

**After:**
```typescript
import { getAPI } from '@/lib/api-client';

const projects = await getAPI('/api/projects');
```

### POST Request
**Before:**
```typescript
const res = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message })
});
const data = await res.json();
```

**After:**
```typescript
import { postAPI } from '@/lib/api-client';

const data = await postAPI('/api/contact', { 
  name, 
  email, 
  message 
});
```

### File Upload
**Before:**
```typescript
const formData = new FormData();
formData.append('resume', file);
formData.append('name', name);

const res = await fetch('/api/jobs/apply', {
  method: 'POST',
  body: formData
});
```

**After:**
```typescript
import { uploadAPI } from '@/lib/api-client';

const formData = new FormData();
formData.append('resume', file);
formData.append('name', name);

const result = await uploadAPI('/api/jobs/apply', formData);
```

### With Authentication Headers
**Before:**
```typescript
const headers = { 
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

const res = await fetch('/api/admin/stats', { headers });
const data = await res.json();
```

**After:**
```typescript
import { getAPI } from '@/lib/api-client';

const data = await getAPI('/api/admin/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Error Handling
```typescript
import { postAPI } from '@/lib/api-client';

try {
  const result = await postAPI('/api/contact', { name, email });
  console.log('Success:', result);
} catch (error) {
  console.error('Failed to submit:', error.message);
  // Handle error
}
```

## Files to Update

Priority order for updating API calls:

1. **High Priority** (user-facing):
   - `components/JobList.tsx` - Job listing
   - `components/JobApplyModal.tsx` - Job application
   - `components/ChatbotWidget.tsx` - Chatbot
   - `app/admin/login/page.tsx` - Admin login
   - `app/employee/login/page.tsx` - Employee login

2. **Medium Priority**:
   - `app/page.tsx` - Home page (projects, testimonials)
   - `components/HomeSections.tsx` - Audit form
   - `app/employee/profile/page.tsx` - Employee profile
   - `app/payment/page.tsx` - Payment

3. **Low Priority**:
   - Other utility calls and less critical endpoints

## TypeScript Support

The `api-client.ts` includes TypeScript typing. You can specify return types:

```typescript
interface Project {
  id: number;
  title: string;
  slug: string;
}

const projects = await getAPI<Project[]>('/api/projects');
// projects is typed as Project[]
```

## Environment Variables

### Local Development (frontend/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Production (frontend/.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.encogix.com
```

The utility automatically reads from `process.env.NEXT_PUBLIC_API_URL` and falls back to `http://localhost:5000` if not set.

## Important Notes

1. **Endpoint Format**: Always include the full path starting with `/api/`
   - ✅ `/api/projects`
   - ❌ `projects` or `http://localhost:5000/api/projects`

2. **External URLs**: The utility detects external URLs
   ```typescript
   // This works (external API)
   await apiCall('https://api.external.com/data');
   ```

3. **CORS**: Backend is already configured with CORS
   ```javascript
   // In backend/server.js
   server.use(cors({ origin: true, credentials: true }));
   ```

4. **FormData**: For file uploads, don't set Content-Type manually
   ```typescript
   const formData = new FormData();
   formData.append('file', file);
   // Don't set headers['Content-Type'] - browser will do it
   await uploadAPI('/api/upload', formData);
   ```

## Gradual Migration

You don't need to update everything at once:

1. Create the `api-client.ts` file (✅ Done)
2. Use it for new API calls going forward
3. Gradually update existing calls during refactoring
4. Test thoroughly with both dev and production environments

## Troubleshooting

### API calls failing in production
- Check `frontend/.env.production` has correct `NEXT_PUBLIC_API_URL`
- Rebuild frontend: `npm run build`
- Verify backend is running and accessible

### API calls failing in development
- Ensure backend is running on port 5000: `npm run dev:backend`
- Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000`
- Restart frontend dev server

### CORS errors
- Backend already handles CORS (all origins allowed)
- If still getting errors, check request headers in browser DevTools
