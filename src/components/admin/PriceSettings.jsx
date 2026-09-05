import React, { useState } from 'react';
import { 
  DollarSign, 
  Tag, 
  Plus, 
  Trash2, 
  Percent, 
  Check, 
  Car, 
  Save 
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const PriceSettings = () => {
  const { routes, vehicles, updateRoute, updateVehicle, settings, setSettings, formatRupiah } = useTravel();

  const [routePrices, setRoutePrices] = useState(() => {
    const initial = {};
    routes.forEach(r => { initial[r.id] = r.basePrice; });
    return initial;
  });

  const [vehicleFees, setVehicleFees] = useState(() => {
    const initial = {};
    vehicles.forEach(v => { initial[v.id] = v.extraFee || 0; });
    return initial;
  });

  const [newPromo, setNewPromo] = useState({
    code: '',
    discountPercent: 10,
    maxDiscount: 20000,
    description: ''
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleRoutePriceChange = (routeId, newPrice) => {
    setRoutePrices(prev => ({ ...prev, [routeId]: Number(newPrice) }));
  };

  const handleVehicleFeeChange = (vehicleId, newFee) => {
    setVehicleFees(prev => ({ ...prev, [vehicleId]: Number(newFee) }));
  };

  const handleSaveAllPrices = () => {
    // Update routes
    Object.keys(routePrices).forEach(id => {
      updateRoute(id, { basePrice: Number(routePrices[id]) });
    });

    // Update vehicles extra fee
    Object.keys(vehicleFees).forEach(id => {
      updateVehicle(id, { extraFee: Number(vehicleFees[id]) });
    });

    setSaveSuccessMsg('Seluruh penyesuaian tarif tiket berhasil disimpan!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleAddPromo = (e) => {
    e.preventDefault();
    if (!newPromo.code.trim()) return;

    const updatedPromos = [
      ...(settings.promoCodes || []),
      {
        code: newPromo.code.trim().toUpperCase(),
        discountPercent: Number(newPromo.discountPercent),
        maxDiscount: Number(newPromo.maxDiscount),
        description: newPromo.description || `Diskon ${newPromo.discountPercent}%`
      }
    ];

    setSettings({ ...settings, promoCodes: updatedPromos });
    setNewPromo({ code: '', discountPercent: 10, maxDiscount: 20000, description: '' });
  };

  const handleDeletePromo = (codeToDelete) => {
    const updatedPromos = settings.promoCodes.filter(p => p.code !== codeToDelete);
    setSettings({ ...settings, promoCodes: updatedPromos });
  };

  return (
    <div>
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div style={{
          background: 'var(--success-light)',
          color: 'var(--success)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={20} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Pricing Table */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header">
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              Pengaturan Tarif Dasar Rute
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Ubah tarif tiket per orang untuk masing-masing rute perjalanan.
            </p>
          </div>

          <button className="btn-add-entity" onClick={handleSaveAllPrices}>
            <Save size={18} />
            <span>Simpan Perubahan Tarif</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rute Perjalanan</th>
                <th>Jarak & Waktu</th>
                <th>Tarif Saat Ini</th>
                <th style={{ width: '220px' }}>Input Tarif Baru (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id}>
                  <td>
                    <strong>{route.origin} ➜ {route.destination}</strong>
                  </td>
                  <td>
                    <span>{route.duration} ({route.distance})</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formatRupiah(route.basePrice)}
                    </span>
                  </td>
                  <td>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rp</span>
                      <input
                        type="number"
                        className="form-control"
                        style={{ paddingLeft: '34px', height: '40px', fontWeight: 700 }}
                        value={routePrices[route.id] ?? route.basePrice}
                        onChange={(e) => handleRoutePriceChange(route.id, e.target.value)}
                        step="5000"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Surcharge Setting */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header">
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              Tambahan Tarif Berdasarkan Kelas Armada
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Biaya tambahan opsional per kursi untuk armada luxury / VIP (misal: HiAce Premio, Innova Reborn).
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Armada</th>
                <th>Plat Nomor</th>
                <th>Kategori Kelas</th>
                <th style={{ width: '220px' }}>Biaya Tambahan (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>
                    <strong>{v.name}</strong>
                  </td>
                  <td>
                    <span className="vehicle-plate">{v.plateNumber}</span>
                  </td>
                  <td>
                    <span style={{ background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                      {v.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>+Rp</span>
                      <input
                        type="number"
                        className="form-control"
                        style={{ paddingLeft: '40px', height: '40px', fontWeight: 700 }}
                        value={vehicleFees[v.id] ?? (v.extraFee || 0)}
                        onChange={(e) => handleVehicleFeeChange(v.id, e.target.value)}
                        step="5000"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button className="btn-add-entity" onClick={handleSaveAllPrices}>
            <Save size={18} />
            <span>Simpan Perubahan Biaya Kelas</span>
          </button>
        </div>
      </div>

      {/* Promo & Discount Management */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              Manajemen Kode Promo & Diskon
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Atur kode diskon promo yang dapat dimasukkan penumpang saat memesan tiket.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {settings.promoCodes?.map((promo) => (
            <div
              key={promo.code}
              style={{
                background: '#faf5ff',
                border: '1.5px dashed var(--border-focus)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={16} color="var(--primary)" />
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                    {promo.code}
                  </strong>
                  <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    {promo.discountPercent}% OFF
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {promo.description} • Maks. {formatRupiah(promo.maxDiscount)}
                </p>
              </div>

              <button
                className="btn-table-icon delete"
                onClick={() => handleDeletePromo(promo.code)}
                title="Hapus Promo"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Promo Form */}
        <form onSubmit={handleAddPromo} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr auto', gap: '0.75rem', alignItems: 'flex-end', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div className="form-group">
            <label>Kode Promo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: MERDEKA20"
              style={{ textTransform: 'uppercase' }}
              value={newPromo.code}
              onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Diskon (%)</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max="90"
              value={newPromo.discountPercent}
              onChange={(e) => setNewPromo({ ...newPromo, discountPercent: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Maks. Potongan (Rp)</label>
            <input
              type="number"
              className="form-control"
              value={newPromo.maxDiscount}
              onChange={(e) => setNewPromo({ ...newPromo, maxDiscount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Keterangan Promo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Diskon Liburan"
              value={newPromo.description}
              onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-add-entity" style={{ height: '44px' }}>
            <Plus size={16} />
            <span>Tambah</span>
          </button>
        </form>
      </div>
    </div>
  );
};
