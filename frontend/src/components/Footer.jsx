import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#2d3748',
            color: 'white',
            padding: '40px 0',
            marginTop: '60px'
        }}>
            <div className="container">
                <div className="grid-3">
                    <div>
                        <h4>AutoParts Store</h4>
                        <p>Магазин автозапчастей с системой безопасности следующего поколения</p>
                    </div>
                    <div>
                        <h4>Полезные ссылки</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li><a href="/catalog" style={{ color: 'white' }}>Каталог</a></li>
                            <li><a href="/analyzer" style={{ color: 'white' }}>Security Analyzer</a></li>
                            <li><a href="/about" style={{ color: 'white' }}>О проекте</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Контакты</h4>
                        <p>Email: support@autoparts.com</p>
                        <p>Телефон: +7 (999) 123-45-67</p>
                    </div>
                </div>
                <div className="text-center mt-20">
                    <p>&copy; 2026 AutoParts Store. Демонстрационный проект для ВКР.</p>
                    <p style={{ fontSize: '12px', color: '#a0aec0' }}>Содержит уязвимости для тестирования</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;