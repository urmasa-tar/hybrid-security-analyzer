import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaChartLine, FaCode, FaCar } from 'react-icons/fa';

const HomePage = () => {
    const features = [
        { icon: <FaShieldAlt size={40} />, title: "Гибридная безопасность", desc: "SAST + ML детектирование XSS и SQLi уязвимостей" },
        { icon: <FaChartLine size={40} />, title: "Real-time анализ", desc: "Мгновенное обнаружение инъекций с высокой точностью" },
        { icon: <FaCode size={40} />, title: "PyTorch LSTM", desc: "Современные нейронные сети для обнаружения атак" },
        { icon: <FaCar size={40} />, title: "Автозапчасти", desc: "Демонстрационный магазин с реальными уязвимостями" }
    ];

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '80px 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
                        AutoParts Store
                        <span className="vulnerability-badge" style={{ background: '#ffc107', color: '#333' }}>SECURITY DEMO</span>
                    </h1>
                    <p style={{ fontSize: '20px', marginBottom: '30px', opacity: 0.95 }}>
                        Магазин автозапчастей с интегрированной системой обнаружения уязвимостей
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Link to="/catalog" className="btn" style={{ background: 'white', color: '#667eea' }}>
                            Перейти в каталог
                        </Link>
                        <Link to="/analyzer" className="btn btn-outline" style={{ border: '2px solid white', color: 'white' }}>
                            Тестировать анализатор
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="container" style={{ padding: '60px 0' }}>
                <h2 className="text-center" style={{ marginBottom: '40px' }}>Ключевые возможности</h2>
                <div className="grid-3">
                    {features.map((feature, idx) => (
                        <div key={idx} className="card text-center">
                            <div style={{ color: '#667eea', marginBottom: '15px' }}>{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p style={{ color: '#666' }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vulnerability Warning */}
            <div className="alert alert-warning" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <strong>⚠️ Внимание!</strong> Это демонстрационное приложение содержит намеренно внедренные уязвимости
                (XSS, SQL Injection) для тестирования системы безопасности. Не используйте реальные данные.
            </div>
        </div>
    );
};

export default HomePage;