import { getAccessToken } from '../lib/supabase';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

async function request(path, { body, headers = {}, ...options } = {}) {
  const requestHeaders = new Headers(headers);
  const token = await getAccessToken();
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

  let requestBody = body;
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: requestHeaders,
    body: requestBody,
    credentials: 'include'
  });
  const result = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(result?.error?.message || `Request failed (${response.status}).`);
    error.status = response.status;
    error.code = result?.error?.code || 'request_failed';
    throw error;
  }
  return result?.data ?? result;
}

export const api = {
  request,
  enquiries: {
    create: async body => requireInsertedRecord(
      await request('/enquiries', { method: 'POST', body }),
      'Project enquiry'
    )
  },
  contacts: {
    create: async body => requireInsertedRecord(
      await request('/contacts', { method: 'POST', body }),
      'Contact message'
    )
  },
  portfolio: {
    list: () => request('/portfolio')
  },
  products: {
    list: () => request('/products')
  },
  jobs: {
    list: () => request('/jobs'),
    apply: async (body, resume) => {
      let response;
      if (!resume) {
        response = await request('/job-applications', { method: 'POST', body });
      } else {
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) formData.append(key, value);
        });
        formData.append('resume', resume);
        response = await request('/job-applications', { method: 'POST', body: formData });
      }
      return requireInsertedRecord(response, 'Career application');
    }
  },
  auth: {
    me: () => request('/admin/me'),
    dashboard: () => request('/admin/dashboard')
  },
  admin: {
    enquiries: {
      list: query => request(`/admin/enquiries${toQueryString(query)}`),
      get: id => request(`/admin/enquiries/${encodeURIComponent(id)}`),
      update: (id, body) => request(`/admin/enquiries/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
      remove: id => request(`/admin/enquiries/${encodeURIComponent(id)}`, { method: 'DELETE' })
    },
    contacts: {
      list: query => request(`/admin/contacts${toQueryString(query)}`),
      update: (id, body) => request(`/admin/contacts/${encodeURIComponent(id)}`, { method: 'PATCH', body })
    },
    portfolio: createCrudApi('/admin/portfolio-projects'),
    products: createCrudApi('/admin/products'),
    demos: createCrudApi('/admin/product-demos'),
    jobs: createCrudApi('/admin/job-openings'),
    applications: {
      list: query => request(`/admin/job-applications${toQueryString(query)}`),
      update: (id, body) => request(`/admin/job-applications/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
      resumeUrl: id => request(`/admin/job-applications/${encodeURIComponent(id)}/resume-url`)
    },
    notifications: {
      list: query => request(`/admin/notifications${toQueryString(query)}`),
      markRead: id => request(`/admin/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH', body: {} })
    },
    upload: (bucket, file) => {
      const formData = new FormData();
      formData.append('file', file);
      return request(`/admin/uploads/${encodeURIComponent(bucket)}`, { method: 'POST', body: formData });
    }
  }
};

function createCrudApi(path) {
  return {
    list: () => request(path),
    create: body => request(path, { method: 'POST', body }),
    update: (id, body) => request(`${path}/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
    remove: id => request(`${path}/${encodeURIComponent(id)}`, { method: 'DELETE' })
  };
}

function toQueryString(query = {}) {
  const parameters = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') parameters.set(key, String(value));
  });
  const value = parameters.toString();
  return value ? `?${value}` : '';
}

function requireInsertedRecord(data, label) {
  if (!data || data.id === undefined || data.id === null) {
    throw new Error(`${label} submission was not confirmed by the server.`);
  }
  return data;
}
