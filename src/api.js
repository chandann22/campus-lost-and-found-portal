export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const DEFAULT_ITEM_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80';

export function clearAuthState() {
  localStorage.removeItem('campus_token');
  localStorage.removeItem('campus_user');
}

export function redirectToLogin() {
  clearAuthState();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

export async function apiFetch(url, options = {}) {
  const timeoutMs = options.timeoutMs || 10000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401 ) {
      redirectToLogin();
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Request failed');
      let message = 'Request failed';
      try {
        const parsed = JSON.parse(errorText);
        message = parsed.message || parsed.error || message;
      } catch {
        message = errorText || message;
      }
      throw new Error(message);
    }

    return response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
