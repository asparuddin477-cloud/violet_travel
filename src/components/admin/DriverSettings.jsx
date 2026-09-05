import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Phone, 
  Award, 
  Star, 
  X, 
  Car,
  ShieldCheck,
  CheckCircle2 
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const DriverSettings = () => {
  const { drivers, vehicles, addDriver, updateDriver, deleteDriver } = useTravel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: 'SIM B1 Umum',
    experience: '5 Tahun',
    status: 'Siap Jalan',
    assignedVehicleId: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  });

  const handleOpenAdd = () => {
    setEditingDriver(null);
    setFormData({
      name: '',
      phone: '',
      licenseNumber: 'SIM B1 Umum 92102931',
      experience: '5 Tahun',
      status: 'Siap Jalan',
      assignedVehicleId: vehicles[0]?.id || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setEditingDriver(d);
    setFormData({
      name: d.name,
      phone: d.phone,
      licenseNumber: d.licenseNumber || 'SIM A Umum',
      experience: d.experience || '3 Tahun',
      status: d.status || 'Siap Jalan',
      assignedVehicleId: d.assignedVehicleId || '',
      avatar: d.avatar || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveDriver = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Nama pengemudi dan nomor kontak WhatsApp wajib diisi!');
      return;
    }

    if (editingDriver) {
      updateDriver(editingDriver.id, formData);
      setToastMsg(`Profil driver Pak "${formData.name}" berhasil diperbarui!`);
    } else {
      addDriver(formData);
      setToastMsg(`Driver baru Pak "${formData.name}" berhasil ditambahkan!`);
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
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
            Manajemen Sopir & Pengemudi Travel
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Kelola data pengemudi resmi, lisensi SIM, nomor kontak WhatsApp, dan penugasan armada.
          </p>
        </div>

        <button className="btn-add-entity" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Tambah Sopir Baru</span>
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Nama Pengemudi</th>
              <th>Kontak WhatsApp</th>
              <th>Nomor & Jenis SIM</th>
              <th>Pengalaman</th>
              <th>Rating Pelanggan</th>
              <th>Armada Pegangan</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => {
              const vehicle = vehicles.find(v => v.id === driver.assignedVehicleId);
              return (
                <tr key={driver.id}>
                  <td>
                    <span className={`badge-status ${driver.status === 'Siap Jalan' ? 'siap' : driver.status === 'Sedang Jalan' ? 'tugas' : 'libur'}`}>
                      {driver.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={driver.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'} 
                        alt={driver.name || 'Sopir'} 
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <strong>Pak {driver.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {driver.tripsCount || 0}x Perjalanan Selesai
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={14} color="var(--primary)" />
                      <span>{driver.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {driver.licenseNumber}
                    </span>
                  </td>
                  <td>{driver.experience}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <strong>{driver.rating || 5.0}</strong>
                    </div>
                  </td>
                  <td>
                    {vehicle ? (
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        {vehicle.name} ({vehicle.plateNumber})
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Cadangan</span>
                    )}
                  </td>
                  <td>
                    <div className="action-btns-group" style={{ justifyContent: 'center' }}>
                      <button
                        className="btn-table-icon"
                        onClick={() => handleOpenEdit(driver)}
                        title="Edit Data Sopir"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="btn-table-icon delete"
                        onClick={() => {
                          if (confirm(`Hapus sopir Pak ${driver.name}?`)) {
                            deleteDriver(driver.id);
                          }
                        }}
                        title="Hapus Sopir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Driver Modal */}
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
              maxWidth: '540px',
              width: '95%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ticket-header" style={{ flexShrink: 0 }}>
              <h3>{editingDriver ? 'Edit Profil Sopir' : 'Tambah Sopir Baru'}</h3>
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
              onSubmit={handleSaveDriver} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                  e.preventDefault();
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
            >
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
              <div className="form-group">
                <label>Nama Lengkap Sopir *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Nomor WhatsApp / HP *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nomor & Tipe SIM</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="SIM B1 Umum 92019"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Pengalaman Mengemudi</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: 6 Tahun"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status Operasional</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Siap Jalan">Siap Jalan</option>
                    <option value="Sedang Jalan">Sedang Jalan</option>
                    <option value="Libur">Libur / Cuti</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Armada Kendaraan yang Dipegang</label>
                <select
                  className="form-select"
                  value={formData.assignedVehicleId}
                  onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
                >
                  <option value="">-- Tidak Terikat Armada Tertentu --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.plateNumber})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>URL Foto Avatar Sopir</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                />
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
                  Simpan Sopir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
