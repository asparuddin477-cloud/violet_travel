import React, { useState, useRef } from 'react';
import { 
  Car, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  CheckCircle2, 
  X, 
  Armchair,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Eye
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const VehicleSettings = () => {
  const { vehicles, drivers, addVehicle, updateVehicle, deleteVehicle, formatRupiah } = useTravel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [toastMsg, setToastMsg] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    plateNumber: '',
    type: 'hiace_premio',
    category: 'Executive Luxury',
    capacity: 10,
    seatLayoutType: 'hiace-10',
    extraFee: 30000,
    facilitiesText: 'AC Dingin Double Blower, Reclining Seat, USB Charger, Air Mineral',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    assignedDriverId: '',
    status: 'Aktif'
  });

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setImageInputMode('upload');
    setFormData({
      name: '',
      plateNumber: '',
      type: 'hiace_premio',
      category: 'Executive Luxury',
      capacity: 10,
      seatLayoutType: 'hiace-10',
      extraFee: 25000,
      facilitiesText: 'AC Dingin Double Blower, Reclining Captain Seat, USB Fast Charging, Bagasi Luas',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      assignedDriverId: drivers[0]?.id || '',
      status: 'Aktif'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVehicle(v);
    setImageInputMode('upload');
    setFormData({
      name: v.name,
      plateNumber: v.plateNumber,
      type: v.type || 'hiace_premio',
      category: v.category || 'Executive Luxury',
      capacity: v.capacity || 10,
      seatLayoutType: v.seatLayoutType || 'hiace-10',
      extraFee: v.extraFee || 0,
      facilitiesText: v.facilities?.join(', ') || '',
      imageUrl: v.imageUrl || '',
      assignedDriverId: v.assignedDriverId || '',
      status: v.status || 'Aktif'
    });
    setIsModalOpen(true);
  };

  // Handle local file upload (HP Camera, Gallery, or PC folder)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target?.result;
      if (base64Data) {
        setFormData(prev => ({ ...prev, imageUrl: base64Data }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLayoutChange = (lType) => {
    let cap = 10;
    if (lType === 'innova-6') cap = 6;
    if (lType === 'innova-7') cap = 7;
    if (lType === 'hiace-14') cap = 14;
    if (lType === 'veloz-5') cap = 5;
    if (lType === 'elf-16') cap = 16;
    if (lType === 'staria-7') cap = 7;
    setFormData(prev => ({ ...prev, seatLayoutType: lType, capacity: cap }));
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.plateNumber) {
      alert('Nama armada dan nomor plat polisi wajib diisi!');
      return;
    }

    const facilities = formData.facilitiesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      plateNumber: formData.plateNumber.toUpperCase(),
      type: formData.type,
      category: formData.category,
      capacity: Number(formData.capacity),
      seatLayoutType: formData.seatLayoutType,
      extraFee: Number(formData.extraFee),
      facilities,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      assignedDriverId: formData.assignedDriverId,
      status: formData.status
    };

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, payload);
      setToastMsg(`Perubahan armada "${payload.name}" berhasil disimpan!`);
    } else {
      addVehicle(payload);
      setToastMsg(`Armada baru "${payload.name}" berhasil ditambahkan!`);
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
            Manajemen Jenis Armada & Kendaraan
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Upload foto asli kendaraan yang akan dilihat calon penumpang, atur jenis denah kursi, plat nomor, dan sopir bertugas.
          </p>
        </div>

        <button className="btn-add-entity" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Upload & Tambah Armada Baru</span>
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Foto & Nama Armada</th>
              <th>Kategori & Tipe Kursi</th>
              <th>Kapasitas</th>
              <th>Surcharge (Biaya Ekstra)</th>
              <th>Pengemudi (Sopir)</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => {
              const driver = drivers.find(d => d.id === v.assignedDriverId);
              return (
                <tr key={v.id}>
                  <td>
                    <span className={`badge-status ${v.status === 'Aktif' ? 'active' : 'inactive'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative', width: '64px', height: '46px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--border)', flexShrink: 0 }}>
                        <img 
                          src={v.imageUrl} 
                          alt={v.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <strong>{v.name}</strong>
                        <div style={{ marginTop: '2px' }}>
                          <span className="vehicle-plate">{v.plateNumber}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{v.category}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                      Denah: {v.seatLayoutType}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} color="var(--primary)" />
                      <strong>{v.capacity} Kursi</strong>
                    </div>
                  </td>
                  <td>
                    <span>+{formatRupiah(v.extraFee || 0)}</span>
                  </td>
                  <td>
                    {driver ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <img 
                          src={driver.avatar} 
                          alt={driver.name} 
                          style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                        />
                        <span>Pak {driver.name}</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Belum Ditugaskan</span>
                    )}
                  </td>
                  <td>
                    <div className="action-btns-group" style={{ justifyContent: 'center' }}>
                      <button
                        className="btn-table-icon"
                        onClick={() => handleOpenEdit(v)}
                        title="Edit Armada & Foto"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="btn-table-icon delete"
                        onClick={() => {
                          if (confirm(`Hapus unit kendaraan ${v.name} (${v.plateNumber})?`)) {
                            deleteVehicle(v.id);
                          }
                        }}
                        title="Hapus Armada"
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

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div 
          className="modal-backdrop" 
          /* Do not close on backdrop click to prevent losing typed data when selecting text or clicking near scrollbar */
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              // Ignore accidental clicks outside to safeguard user typing
            }
          }}
        >
          <div 
            className="ticket-modal-card" 
            style={{ 
              maxWidth: '680px', 
              width: '95%',
              maxHeight: '92vh', 
              display: 'flex', 
              flexDirection: 'column' 
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ticket-header" style={{ flexShrink: 0 }}>
              <div>
                <h3 style={{ margin: 0 }}>{editingVehicle ? 'Edit Unit Armada & Foto' : 'Tambah Armada & Upload Foto Kendaraan'}</h3>
                <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: '2px 0 0' }}>
                  Foto akan langsung ditampilkan ke calon penumpang saat memilih mobil
                </p>
              </div>
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
              onSubmit={handleSaveVehicle} 
              onKeyDown={(e) => {
                // Prevent accidental Enter key from submitting while typing in input fields
                if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                  e.preventDefault();
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
            >
              {/* Scrollable Form Fields Body */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', overflowY: 'auto', flex: 1 }}>
              
              {/* Photo Upload Section */}
              <div style={{ background: '#f8fafc', border: '1.5px dashed var(--border-focus)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon size={18} color="var(--primary)" />
                    Foto Kendaraan untuk Calon Penumpang *
                  </label>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: imageInputMode === 'upload' ? 'var(--primary)' : '#e2e8f0',
                        color: imageInputMode === 'upload' ? 'white' : 'var(--text-secondary)'
                      }}
                    >
                      Unggah Berkas
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: imageInputMode === 'url' ? 'var(--primary)' : '#e2e8f0',
                        color: imageInputMode === 'url' ? 'white' : 'var(--text-secondary)'
                      }}
                    >
                      Link URL
                    </button>
                  </div>
                </div>

                {/* Preview Box */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ width: '160px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--border)', background: '#e2e8f0', flexShrink: 0 }}>
                    {formData.imageUrl ? (
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview Mobil" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        Belum Ada Foto
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    {imageInputMode === 'upload' ? (
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileUpload}
                        />
                        <button
                          type="button"
                          className="btn-select-vehicle"
                          style={{ width: '100%', background: '#ffffff', color: 'var(--primary)', border: '1.5px solid var(--primary)', padding: '0.65rem 1rem' }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload size={16} />
                          <span>Pilih Foto dari Galeri HP / Komputer</span>
                        </button>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Format: JPG, PNG, WEBP (foto tampak luar atau kabin mobil).
                        </span>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Tempelkan tautan gambar mobil beresolusi jelas.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Names & Plate */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Nama Model Kendaraan *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Toyota HiAce Premio Executive"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nomor Plat Polisi *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="KT 1234 VT"
                    style={{ textTransform: 'uppercase' }}
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Category & Dynamic Seat Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Kategori Kelas Armada</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Executive Luxury">Executive Luxury</option>
                    <option value="VIP Private / Shuttle">VIP Private / Shuttle</option>
                    <option value="Reguler Eksekutif">Reguler Eksekutif</option>
                    <option value="Reguler Hemat">Reguler Hemat</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ color: 'var(--primary)' }}>
                    <Armchair size={15} />
                    <span>Jenis Denah Kursi Penumpang *</span>
                  </label>
                  <select
                    className="form-select"
                    style={{ borderColor: 'var(--border-focus)', fontWeight: 600 }}
                    value={formData.seatLayoutType}
                    onChange={(e) => handleLayoutChange(e.target.value)}
                  >
                    <option value="hiace-10">Toyota HiAce Premio (10 Kursi Penumpang)</option>
                    <option value="innova-6">Toyota Innova Reborn Luxury (6 Kursi Captain Seat)</option>
                    <option value="innova-7">Toyota Innova Reborn Standard (7 Kursi)</option>
                    <option value="hiace-14">Toyota HiAce Commuter (14 Kursi Penumpang)</option>
                    <option value="veloz-5">Toyota All New Veloz / Avanza (5 Kursi)</option>
                    <option value="staria-7">Hyundai Staria VIP Lounge (7 Kursi)</option>
                    <option value="elf-16">Isuzu Elf Long Microbus (16 Kursi)</option>
                  </select>
                </div>
              </div>

              {/* Capacity, Extra Fee, Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Kapasitas Kursi (Otomatis)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Biaya Tambahan (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.extraFee}
                    onChange={(e) => setFormData({ ...formData, extraFee: e.target.value })}
                    step="5000"
                  />
                </div>

                <div className="form-group">
                  <label>Status Operasional</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Servis">Dalam Perawatan / Servis</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Sopir Penanggung Jawab Armada</label>
                <select
                  className="form-select"
                  value={formData.assignedDriverId}
                  onChange={(e) => setFormData({ ...formData, assignedDriverId: e.target.value })}
                >
                  <option value="">-- Belum Ditugaskan / Sopir Lepas --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>Pak {d.name} ({d.phone})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fasilitas Armada (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="AC Dingin Double Blower, Reclining Seat, USB Fast Charging, Air Mineral"
                  value={formData.facilitiesText}
                  onChange={(e) => setFormData({ ...formData, facilitiesText: e.target.value })}
                />
              </div>

              </div>

              {/* Sticky Modal Action Footer - Always visible! */}
              <div style={{ 
                padding: '1rem 1.5rem', 
                background: '#f8fafc', 
                borderTop: '1px solid var(--border)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexShrink: 0 
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  * Pastikan nama & nomor plat sudah terisi
                </span>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                    Simpan Armada & Foto
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
