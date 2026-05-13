import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';

const CatalogPage = () => {
    const [category, setCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sqlError, setSqlError] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        setSqlError('');
        try {
            // VULNERABILITY: SQL Injection in category parameter
            const res = await axios.get(`/products/?category=${category}`);
            setProducts(res.data);
            if (category.includes("'") || category.includes("OR") || category.includes("UNION")) {
                setSqlError('⚠️ SQL Injection атака обнаружена! Анализатор сработал.');
            }
        } catch (err) {
            console.error('Failed to fetch products');
            setProducts([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const categories = [
        { id: 1, name: 'Двигатель' },
        { id: 2, name: 'Трансмиссия' },
        { id: 3, name: 'Тормозная система' },
        { id: 4, name: 'Электрика' },
        { id: 5, name: 'Подвеска' }
    ];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1>Каталог автозапчастей</h1>
            
            <div className="card" style={{ marginBottom: '30px' }}>
                <h3>Поиск по категории</h3>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ flex: 1 }}
                    >
                        <option value="">Все категории</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <button onClick={fetchProducts} className="btn btn-primary">
                        <FaSearch /> Найти
                    </button>
                </div>
                
                {/* SQL Injection Demo Input */}
                <div style={{ marginTop: '15px' }}>
                    <label>SQL Injection демо (нажмите Enter):</label>
                    <input 
                        type="text"
                        placeholder="' OR '1'='1"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
                        style={{ marginTop: '5px' }}
                    />
                    <p style={{ fontSize: '12px', color: '#dc3545', marginTop: '5px' }}>
                        Уязвимость: Попробуйте ввести <code>' OR '1'='1</code> или <code>1 UNION SELECT * FROM users</code>
                    </p>
                </div>

                {sqlError && (
                    <div className="alert alert-danger" style={{ marginTop: '15px' }}>
                        <FaExclamationTriangle /> {sqlError}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center"><div className="loading-spinner"></div></div>
            ) : (
                <div className="grid-3">
                    {products.map(product => (
                        <div key={product.id} className="card">
                            {product.image_url && (
                                <img 
                                    src={product.image_url} 
                                    alt={product.name}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            )}
                            <h3 style={{ marginTop: '15px' }}>{product.name}</h3>
                            <p style={{ color: '#667eea', fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
                                {product.price} ₽
                            </p>
                            <p style={{ color: '#666' }}>{product.description?.substring(0, 100)}...</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button className="btn btn-primary" style={{ flex: 1 }}>
                                    <FaShoppingCart /> В корзину
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && products.length === 0 && (
                <div className="text-center" style={{ padding: '40px' }}>
                    <p>Товары не найдены</p>
                </div>
            )}
        </div>
    );
};

export default CatalogPage;