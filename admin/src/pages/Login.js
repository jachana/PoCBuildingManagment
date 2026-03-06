import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
    },
    card: {
        width: 400,
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 32,
        textAlign: 'center',
    },
    field: {
        marginBottom: 20,
    },
    label: {
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        fontSize: 14,
        border: '1px solid #d1d5db',
        borderRadius: 8,
        outline: 'none',
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px 16px',
        fontSize: 15,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: '#2563eb',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'background-color 0.15s',
    },
    buttonDisabled: {
        backgroundColor: '#93c5fd',
        cursor: 'not-allowed',
    },
    error: {
        padding: '10px 14px',
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        borderRadius: 8,
        fontSize: 13,
        marginBottom: 20,
        border: '1px solid #fecaca',
    },
};
export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            onLogin();
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.message || 'Error al iniciar sesion');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { style: styles.container, children: _jsxs("form", { style: styles.card, onSubmit: handleSubmit, children: [_jsx("h1", { style: styles.title, children: "Admin Panel" }), _jsx("p", { style: styles.subtitle, children: "Social Building Management" }), error && _jsx("div", { style: styles.error, children: error }), _jsxs("div", { style: styles.field, children: [_jsx("label", { style: styles.label, children: "Correo electronico" }), _jsx("input", { style: styles.input, type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "admin@ejemplo.com", required: true })] }), _jsxs("div", { style: styles.field, children: [_jsx("label", { style: styles.label, children: "Contrasena" }), _jsx("input", { style: styles.input, type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "********", required: true })] }), _jsx("button", { type: "submit", style: {
                        ...styles.button,
                        ...(loading ? styles.buttonDisabled : {}),
                    }, disabled: loading, children: loading ? 'Iniciando sesion...' : 'Iniciar sesion' })] }) }));
}
