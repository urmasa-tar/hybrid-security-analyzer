import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaUserShield, FaSignOutAlt, FaCar } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchCartCount();
    }, []);

    const fetchCartCount = async () => {
        try {
            const res = await axios.get('/cart/count/');
            setCartCount(res.data.count);
        } catch (err) {
            console.error('Failed to fetch cart count');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <FaCar size={30} color="#667eea" />
                    <h2 style={{ color: '#667eea' }}>AutoParts Store</h2>
                </Link>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/catalog" style={{ textDecoration: 'none', color: '#333', fontWeight: 500 }}>Каталог</Link>
                    
                    <Link to="/analyzer" style={{ textDecoration: 'none', color: '#333', fontWeight: 500 }}>
                        Security Analyzer
                        <span className="vulnerability-badge">Demo</span>
                    </Link>

                    <Link to="/cart" style={{ textDecoration: 'none', color: '#333', position: 'relative' }}>
                        <FaShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-12px',
                                background: '#dc3545',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '2px 6px',
                                fontSize: '10px'
                            }}>{cartCount}</span>
                        )}
                    </Link>

                    {user ? (
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            {user.role === 'admin' && (
                                <Link to="/admin" style={{ textDecoration: 'none', color: '#667eea' }}>
                                    <FaUserShield size={20} />
                                </Link>
                            )}
                            <Link to="/profile" style={{ textDecoration: 'none', color: '#333' }}>
                                <FaUser size={20} />
                                <span style={{ marginLeft: '5px' }}>{user.username}</span>
                            </Link>
                            <button onClick={handleLogout} style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#dc3545'
                            }}>
                                <FaSignOutAlt size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px' }}>Войти</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;