import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus, FaExclamationTriangle, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

const RegisterPage = () => {
    const [form, setForm] = useState({ 
        username: '', 
        password: '', 
        email: '',
        phone: '',
        address: '',
        role: 'user' 
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [xssWarning, setXssWarning] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        
        // VULNERABILITY: XSS - username not sanitized (stored XSS)
        const xssPatterns = ['<script>', '</script>', 'alert(', 'onerror=', 'onload='];
        const hasXss = xssPatterns.some(pattern => form.username.toLowerCase().includes(pattern));
        
        if (hasXss) {
            setXssWarning('⚠️ Обнаружена XSS попытка! Имя пользователя сохранено с потенциально опасными тегами.');
        }
        
        try {
            await axios.post('/users/register/', {
                username: form.username,
                password: form.password,
                email: form.email,
                phone: form.phone,
                address: form.address,
                role: form.role
            });
            setSuccess('Регистрация успешна! Перенаправление на страницу входа...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации. Возможно, имя пользователя уже занято.');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    // Примеры XSS payloads для тестирования
    const xssExamples = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert(1)>',
        '"><script>alert(1)</script>',
        '<svg onload=alert(document.cookie)>'
    ];

    const applyXssExample = (example) => {
        setForm({...form, username: example});
        setXssWarning('⚠️ XSS payload применен! При просмотре в админ-панели код выполнится.');
    };

    return (
        <div className="container" style={{ maxWidth: '500px', padding: '40px 0' }}>
            <div className="card">
                <h2 className="text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <FaUserPlus color="#667eea" /> Регистрация
                </h2>
                <p className="text-center" style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                    Создайте аккаунт для использования Security Analyzer
                </p>
                
                {/* XSS Warning */}
                {xssWarning && (
                    <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaExclamationTriangle /> {xssWarning}
                        <button 
                            onClick={() => setXssWarning('')}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            ×
                        </button>
                    </div>
                )}
                
                {/* Success Message */}
                {success && (
                    <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaCheckCircle /> {success}
                    </div>
                )}
                
                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger">
                        <FaExclamationTriangle /> {error}
                    </div>
                )}
                
                {/* XSS Demo - Reflected XSS Preview */}
                {form.username && form.username.length > 0 && (
                    <div className="alert alert-warning" style={{ marginBottom: '20px' }}>
                        <strong>🔴 XSS Демонстрация (Reflected):</strong>
                        <div dangerouslySetInnerHTML={{
                            __html: `<div style="margin-top: 8px; padding: 8px; background: #fff; border-radius: 4px;">
                                <strong>Предпросмотр профиля:</strong> Добро пожаловать, <span style="color: red;">${form.username}</span>!
                                <br/>
                                <small style="color: #666;">⚠️ Если вы ввели XSS код, он выполнится здесь!</small>
                            </div>`
                        }} />
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    {/* Username Field with XSS Test */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Имя пользователя <span style={{ color: 'red' }}>*</span></span>
                            <span style={{ fontSize: '11px', color: '#dc3545' }}>
                                <FaExclamationTriangle size={10} /> XSS уязвимость
                            </span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            placeholder="username"
                            style={{ fontFamily: 'monospace' }}
                        />
                        <p style={{ fontSize: '11px', color: '#dc3545', marginTop: '5px' }}>
                            💉 Тест XSS: Попробуйте ввести: <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code>
                        </p>
                    </div>
                    
                    {/* XSS Example Buttons */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '12px' }}>Быстрые XSS payloads для теста:</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                            {xssExamples.map((example, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => applyXssExample(example)}
                                    style={{
                                        background: '#f8d7da',
                                        border: '1px solid #dc3545',
                                        padding: '4px 8px',
                                        fontSize: '10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {example.substring(0, 20)}...
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Password Field */}
                    <div style={{ marginBottom: '15px' }}>
                        <label>Пароль <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    
                    {/* Email Field */}
                    <div style={{ marginBottom: '15px' }}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                        />
                    </div>
                    
                    {/* Phone Field */}
                    <div style={{ marginBottom: '15px' }}>
                        <label>Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+7 (999) 123-45-67"
                        />
                    </div>
                    
                    {/* Address Field */}
                    <div style={{ marginBottom: '15px' }}>
                        <label>Адрес</label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Город, улица, дом"
                        />
                    </div>
                    
                    {/* Role Selection */}
                    <div style={{ marginBottom: '20px' }}>
                        <label>Роль</label>
                        <select name="role" value={form.role} onChange={handleChange}>
                            <option value="user">👤 Пользователь</option>
                            <option value="admin">👑 Администратор</option>
                        </select>
                        <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                            Выберите "Администратор" для доступа к панели управления
                        </p>
                    </div>
                    
                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
                        ) : (
                            <FaUserPlus />
                        )}
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                
                <div className="text-center" style={{ marginTop: '20px' }}>
                    <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
                    <hr style={{ margin: '15px 0' }} />
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        <FaShieldAlt /> <strong>Security Demo Notice:</strong>
                        <p style={{ marginTop: '5px' }}>
                            Это приложение содержит намеренные уязвимости (Stored XSS, Reflected XSS) 
                            для демонстрации работы гибридного анализатора. После регистрации с XSS-именем,
                            перейдите в Admin Panel для проверки обнаружения.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;