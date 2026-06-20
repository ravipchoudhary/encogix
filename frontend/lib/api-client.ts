/**
 * API Client Utility
 * Automatically handles the API base URL from environment variables
 * Use this for all API calls to ensure proper routing in separated architecture
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Make an API call with proper base URL
 * @param endpoint - API endpoint path (e.g., '/api/projects')
 * @param options - Fetch options
 * @returns Promise with response
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`API Call Failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Make a GET request
 */
export function getAPI<T = any>(endpoint: string, options: FetchOptions = {}) {
  return apiCall<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * Make a POST request
 */
export function postAPI<T = any>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
) {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Make a PUT request
 */
export function putAPI<T = any>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
) {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Make a DELETE request
 */
export function deleteAPI<T = any>(endpoint: string, options: FetchOptions = {}) {
  return apiCall<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Upload a file (multipart/form-data)
 */
export async function uploadAPI<T = any>(
  endpoint: string,
  formData: FormData,
  options: FetchOptions = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type for FormData - browser will set it automatically
      headers: options.headers || {},
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`File Upload Failed: ${endpoint}`, error);
    throw error;
  }
}

export default {
  apiCall,
  getAPI,
  postAPI,
  putAPI,
  deleteAPI,
  uploadAPI,
};
