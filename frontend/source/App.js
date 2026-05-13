import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

// Navigation
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  return (
    <nav style={{ background: '#333', padding: '10px', color: 'white' }}>
      <Link to="/" style={{ color: 'white', margin: '10px' }}>Главная</Link>
      <Link to="/catalog" style={{ color: 'white', margin: '10px' }}>Каталог</Link>
      <Link to="/cart" style={{ color: 'white', margin: '10px' }}>Корзина</Link>
      <Link to="/analyzer" style={{ color: 'white', margin: '10px' }}>Security Analyzer</Link>
      {user?.role === 'admin' && (
        <Link to="/admin" style={{ color: 'white', margin: '10px' }}>Admin Panel</Link>
      )}
      {user ? (
        <span style={{ float: 'right' }}>
          {user.username} 
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Выйти</button>
        </span>
      ) : (
        <Link to="/login" style={{ float: 'right', color: 'white' }}>Войти</Link>
      )}
    </nav>
  );
};

// Login Component
const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login/', form);
      if (res.data.status === 'ok') {
        localStorage.setItem('user', JSON.stringify({ username: form.username, role: res.data.role }));
        window.location.href = '/';
      }
    } catch (err) {
      alert('Login failed');
    }
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({...form, username: e.target.value})}
          style={{ width: '100%', margin: '10px 0', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          style={{ width: '100%', margin: '10px 0', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Login</button>
      </form>
      <p><Link to="/register">Register</Link></p>
    </div>
  );
};

// Register Component (with XSS vulnerability)
const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users/register/', form);
      alert('Registration successful! Please login.');
      window.location.href = '/login';
    } catch (err) {
      alert('Registration failed');
    }
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>
      {/* VULNERABILITY: Reflected XSS if username contains script */}
      <div dangerouslySetInnerHTML={{__html: form.username && `<p>Welcome, ${form.username}!</p>`}} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({...form, username: e.target.value})}
          style={{ width: '100%', margin: '10px 0', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          style={{ width: '100%', margin: '10px 0', padding: '8px' }}
        />
        <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ padding: '10px' }}>Register</button>
      </form>
    </div>
  );
};

// Catalog Component (with SQL Injection vulnerability)
const Catalog = () => {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  
  const fetchProducts = async () => {
    // VULNERABILITY: SQL Injection in category parameter
    const res = await axios.get(`/products/?category=${category}`);
    setProducts(res.data);
  };
  
  useEffect(() => {
    fetchProducts();
  }, [category]);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Каталог автозапчастей</h2>
      <div>
        <input
          type="text"
          placeholder="Category ID (SQL Injection vulnerable: try ' OR '1'='1)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '300px', padding: '8px' }}
        />
        <button onClick={fetchProducts}>Search</button>
        <p style={{ fontSize: '12px', color: 'red' }}>
          Warning: This search is vulnerable to SQL Injection!
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>{p.name}</h3>
            <p>{p.price} ₽</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Security Analyzer Component
const Analyzer = () => {
  const [payload, setPayload] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const analyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/analyze/', { payload });
      setResult(res.data);
    } catch (err) {
      alert('Analysis failed');
    }
    setLoading(false);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Hybrid Security Analyzer (SAST + LSTM)</h2>
      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        placeholder="Enter payload to test (e.g., <script>alert('XSS')</script>)"
        rows="4"
        style={{ width: '100%', padding: '8px' }}
      />
      <button onClick={analyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      
      {result && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px' }}>
          <h3>Analysis Result</h3>
          <p><strong>Payload:</strong> {result.payload}</p>
          <p><strong>ML Confidence:</strong> {result.ml_confidence}</p>
          <p><strong>Status:</strong> <span style={{ color: result.is_vulnerable ? 'red' : 'green' }}>
            {result.is_vulnerable ? 'VULNERABLE' : 'SAFE'}
          </span></p>
          <p><strong>Risk Level:</strong> {result.risk_level}</p>
          {result.sast_findings.length > 0 && (
            <div>
              <strong>SAST Findings:</strong>
              <ul>
                {result.sast_findings.map((f, i) => (
                  <li key={i}>{f.type}: {f.pattern}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Admin Panel
const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    axios.get('/users/').then(res => setUsers(res.data));
  }, []);
  
  const deleteUser = (id) => {
    axios.delete(`/users/${id}/`).then(() => setUsers(users.filter(u => u.id !== id)));
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Username</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td dangerouslySetInnerHTML={{__html: u.username}} />
              <td>{u.role}</td>
              <td><button onClick={() => deleteUser(u.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Home Page
const Home = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Auto Parts Store</h1>
      <p>Welcome to our security testing platform!</p>
      <p>This application contains intentional vulnerabilities for demonstration:</p>
      <ul style={{ textAlign: 'left', display: 'inline-block' }}>
        <li>XSS in registration and admin panel</li>
        <li>SQL Injection in product catalog</li>
        <li>Hybrid SAST + LSTM analyzer to detect them</li>
      </ul>
    </div>
  );
};

// Main App
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/analyzer" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><div>Cart component</div></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;