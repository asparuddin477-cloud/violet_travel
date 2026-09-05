import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  KeyRound,
  UserCheck,
  Car
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, users } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(username, password);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess(res.user);
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (demoUser) => {
    const res = login(demoUser.username, demoUser.password);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="ticket-modal-card" 
        style={{ maxWidth: '480px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ticket-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/logo.png" 
              alt="Violet Transport" 
              style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                background: 'white', 
                padding: '2px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
              }} 
            />
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1.2 }}>Masuk Akun Violet</h3>
              <p style={{ fontSize: '0.78rem', opacity: 0.85, margin: 0 }}>
                Super Admin • Admin Operasional • Sopir
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Quick Demo Access Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚡ Coba Masuk Cepat (1-Klik Akun Demo):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.5rem' }}>
              {users.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  style={{
                    background: u.role === 'superadmin' ? '#fdf4ff' : u.role === 'admin' ? '#eff6ff' : '#f0fdf4',
                    border: `1.5px solid ${u.role === 'superadmin' ? '#f0abfc' : u.role === 'admin' ? '#bfdbfe' : '#bbf7d0'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem 0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {u.role === 'superadmin' ? <ShieldCheck size={14} color="#a855f7" /> : u.role === 'admin' ? <UserCheck size={14} color="#3b82f6" /> : <Car size={14} color="#10b981" />}
                    <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      {u.roleLabel}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    {u.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>atau masuk dengan sandi</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errorMsg && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group">
              <label>
                <User size={15} />
                <span>Username Akun</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="superadmin / admin / sopir.budi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <KeyRound size={15} />
                <span>Kata Sandi</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-confirm-booking"
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
