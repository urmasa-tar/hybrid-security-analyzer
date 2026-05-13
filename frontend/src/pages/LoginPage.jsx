import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/users/login/', form);
            if (res.data.status === 'ok') {
                localStorage.setItem('user', JSON.stringify({ 
                    username: form.username, 
                    role: res.data.role 
                }));
                navigate('/');
            }
        } catch (err) {
            setError('Неверное имя пользователя или пароль');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', padding: '60px 0' }}>
            <div className="card">
                <h2 className="text-center">Вход в систему</h2>
                <p className="text-center" style={{ color: '#666', marginBottom: '20px' }}>
                    Войдите чтобы использовать Security Analyzer
                </p>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Имя пользователя</label>
                        <input
                            type="text"
                            value={form.username}
                            onChange={(e) => setForm({...form, username: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label>Пароль</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        <FaSignInAlt /> Войти
                    </button>
                </form>
                
                <div className="text-center" style={{ marginTop: '20px' }}>
                    <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
                    <p style={{ fontSize: '12px', marginTop: '10px' }}>
                        Тестовые аккаунты:<br/>
                        user / user123<br/>
                        admin / admin123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;