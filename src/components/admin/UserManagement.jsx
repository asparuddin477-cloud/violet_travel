import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  UserCheck, 
  Car, 
  X, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';

export const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useAuth();
  const { drivers } = useTravel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'admin',
    roleLabel: 'Admin Operasional',
    email: '',
    phone: '',
    driverId: ''
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      role: 'admin',
      roleLabel: 'Admin Operasional',
      email: '',
      phone: '',
      driverId: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      password: u.password,
      name: u.name,
      role: u.role,
      roleLabel: u.roleLabel,
      email: u.email || '',
      phone: u.phone || '',
      driverId: u.driverId || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.name) {
      alert('Username, kata sandi, dan nama harus diisi.');
      return;
    }

    let roleLabel = 'Admin Operasional';
    if (formData.role === 'superadmin') roleLabel = 'Super Admin';
    if (formData.role === 'sopir') roleLabel = 'Sopir / Pengemudi';

    const payload = {
      ...formData,
      roleLabel
    };

    if (editingUser) {
      updateUser(editingUser.id, payload);
      setToastMsg(`Akun pengguna "${payload.name}" (@${payload.username}) berhasil diperbarui!`);
    } else {
      addUser(payload);
      setToastMsg(`Akun baru "${payload.name}" (@${payload.username}) berhasil dibuat!`);
    }

    setTimeout(() => setToastMsg(''), 4500);
    setIsModalOpen(false);
  };

  return (
    <div className="admin-card">
      {toastMsg && (
        <div style={{
          background: 'var(--success-light)',
          color: 'var(--success)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1.25rem',
          border: '1px solid #a7f3d0'
        }}>
          <CheckCircle2 size={20} />
          <span>{toastMsg}</span>
        </div>
      )}
      <div className="admin-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="admin-mode-badge" style={{ background: '#a855f7' }}>KHUSUS SUPER ADMIN</span>
          </div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '4px' }}>
            Manajemen Akun Login (Super Admin, Admin, & Sopir)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Kelola hak akses sistem, tambah akun pengemudi baru, atau atur kata sandi akun operasional.
          </p>
        </div>

        <button className="btn-add-entity" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Peran Akun</th>
              <th>Nama Pengguna</th>
              <th>Username Login</th>
              <th>Kata Sandi</th>
              <th>Kontak & Email</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <span
                    className="badge-status"
                    style={{
                      background: u.role === 'superadmin' ? '#f3e8ff' : u.role === 'admin' ? '#dbeafe' : '#dcfce7',
                      color: u.role === 'superadmin' ? '#7e22ce' : u.role === 'admin' ? '#1d4ed8' : '#15803d'
                    }}
                  >
                    {u.role === 'superadmin' ? <ShieldCheck size={14} /> : u.role === 'admin' ? <UserCheck size={14} /> : <Car size={14} />}
                    {u.roleLabel}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                      src={u.avatar} 
                      alt={u.name} 
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td>
                  <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {u.username}
                  </code>
                </td>
                <td>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    •••••••• ({u.password})
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{u.phone || '-'}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email || '-'}</span>
                </td>
                <td>
                  <div className="action-btns-group" style={{ justifyContent: 'center' }}>
                    <button
                      className="btn-table-icon"
                      onClick={() => handleOpenEdit(u)}
                      title="Edit Akun"
                    >
                      <Edit3 size={15} />
                    </button>
                    {u.id !== currentUser?.id && (
                      <button
                        className="btn-table-icon delete"
                        onClick={() => {
                          if (confirm(`Hapus akun ${u.name} (${u.username})?`)) {
                            deleteUser(u.id);
                          }
                        }}
                        title="Hapus Akun"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div 
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              // Ignore accidental clicks outside to safeguard user typing
            }
          }}
        >
          <div 
            className="ticket-modal-card" 
            style={{ 
              maxWidth: '520px',
              width: '95%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ticket-header" style={{ flexShrink: 0 }}>
              <h3>{editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}</h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                title="Tutup (Batal)"
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <form 
              onSubmit={handleSave} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                  e.preventDefault();
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
            >
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
              <div className="form-group">
                <label>Nama Lengkap Akun *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Rian Pratama"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Username Login *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="rian.pratama"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Kata Sandi *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Sandi123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pilih Peran Akun (Role) *</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="superadmin">Super Admin (Akses Penuh Seluruh Sistem)</option>
                  <option value="admin">Admin Operasional (Kelola Rute, Armada, & Manifest)</option>
                  <option value="sopir">Sopir (Portal Khusus Penjemputan Penumpang)</option>
                </select>
              </div>

              {formData.role === 'sopir' && (
                <div className="form-group">
                  <label>Hubungkan ke Profil Sopir</label>
                  <select
                    className="form-select"
                    value={formData.driverId}
                    onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  >
                    <option value="">-- Pilih Profil Sopir Terdaftar --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>Pak {d.name} ({d.phone})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>No. HP / WhatsApp</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Alamat Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="user@violettravel.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              </div>

              <div style={{ 
                padding: '1rem 1.5rem', 
                background: '#f8fafc', 
                borderTop: '1px solid var(--border)', 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '0.75rem',
                flexShrink: 0 
              }}>
                <button
                  type="button"
                  className="btn-select-vehicle"
                  style={{ width: 'auto', background: '#e2e8f0', color: 'var(--text-secondary)' }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-select-vehicle"
                  style={{ width: 'auto', padding: '0.75rem 2rem' }}
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
