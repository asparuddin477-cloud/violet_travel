import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CreditCard, 
  Tag, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight,
  QrCode,
  Building2,
  Banknote,
  Navigation 
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { INITIAL_SETTINGS } from '../../data/initialData';

export const PassengerForm = ({ 
  vehicle, 
  activeRoute, 
  searchParams, 
  selectedSeats, 
  onBookingSuccess 
}) => {
  const { settings, drivers, addBooking, formatRupiah } = useTravel();

  const availablePickupTypes = (settings.pickupServiceTypes && settings.pickupServiceTypes.length > 0)
    ? settings.pickupServiceTypes.filter(pt => pt.active !== false)
    : (INITIAL_SETTINGS.pickupServiceTypes || []);

  const defaultPickupName = availablePickupTypes.find(pt => pt.name === activeRoute?.pickupType)?.name 
    || availablePickupTypes[0]?.name 
    || 'Door to Door (Alamat Rumah / Hotel)';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupType: defaultPickupName,
    pickupAddress: '',
    dropoffAddress: '',
    notes: '',
    paymentMethod: 'QRIS'
  });

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Driver details
  const driver = drivers.find(d => d.id === vehicle.assignedDriverId) || {
    name: 'Sopir Terjadwal',
    phone: '0812-3456-7890'
  };

  // Pricing calculations
  const selectedPickupObj = availablePickupTypes.find(pt => pt.name === formData.pickupType);
  const pickupExtraFee = selectedPickupObj?.extraFee || 0;
  const baseRate = activeRoute?.basePrice || 150000;
  const vehicleExtra = vehicle?.extraFee || 0;
  const pricePerSeat = baseRate + vehicleExtra;
  const subtotal = (pricePerSeat * selectedSeats.length) + pickupExtraFee;

  let discountAmount = 0;
  if (appliedPromo) {
    const rawDiscount = (subtotal * appliedPromo.discountPercent) / 100;
    discountAmount = Math.min(rawDiscount, appliedPromo.maxDiscount || rawDiscount);
  }

  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (!promoCodeInput.trim()) return;

    const found = settings.promoCodes?.find(
      p => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase()
    );

    if (found) {
      setAppliedPromo(found);
      setPromoError('');
    } else {
      setAppliedPromo(null);
      setPromoError('Kode promo tidak valid atau telah berakhir.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.pickupAddress || !formData.dropoffAddress) {
      alert('Mohon lengkapi Nama, No. WhatsApp, Alamat Jemput, dan Alamat Tujuan.');
      return;
    }

    setIsSubmitting(true);

    const bookingPayload = {
      passengerName: formData.name,
      passengerPhone: formData.phone,
      passengerEmail: formData.email,
      passengerCount: selectedSeats.length,
      routeId: activeRoute?.id,
      routeName: `${activeRoute?.origin} ➜ ${activeRoute?.destination}`,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      plateNumber: vehicle.plateNumber,
      driverName: driver.name,
      driverPhone: driver.phone,
      travelDate: searchParams.travelDate,
      departureTime: searchParams.departureTime,
      selectedSeats: [...selectedSeats],
      pickupType: formData.pickupType,
      pickupAddress: formData.pickupAddress,
      dropoffAddress: formData.dropoffAddress,
      notes: formData.notes,
      totalPrice: grandTotal,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'Bayar di Sopir (Cash)' ? 'Belum Lunas' : 'Lunas'
    };

    setTimeout(() => {
      const created = addBooking(bookingPayload);
      setIsSubmitting(false);
      onBookingSuccess(created);
    }, 400);
  };

  return (
    <div className="checkout-card" id="passenger-form-view">
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
          Data Penumpang & Pembayaran
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Lengkapi data kontak untuk penjemputan door-to-door oleh sopir kami.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-grid">
        {/* Left: Passenger Details */}
        <div className="passenger-form-fields">
          <div className="form-group">
            <label>
              <User size={16} />
              <span>Nama Lengkap Pemesan / Penumpang Utama *</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Budi Prasetyo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>
                <Phone size={16} />
                <span>Nomor WhatsApp Aktif *</span>
              </label>
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
              <label>
                <Mail size={16} />
                <span>Alamat Email (Opsional)</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="email@anda.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Tipe Pelayanan Penjemputan Selector */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              <Navigation size={17} color="var(--primary)" />
              <span>Tipe Pelayanan Penjemputan *</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {availablePickupTypes.map((pt) => {
                const isSelected = formData.pickupType === pt.name;
                return (
                  <div
                    key={pt.id || pt.name}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        pickupType: pt.name,
                        pickupAddress: pt.name.toLowerCase().includes('pool') && !prev.pickupAddress
                          ? (settings.address || 'Kantor Pusat Violet Transport')
                          : prev.pickupAddress
                      }));
                    }}
                    style={{
                      border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                      background: isSelected ? '#faf5ff' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(109, 40, 217, 0.12)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.88rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)', lineHeight: 1.3 }}>
                        {pt.name}
                      </strong>
                      {pt.badge && (
                        <span style={{ 
                          fontSize: '0.68rem', 
                          padding: '2px 6px', 
                          background: isSelected ? '#ede9fe' : '#f1f5f9', 
                          color: isSelected ? '#6d28d9' : 'var(--text-muted)', 
                          borderRadius: '6px', 
                          fontWeight: 700,
                          whiteSpace: 'nowrap'
                        }}>
                          {pt.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                      {pt.description}
                    </p>
                    {pt.extraFee > 0 && (
                      <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>
                        +{formatRupiah(pt.extraFee)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ margin: 0 }}>
                <MapPin size={16} />
                <span>Alamat Lengkap Titik Jemput (Pick-up) *</span>
              </label>
              {settings.address && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, pickupAddress: settings.address }))}
                  style={{
                    background: '#ede9fe',
                    border: 'none',
                    color: '#6d28d9',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  📍 Gunakan Alamat Pool
                </button>
              )}
            </div>
            <textarea
              className="form-control"
              rows={2}
              placeholder={
                formData.pickupType?.toLowerCase().includes('bandara')
                  ? 'Contoh: Bandara SAMS Sepinggan Balikpapan (Gate Kedatangan Domestik / Lion JT-123)'
                  : formData.pickupType?.toLowerCase().includes('pool')
                  ? `Contoh: Pool Utama Violet Transport (${settings.address || 'Kantor Cabang'})`
                  : 'Masukkan nama jalan, nomor rumah, perumahan, hotel, atau patokan jelas'
              }
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <MapPin size={16} />
              <span>Alamat Lengkap Titik Tujuan (Drop-off) *</span>
            </label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Masukkan alamat pengantaran akhir atau nama gedung tujuan"
              value={formData.dropoffAddress}
              onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FileText size={16} />
              <span>Catatan Tambahan untuk Sopir</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Bawa 1 koper besar, tolong hubungi 15 menit sebelum tiba"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pilih Metode Pembayaran
            </label>
            <div className="payment-options-grid">
              <div
                className={`payment-method-card ${formData.paymentMethod === 'QRIS' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'QRIS' })}
              >
                <QrCode size={22} color="var(--primary)" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>QRIS Instant</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BCA, GoPay, OVO, ShopeePay</span>
                </div>
              </div>

              <div
                className={`payment-method-card ${formData.paymentMethod === 'Transfer Bank BCA' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'Transfer Bank BCA' })}
              >
                <Building2 size={22} color="#00529c" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Transfer Bank BCA</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cek Otomatis</span>
                </div>
              </div>

              <div
                className={`payment-method-card ${formData.paymentMethod === 'Transfer Bank Mandiri' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'Transfer Bank Mandiri' })}
              >
                <Building2 size={22} color="#003d79" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Bank Mandiri / BRI</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Virtual Account</span>
                </div>
              </div>

              <div
                className={`payment-method-card ${formData.paymentMethod === 'Bayar di Sopir (Cash)' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'Bayar di Sopir (Cash)' })}
              >
                <Banknote size={22} color="var(--success)" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Bayar di Tempat (COD)</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tunai ke Pengemudi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Coupon */}
        <div>
          <div className="order-summary-box">
            <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.6rem' }}>
              Ringkasan Pemesanan
            </h4>

            <div className="summary-row">
              <span>Rute Perjalanan:</span>
              <strong style={{ textAlign: 'right' }}>{activeRoute?.origin} ➜ {activeRoute?.destination}</strong>
            </div>

            <div className="summary-row">
              <span>Armada Mobil:</span>
              <span>{vehicle.name} ({vehicle.plateNumber})</span>
            </div>

            <div className="summary-row">
              <span>Jadwal Keberangkatan:</span>
              <span>{searchParams.travelDate} • {searchParams.departureTime}</span>
            </div>

            <div className="summary-row">
              <span>Kursi Dipilih ({selectedSeats.length}):</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {selectedSeats.map(seat => (
                  <span key={seat} className="seat-chip">{seat}</span>
                ))}
              </div>
            </div>

            <div className="summary-row">
              <span>Pengemudi Bertugas:</span>
              <span>Pak {driver.name}</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

            {/* Promo Code Box */}
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '4px' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                  placeholder="Kode Promo (misal: VIOLETPROMO)"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0 1rem',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Gunakan
                </button>
              </div>

              {appliedPromo && (
                <div style={{ color: 'var(--success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} />
                  <span>Promo <strong>{appliedPromo.code}</strong> berhasil dipasang (-{appliedPromo.discountPercent}%)</span>
                </div>
              )}

              {promoError && (
                <div style={{ color: 'var(--danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldAlert size={14} />
                  <span>{promoError}</span>
                </div>
              )}
            </div>

            <div className="summary-row">
              <span>Harga Tiket ({selectedSeats.length} Kursi):</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row" style={{ color: 'var(--success)', fontWeight: 600 }}>
                <span>Diskon Promo:</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="summary-row total">
              <span>Total Pembayaran:</span>
              <span>{formatRupiah(grandTotal)}</span>
            </div>

            <button
              type="submit"
              className="btn-confirm-booking"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Memproses Tiket...</span>
              ) : (
                <>
                  <span>Konfirmasi & Dapatkan Tiket</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
