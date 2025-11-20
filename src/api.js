const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function register(email, username, name, dob, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, name, dob, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}

export async function me(token) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function fetchMovies() {
  const res = await fetch(`${API_BASE}/movies`);
  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }
  return res.json();
}

export async function fetchWebSeries() {
  const res = await fetch(`${API_BASE}/webseries`);
  if (!res.ok) {
    throw new Error('Failed to fetch web series');
  }
  return res.json();
}

export async function addToList(itemType, itemId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/add_to_list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ item_type: itemType, item_id: itemId })
  });
  if (!res.ok) {
    throw new Error('Failed to add to list');
  }
  return res.json();
}

export async function getMyList() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/my_list`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Failed to get my list');
  }
  return res.json();
}

export async function removeFromList(itemType, itemId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/remove_from_list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ item_type: itemType, item_id: itemId })
  });
  if (!res.ok) {
    throw new Error('Failed to remove from list');
  }
  return res.json();
}
