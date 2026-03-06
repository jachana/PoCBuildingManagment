const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
export async function apiFetch(path, options = {}) {
    const { params, ...fetchOptions } = options;
    let url = `${API_URL}${path}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const response = await fetch(url, {
        ...fetchOptions,
        headers,
    });
    if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Sesion expirada');
    }
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(error.message || `Error ${response.status}`);
    }
    return response.json();
}
export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Credenciales invalidas' }));
        throw new Error(error.message || 'Error al iniciar sesion');
    }
    const data = await response.json();
    if (data.user.role !== 'ADMIN') {
        throw new Error('Acceso denegado. Se requiere rol de administrador.');
    }
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
}
export function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/';
}
export function isAuthenticated() {
    return !!localStorage.getItem('accessToken');
}
export function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}
