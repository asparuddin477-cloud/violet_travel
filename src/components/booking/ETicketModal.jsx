import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Share2, 
  X, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Car, 
  Armchair, 
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const ETicketModal = ({ booking, onClose }) => {
  const { formatRupiah, settings } = useTravel();

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `Halo, saya telah memesan tiket Violet Transport!\n` +
      `*Kode Booking:* ${booking.bookingCode}\n` +
      `*Rute:* ${booking.routeName}\n` +
      `*Tanggal:* ${booking.travelDate} (${booking.departureTime})\n` +
      `*Armada:* ${booking.vehicleName} (${booking.plateNumber})\n` +
      `*Kursi:* ${booking.selectedSeats?.join(', ')}\n` +
      `*Nama Penumpang:* ${booking.passengerName}\n` +
      `*Layanan Jemput:* ${booking.pickupType || 'Door to Door'}\n` +
      `*Titik Jemput:* ${booking.pickupAddress}\n` +
      `*Titik Tujuan:* ${booking.dropoffAddress}\n` +
      `*Total Bayar:* ${formatRupiah(booking.totalPrice)}\n` +
      `*Status:* ${booking.bookingStatus} (${booking.paymentStatus})`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="ticket-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Ticket Header */}
        <div className="ticket-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/logo.png" 
              alt="Violet Transport" 
              style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                background: 'white',
                padding: '2px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
              }} 
            />
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                E-Ticket Resmi • {settings.companyName || 'Violet Transport'}
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px', lineHeight: 1.2 }}>
                Tiket Perjalanan Terkonfirmasi
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Perforation Effect */}
        <div className="ticket-perforation">
          <div className="ticket-perforation-line"></div>
        </div>

        {/* Ticket Body */}
        <div className="ticket-body">
          {/* Booking Code & Status Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Kode Booking
              </span>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '1px' }}>
                {booking.bookingCode}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge-status active">
                <ShieldCheck size={14} />
                {booking.bookingStatus}
              </span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Pembayaran: <strong>{booking.paymentStatus}</strong>
              </div>
            </div>
          </div>

          {/* Travel Information Grid */}
          <div className="ticket-grid">
            <div className="ticket-field">
              <label>Rute Perjalanan</label>
              <p style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{booking.routeName}</p>
            </div>

            <div className="ticket-field">
              <label>Tanggal & Jam</label>
              <p>{booking.travelDate} • {booking.departureTime}</p>
            </div>

            <div className="ticket-field">
              <label>Nama Penumpang</label>
              <p>{booking.passengerName}</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.passengerPhone}</span>
            </div>

            <div className="ticket-field">
              <label>Nomor Kursi Dipilih</label>
              <div className="ticket-seats-badge">
                {booking.selectedSeats?.map(seat => (
                  <span key={seat} className="seat-chip">{seat}</span>
                ))}
              </div>
            </div>

            <div className="ticket-field">
              <label>Kendaraan & Plat Nomor</label>
              <p>{booking.vehicleName}</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Plat: {booking.plateNumber}</span>
            </div>

            <div className="ticket-field">
              <label>Pengemudi Bertugas</label>
              <p>Pak {booking.driverName}</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kontak: {booking.driverPhone}</span>
            </div>
          </div>

          {/* Addresses */}
          <div style={{ background: '#faf5ff', border: '1px solid #ede9fe', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Titik Jemput:</strong>
                  {booking.pickupType && (
                    <span style={{ fontSize: '0.72rem', background: '#ede9fe', color: '#6d28d9', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {booking.pickupType}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>{booking.pickupAddress}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <MapPin size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Titik Tujuan (Drop-off):</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{booking.dropoffAddress}</p>
              </div>
            </div>
          </div>

          {/* Total Price & Mock QR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed var(--border)', paddingTop: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pembayaran ({booking.selectedSeats?.length} Kursi)</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 800 }}>
                {formatRupiah(booking.totalPrice)}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Metode: {booking.paymentMethod}</span>
            </div>

            <div style={{ textAlign: 'center', background: '#f8fafc', padding: '6px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <QrCode size={56} color="#1e293b" />
              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>SCAN BOARDING</span>
            </div>
          </div>

          {/* Actions */}
          <div className="ticket-actions">
            <button 
              type="button" 
              className="btn-ticket-action btn-print"
              onClick={handlePrint}
            >
              <Printer size={18} />
              <span>Cetak Tiket</span>
            </button>

            <button 
              type="button" 
              className="btn-ticket-action btn-wa"
              onClick={handleShareWhatsApp}
            >
              <Share2 size={18} />
              <span>Kirim ke WA</span>
            </button>

            <button 
              type="button" 
              className="btn-ticket-action btn-close-modal"
              onClick={onClose}
            >
              <span>Selesai</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
