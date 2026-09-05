import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { estimateRouteDetails, SUGGESTED_CITIES } from '../../utils/routeEstimator';

export const RouteSettings = () => {
  const { routes, schedules, addRoute, updateRoute, deleteRoute, clearAllRoutes, toggleRouteActive, addSchedule, deleteSchedule, formatRupiah, settings } = useTravel();

  const availablePickupTypes = settings?.pickupServiceTypes?.length > 0
    ? settings.pickupServiceTypes.filter(s => s.active !== false)
    : [
        { id: 'door-to-door', name: 'Door to Door (Alamat Rumah / Hotel)' },
        { id: 'pool-to-pool', name: 'Pool to Pool (Kantor / Cabang Violet)' },
        { id: 'airport-drop', name: 'Antar Jemput Bandara (Airport Shuttle)' },
        { id: 'point-to-point', name: 'Point to Point (Rest Area / Titik Kumpul)' },
        { id: 'charter-drop', name: 'Carter Drop / Privat Eksklusif' }
      ];

  const defaultPickupName = availablePickupTypes[0]?.name || 'Door to Door (Alamat Rumah / Hotel)';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [autoEstimatedInfo, setAutoEstimatedInfo] = useState(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    distance: '',
    duration: '',
    basePrice: 150000,
    pickupType: defaultPickupName
  });

  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [newScheduleLabel, setNewScheduleLabel] = useState('');

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setAutoEstimatedInfo(null);
    setFormData({
      origin: '',
      destination: '',
      distance: '',
      duration: '',
      basePrice: 150000,
      pickupType: defaultPickupName
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route) => {
    setEditingRoute(route);
    setAutoEstimatedInfo(null);
    setFormData({
      origin: route.origin,
      destination: route.destination,
      distance: route.distance,
      duration: route.duration,
      basePrice: route.basePrice,
      pickupType: route.pickupType || 'Door to Door'
    });
    setIsModalOpen(true);
  };

  const handleLocationChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    const originVal = field === 'origin' ? value : formData.origin;
    const destVal = field === 'destination' ? value : formData.destination;

    if (originVal && originVal.trim().length >= 2 && destVal && destVal.trim().length >= 2) {
      const est = estimateRouteDetails(originVal, destVal);
      if (est) {
        updated.distance = est.distance;
        updated.duration = est.duration;
        // Auto-suggest basePrice if not editing an existing custom route or basePrice is untouched
        if (!editingRoute || !formData.basePrice || formData.basePrice === 150000) {
          updated.basePrice = est.basePrice;
        }
        setAutoEstimatedInfo(est);
      } else {
        setAutoEstimatedInfo(null);
      }
    } else {
      setAutoEstimatedInfo(null);
    }
    setFormData(updated);
  };

  const handleRecalculate = () => {
    if (!formData.origin || !formData.destination) {
      alert('Silakan masukkan nama kota asal dan tujuan terlebih dahulu.');
      return;
    }
    const est = estimateRouteDetails(formData.origin, formData.destination);
    if (est) {
      setFormData(prev => ({
        ...prev,
        distance: est.distance,
        duration: est.duration,
        basePrice: est.basePrice
      }));
      setAutoEstimatedInfo(est);
    } else {
      alert(`Estimasi rute tidak ditemukan secara otomatis untuk "${formData.origin}" ke "${formData.destination}". Anda tetap dapat mengisi jarak dan durasi secara manual.`);
    }
  };

  const handleSaveRoute = (e) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) {
      alert('Kota asal dan tujuan harus diisi!');
      return;
    }

    if (editingRoute) {
      updateRoute(editingRoute.id, {
        ...formData,
        basePrice: Number(formData.basePrice)
      });
      setToastMsg(`Rute "${formData.origin} ➜ ${formData.destination}" berhasil diperbarui!`);
    } else {
      addRoute({
        ...formData,
        basePrice: Number(formData.basePrice)
      });
      setToastMsg(`Rute baru "${formData.origin} ➜ ${formData.destination}" berhasil ditambahkan!`);
    }

    setTimeout(() => setToastMsg(''), 4500);
    setIsModalOpen(false);
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!newScheduleTime) return;
    addSchedule({
      time: newScheduleTime,
      label: newScheduleLabel || 'Jadwal Reguler'
    });
    setNewScheduleTime('');
    setNewScheduleLabel('');
  };

  return (
    <div>
      {/* Route List Card */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header">
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              Daftar Rute Perjalanan Travel
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Atur kota keberangkatan, tujuan, estimasi waktu tempuh, dan tarif dasar tiket.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {routes.length > 0 && (
              <button
                type="button"
                className="btn-select-vehicle"
                style={{ width: 'auto', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.65rem 1.25rem' }}
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin menghapus SEMUA rute saat ini? Tindakan ini akan mengosongkan rute di cloud & lokal.')) {
                    clearAllRoutes();
                    setToastMsg('Semua rute berhasil dikosongkan!');
                    setTimeout(() => setToastMsg(''), 4000);
                  }
                }}
              >
                <Trash2 size={16} />
                <span>Kosongkan Semua Rute</span>
              </button>
            )}

            <button className="btn-add-entity" onClick={handleOpenAdd}>
              <Plus size={18} />
              <span>Tambah Rute Baru</span>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Rute (Asal ➜ Tujuan)</th>
                <th>Jarak & Durasi</th>
                <th>Layanan</th>
                <th>Tarif Dasar</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>Belum ada rute perjalanan yang tersimpan</div>
                    <div style={{ fontSize: '0.85rem' }}>Klik tombol <strong>Tambah Rute Baru</strong> di atas untuk menambahkan rute operasional Anda.</div>
                  </td>
                </tr>
              ) : (
                routes.map((route) => (
                <tr key={route.id}>
                  <td>
                    <button
                      onClick={() => toggleRouteActive(route.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      title="Klik untuk aktifkan / nonaktifkan rute"
                    >
                      <span className={`badge-status ${route.active ? 'active' : 'inactive'}`}>
                        {route.active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{route.origin}</strong>
                    <span style={{ margin: '0 6px', color: 'var(--primary)' }}>➜</span>
                    <strong style={{ color: 'var(--primary)' }}>{route.destination}</strong>
                  </td>
                  <td>
                    <div>{route.duration}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{route.distance}</span>
                  </td>
                  <td>
                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {route.pickupType}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--primary)' }}>
                      {formatRupiah(route.basePrice)}
                    </strong>
                  </td>
                  <td>
                    <div className="action-btns-group" style={{ justifyContent: 'center' }}>
                      <button
                        className="btn-table-icon"
                        onClick={() => handleOpenEdit(route)}
                        title="Edit Rute"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="btn-table-icon delete"
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus rute ${route.origin} ➜ ${route.destination}?`)) {
                            deleteRoute(route.id);
                          }
                        }}
                        title="Hapus Rute"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Management Card */}
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
              Master Jam Keberangkatan (Jadwal)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Jadwal keberangkatan harian yang dapat dipilih oleh pelanggan saat reservasi.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {schedules.map((sch) => (
            <div
              key={sch.id}
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="var(--primary)" />
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{sch.time}</strong>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sch.label}</span>
              </div>
              <button
                className="btn-table-icon delete"
                onClick={() => {
                  if (confirm(`Hapus jadwal ${sch.time}?`)) deleteSchedule(sch.id);
                }}
                title="Hapus Jadwal"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Schedule Form */}
        <form onSubmit={handleAddSchedule} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end', background: '#faf5ff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ede9fe' }}>
          <div className="form-group" style={{ minWidth: '180px' }}>
            <label>Jam Baru (misal: 07:30 WITA)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: 15:30 WITA"
              value={newScheduleTime}
              onChange={(e) => setNewScheduleTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ minWidth: '180px' }}>
            <label>Keterangan Sesi</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Sore Santai"
              value={newScheduleLabel}
              onChange={(e) => setNewScheduleLabel(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-add-entity">
            <Plus size={16} />
            <span>Tambah Jadwal</span>
          </button>
        </form>
      </div>

      {/* Add / Edit Route Modal */}
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
              <h3>{editingRoute ? 'Edit Rute Perjalanan' : 'Tambah Rute Baru'}</h3>
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
              onSubmit={handleSaveRoute} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                  e.preventDefault();
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
            >
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
                
                {/* Auto Estimate Badge Notification */}
                {autoEstimatedInfo && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: '#166534',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <Sparkles size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                      <span>
                        <strong>Jarak & Waktu Terisi Otomatis:</strong> {autoEstimatedInfo.distance} • {autoEstimatedInfo.duration}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      background: '#dcfce7', 
                      color: '#15803d', 
                      padding: '2px 8px', 
                      borderRadius: '10px', 
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      {autoEstimatedInfo.source === 'exact' ? '⚡ Rute Langsung' : '⚡ Estimasi Akurat'}
                    </span>
                  </div>
                )}

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ margin: 0 }}>Kota / Lokasi Asal *</label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Contoh: Bontang, Balikpapan</span>
                  </div>
                  <input
                    type="text"
                    list="origin-city-list"
                    className="form-control"
                    placeholder="Ketik nama kota (misal: Bontang)"
                    value={formData.origin}
                    onChange={(e) => handleLocationChange('origin', e.target.value)}
                    required
                  />
                  <datalist id="origin-city-list">
                    {SUGGESTED_CITIES.map((city, idx) => (
                      <option key={idx} value={city} />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ margin: 0 }}>Kota / Lokasi Tujuan *</label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Contoh: Tenggarong, Samarinda</span>
                  </div>
                  <input
                    type="text"
                    list="dest-city-list"
                    className="form-control"
                    placeholder="Ketik nama kota (misal: Tenggarong)"
                    value={formData.destination}
                    onChange={(e) => handleLocationChange('destination', e.target.value)}
                    required
                  />
                  <datalist id="dest-city-list">
                    {SUGGESTED_CITIES.map((city, idx) => (
                      <option key={idx} value={city} />
                    ))}
                  </datalist>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ margin: 0 }}>Estimasi Jarak</label>
                      {formData.origin && formData.destination && (
                        <button
                          type="button"
                          onClick={handleRecalculate}
                          title="Hitung ulang estimasi jarak & durasi"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            padding: 0
                          }}
                        >
                          <Sparkles size={12} /> Hitung
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 145 km"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ marginBottom: '4px' }}>Estimasi Waktu Tempuh</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 3 Jam via Poros"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Tarif Dasar per Kursi (Rp) *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="185000"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      required
                    />
                  </div>

                <div className="form-group">
                  <label>Tipe Layanan Penjemputan</label>
                  <select
                    className="form-select"
                    value={formData.pickupType}
                    onChange={(e) => setFormData({ ...formData, pickupType: e.target.value })}
                  >
                    {availablePickupTypes.map((pt) => (
                      <option key={pt.id} value={pt.name}>
                        {pt.name} {pt.badge ? `(${pt.badge})` : ''}
                      </option>
                    ))}
                  </select>
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
                  Simpan Rute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
