import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Phone, 
  CreditCard, 
  RotateCcw, 
  Save, 
  Check, 
  Plus, 
  Trash2,
  AlertTriangle,
  Navigation,
  MapPin,
  CheckCircle2,
  Cloud,
  Database,
  UploadCloud,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { INITIAL_SETTINGS } from '../../data/initialData';

export const GeneralSettings = () => {
  const { 
    settings, 
    setSettings, 
    resetToDefaults, 
    formatRupiah,
    isCloudConnected,
    cloudSyncState,
    activeProjectId,
    syncToCloud
  } = useTravel();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState(null);

  const [form, setForm] = useState({
    companyName: settings.companyName || 'Violet Transport',
    legalName: settings.legalName || 'PT Violet Transport Nusantara',
    tagline: settings.tagline || 'Your Trusted Travel Partner - Perjalanan Eksekutif Aman, Nyaman, & Tepat Waktu',
    heroBadge: settings.heroBadge || 'Official Executive Travel & Shuttle Partner',
    heroTitle: settings.heroTitle || 'Pesan Tiket Travel Cepat, Pilih Kursi Sendiri Sesuai Kenyamanan Anda',
    heroDesc: settings.heroDesc || 'Layanan antar jemput door-to-door dengan armada Innova, iNNOVA. Didukung pengemudi berpengalaman, tarif transparan, dan sistem reservasi real-time.',
    csPhone: settings.csPhone || '0812-3456-7890',
    csWhatsApp: settings.csWhatsApp || '6281234567890',
    email: settings.email || 'halo@violettransport.id',
    address: settings.address || 'Jl. P. Antasari No. 88, Samarinda'
  });

  useEffect(() => {
    if (settings) {
      setForm(prev => ({
        ...prev,
        companyName: settings.companyName ?? prev.companyName,
        legalName: settings.legalName ?? prev.legalName,
        tagline: settings.tagline ?? prev.tagline,
        heroBadge: settings.heroBadge ?? prev.heroBadge,
        heroTitle: settings.heroTitle ?? prev.heroTitle,
        heroDesc: settings.heroDesc ?? prev.heroDesc,
        csPhone: settings.csPhone ?? prev.csPhone,
        csWhatsApp: settings.csWhatsApp ?? prev.csWhatsApp,
        email: settings.email ?? prev.email,
        address: settings.address ?? prev.address
      }));
      if (settings.bankAccounts) setBankAccounts(settings.bankAccounts);
      if (settings.pickupServiceTypes) setPickupTypes(settings.pickupServiceTypes);
    }
  }, [settings]);

  const [bankAccounts, setBankAccounts] = useState(settings.bankAccounts || []);
  const [pickupTypes, setPickupTypes] = useState(
    settings.pickupServiceTypes && settings.pickupServiceTypes.length > 0
      ? settings.pickupServiceTypes
      : (INITIAL_SETTINGS.pickupServiceTypes || [])
  );

  const [newPickupType, setNewPickupType] = useState({
    name: '',
    badge: 'Tersedia',
    description: '',
    extraFee: 0
  });

  const [successMsg, setSuccessMsg] = useState('');

  const [newBank, setNewBank] = useState({
    bank: '',
    accountNumber: '',
    holder: ''
  });

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    setSettings({
      ...settings,
      ...form,
      bankAccounts,
      pickupServiceTypes: pickupTypes
    });
    setSuccessMsg('Informasi profil travel, rekening, dan tipe pelayanan penjemputan berhasil diperbarui!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddPickupType = (e) => {
    e.preventDefault();
    if (!newPickupType.name.trim()) return;
    const item = {
      id: `pst-${Date.now()}`,
      name: newPickupType.name.trim(),
      code: newPickupType.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      badge: newPickupType.badge.trim() || 'Tersedia',
      description: newPickupType.description.trim() || 'Layanan penjemputan resmi penumpang Violet Transport.',
      extraFee: Number(newPickupType.extraFee) || 0,
      active: true
    };
    const updated = [...pickupTypes, item];
    setPickupTypes(updated);
    setSettings({
      ...settings,
      pickupServiceTypes: updated
    });
    setNewPickupType({ name: '', badge: 'Tersedia', description: '', extraFee: 0 });
    setSuccessMsg(`Tipe pelayanan penjemputan "${item.name}" berhasil ditambahkan!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleTogglePickupType = (id) => {
    const updated = pickupTypes.map(pt => pt.id === id ? { ...pt, active: !pt.active } : pt);
    setPickupTypes(updated);
    setSettings({
      ...settings,
      pickupServiceTypes: updated
    });
  };

  const handleDeletePickupType = (id) => {
    const target = pickupTypes.find(pt => pt.id === id);
    if (confirm(`Hapus tipe penjemputan "${target?.name}"?`)) {
      const updated = pickupTypes.filter(pt => pt.id !== id);
      setPickupTypes(updated);
      setSettings({
        ...settings,
        pickupServiceTypes: updated
      });
    }
  };

  const handleAddBank = (e) => {
    e.preventDefault();
    if (!newBank.bank || !newBank.accountNumber) return;
    setBankAccounts([...bankAccounts, { ...newBank }]);
    setNewBank({ bank: '', accountNumber: '', holder: '' });
  };

  const handleDeleteBank = (idx) => {
    setBankAccounts(bankAccounts.filter((_, i) => i !== idx));
  };

  const handleResetData = () => {
    if (confirm('PERHATIAN: Apakah Anda yakin ingin mereset seluruh data kembali ke data contoh bawaan (default)? Semua pesanan baru yang ditambahkan manual akan diatur ulang.')) {
      resetToDefaults();
      alert('Data sistem telah direset ke default pabrik.');
      window.location.reload();
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const res = await syncToCloud();
      setSyncStatusMsg({ type: 'success', text: res.message });
      setTimeout(() => setSyncStatusMsg(null), 5000);
    } catch (err) {
      setSyncStatusMsg({ type: 'error', text: err.message || 'Gagal menyinkronkan data ke Cloud Firestore.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {successMsg && (
        <div style={{
          background: 'var(--success-light)',
          color: 'var(--success)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="/logo.png" 
              alt="Violet Transport Logo" 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                objectFit: 'cover', 
                border: '2.5px solid #ede9fe', 
                boxShadow: '0 4px 12px rgba(109,40,217,0.18)' 
              }} 
            />
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>
                Profil & Identitas Violet Transport
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                Logo resmi dan informasi ini tertera pada E-Ticket pelanggan, navbar, dan sistem reservasi.
              </p>
            </div>
          </div>

          <button className="btn-add-entity" onClick={handleSaveProfile}>
            <Save size={18} />
            <span>Simpan Profil</span>
          </button>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Nama Brand Travel</label>
              <input
                type="text"
                className="form-control"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Badan Usaha / Legal PT</label>
              <input
                type="text"
                className="form-control"
                value={form.legalName}
                onChange={(e) => setForm({ ...form, legalName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tagline / Slogan</label>
            <input
              type="text"
              className="form-control"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </div>

          {/* Kolom Konten Hero Banner (Halaman Depan) */}
          <div style={{ 
            background: 'linear-gradient(135deg, #fbf8ff 0%, #f3e8ff 100%)', 
            border: '1.5px solid #d8b4fe', 
            borderRadius: 'var(--radius-md)', 
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '0.25rem',
            marginBottom: '0.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>✨</span>
              <div>
                <strong style={{ fontSize: '0.96rem', color: '#6b21a8' }}>
                  Konten Banner Utama (Hero Banner Halaman Depan)
                </strong>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#7e22ce' }}>
                  Atur teks judul besar dan deskripsi layanan yang langsung dilihat pengunjung di bagian atas halaman utama.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 700, color: '#4c1d95' }}>
                Judul Utama Banner (Headline)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Pesan Tiket Travel Cepat, Pilih Kursi Sendiri Sesuai Kenyamanan Anda"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                style={{ borderColor: '#c084fc', background: '#ffffff', fontWeight: 600 }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>
                Teks judul besar utama yang tampil di atas halaman pemesanan tiket.
              </span>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 700, color: '#4c1d95' }}>
                Deskripsi / Rincian Layanan Banner (Sub-headline)
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Contoh: Layanan antar jemput door-to-door dengan armada Innova, iNNOVA. Didukung pengemudi berpengalaman, tarif transparan, dan sistem reservasi real-time."
                value={form.heroDesc}
                onChange={(e) => setForm({ ...form, heroDesc: e.target.value })}
                style={{ borderColor: '#c084fc', background: '#ffffff', resize: 'vertical' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>
                Teks deskripsi layanan penjemputan, armada, dan informasi keunggulan travel.
              </span>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 600, color: '#4c1d95', fontSize: '0.84rem' }}>
                Badge Label di Atas Judul (Opsional)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Official Executive Travel & Shuttle Partner"
                value={form.heroBadge}
                onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
                style={{ borderColor: '#c084fc', background: '#ffffff' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Nomor Telepon CS</label>
              <input
                type="text"
                className="form-control"
                value={form.csPhone}
                onChange={(e) => setForm({ ...form, csPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>WhatsApp CS (Format 62...)</label>
              <input
                type="text"
                className="form-control"
                value={form.csWhatsApp}
                onChange={(e) => setForm({ ...form, csWhatsApp: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email Support</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Alamat Pool & Kantor Utama</label>
            <input
              type="text"
              className="form-control"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </form>
      </div>

      {/* Pickup Service Types Management Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#ede9fe', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
              <Navigation size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>
                Tipe Pelayanan Penjemputan Penumpang
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                Atur jenis opsi penjemputan (Door to Door, Pool, Bandara, Point to Point, Carter Privat) yang dapat dipilih calon penumpang.
              </p>
            </div>
          </div>

          <button className="btn-add-entity" onClick={handleSaveProfile}>
            <Save size={18} />
            <span>Simpan Perubahan</span>
          </button>
        </div>

        {/* List of pickup service types */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {pickupTypes.map((pt) => (
            <div
              key={pt.id}
              style={{
                background: pt.active ? '#ffffff' : '#f8fafc',
                border: pt.active ? '1.5px solid var(--border-focus)' : '1px dashed var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem',
                opacity: pt.active ? 1 : 0.65,
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
                boxShadow: pt.active ? '0 2px 8px rgba(109,40,217,0.06)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {pt.name}
                  </strong>
                  {pt.badge && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '2px 8px', 
                      background: '#ede9fe', 
                      color: '#6d28d9', 
                      borderRadius: '6px', 
                      fontWeight: 700,
                      whiteSpace: 'nowrap'
                    }}>
                      {pt.badge}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                  {pt.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.65rem', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: pt.extraFee > 0 ? '#d97706' : '#059669' }}>
                  {pt.extraFee > 0 ? `+${formatRupiah(pt.extraFee)}` : 'Gratis / Termasuk Tiket'}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleTogglePickupType(pt.id)}
                    style={{
                      border: 'none',
                      background: pt.active ? '#dcfce7' : '#e2e8f0',
                      color: pt.active ? '#166534' : '#64748b',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {pt.active ? '● Aktif' : '○ Nonaktif'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePickupType(pt.id)}
                    title="Hapus Tipe Layanan"
                    style={{
                      border: 'none',
                      background: '#fee2e2',
                      color: '#dc2626',
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Pickup Type Form */}
        <form onSubmit={handleAddPickupType} style={{ background: '#faf5ff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #ede9fe', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Tambah Tipe Pelayanan Penjemputan Baru</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Nama Tipe Penjemputan *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Jemput Khusus Rumah Sakit"
                value={newPickupType.name}
                onChange={(e) => setNewPickupType({ ...newPickupType, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Label Badge (Opsional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Prioritas / VIP"
                value={newPickupType.badge}
                onChange={(e) => setNewPickupType({ ...newPickupType, badge: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Biaya Tambahan (Rp)</label>
              <input
                type="number"
                className="form-control"
                placeholder="0 (Gratis)"
                value={newPickupType.extraFee}
                onChange={(e) => setNewPickupType({ ...newPickupType, extraFee: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Deskripsi Pelayanan untuk Calon Penumpang</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Penjemputan tepat waktu di lobi gedung atau gate kedatangan"
              value={newPickupType.description}
              onChange={(e) => setNewPickupType({ ...newPickupType, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-add-entity" style={{ width: 'auto', padding: '0.65rem 1.5rem' }}>
              <Plus size={16} />
              <span>Tambahkan Tipe Layanan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Bank Account Settings */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              Rekening Pembayaran & QRIS
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Daftar nomor rekening yang ditampilkan kepada penumpang saat checkout tiket.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {bankAccounts.map((b, i) => (
            <div
              key={i}
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <strong style={{ fontSize: '1rem', color: 'var(--primary)', display: 'block' }}>
                  {b.bank}
                </strong>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>
                  {b.accountNumber}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  a/n {b.holder}
                </span>
              </div>

              <button
                className="btn-table-icon delete"
                onClick={() => handleDeleteBank(i)}
                title="Hapus Rekening"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Bank Form */}
        <form onSubmit={handleAddBank} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.5fr auto', gap: '0.75rem', alignItems: 'flex-end', background: '#faf5ff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ede9fe' }}>
          <div className="form-group">
            <label>Nama Bank / E-Wallet</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: BCA / BNI"
              value={newBank.bank}
              onChange={(e) => setNewBank({ ...newBank, bank: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Nomor Rekening</label>
            <input
              type="text"
              className="form-control"
              placeholder="8920-1928-31"
              value={newBank.accountNumber}
              onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Atas Nama (Pemilik)</label>
            <input
              type="text"
              className="form-control"
              placeholder="PT Violet Travel"
              value={newBank.holder}
              onChange={(e) => setNewBank({ ...newBank, holder: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-add-entity" style={{ height: '44px' }}>
            <Plus size={16} />
            <span>Tambah</span>
          </button>
        </form>
      </div>

      {/* Cloud Database & Firebase Status */}
      <div className="admin-card" style={{ borderColor: isCloudConnected ? '#a7f3d0' : '#e2e8f0', background: isCloudConnected ? '#f0fdf4' : '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h4 style={{ color: isCloudConnected ? '#065f46' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cloud size={20} color={isCloudConnected ? '#059669' : '#64748b'} />
              Status Database Cloud (Firebase Firestore)
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Sinkronisasi data multi-user real-time agar pelanggan, admin, dan sopir dapat mengakses sistem bersamaan dari berbagai perangkat.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              className={`cloud-badge-tag ${isCloudConnected ? 'online' : 'local'}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: isCloudConnected ? '#dcfce7' : '#e2e8f0',
                color: isCloudConnected ? '#15803d' : '#475569'
              }}
            >
              <span className={`pulse-dot ${isCloudConnected ? 'online' : 'local'}`} />
              {isCloudConnected ? `Terhubung: ${activeProjectId}` : 'Mode Lokal (Offline Demo)'}
            </span>
          </div>
        </div>

        {syncStatusMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: syncStatusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: syncStatusMsg.type === 'success' ? '#15803d' : '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {syncStatusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{syncStatusMsg.text}</span>
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Status Real-Time:</span>
              <strong style={{ color: isCloudConnected ? '#16a34a' : '#d97706' }}>
                {isCloudConnected ? 'Aktif (Auto-Sync WebSockets)' : 'Tersimpan di Penyimpanan Lokal Browser'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Firebase Project:</span>
              <strong style={{ fontFamily: 'monospace' }}>{activeProjectId || 'Belum Ada (Lihat .env)'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Target Hosting:</span>
              <strong>Vercel (Production Ready)</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, maxWidth: '600px' }}>
            {isCloudConnected ? (
              <>Setiap penambahan rute, armada, sopir, atau pemesanan tiket baru akan otomatis tersimpan langsung ke Cloud Firestore secara real-time.</>
            ) : (
              <>Untuk mengaktifkan database online, masukkan konfigurasi Firebase Anda ke dalam file <code>.env.local</code> atau environment variables di Vercel.</>
            )}
          </p>

          {isCloudConnected && (
            <button
              type="button"
              className="btn-select-vehicle"
              style={{
                width: 'auto',
                background: 'var(--primary)',
                padding: '0.65rem 1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={handleSyncToCloud}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Sedang Mengunggah...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>Unggah & Sinkronkan Data ke Firestore</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Danger Zone: Reset to Default */}
      <div className="admin-card" style={{ borderColor: 'var(--danger-light)', background: '#fffafa' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={18} />
              Reset Database & Data Contoh
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              Kembalikan semua rute, jadwal, harga, armada, driver, dan pemesanan ke data awal default bawaan sistem.
            </p>
          </div>

          <button
            className="btn-select-vehicle"
            style={{ width: 'auto', background: 'var(--danger)', padding: '0.65rem 1.25rem' }}
            onClick={handleResetData}
          >
            <RotateCcw size={16} />
            <span>Reset ke Data Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
