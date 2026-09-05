import React, { useState } from 'react';
import { Search, Ticket, Calendar, MapPin, User, ArrowRight, Eye, Phone } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const CheckTicketView = ({ onSelectTicket }) => {
  const { bookings, formatRupiah } = useTravel();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter(b => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      b.bookingCode?.toLowerCase().includes(query) ||
      b.passengerPhone?.toLowerCase().includes(query) ||
      b.passengerName?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="hero-tag" style={{ background: '#ede9fe', color: '#6d28d9', borderColor: '#ddd6fe' }}>
            <Ticket size={16} />
            <span>Lacak & Cek E-Ticket Anda</span>
          </span>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            Riwayat Pemesanan & E-Ticket
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
            Ketik kode booking (contoh: <strong>VT-78912</strong>) atau nomor WhatsApp untuk menampilkan e-ticket.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border)',
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '44px' }}
              placeholder="Cari berdasarkan Kode Booking / No. WhatsApp / Nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <button
              className="btn-select-vehicle"
              style={{ width: 'auto', padding: '0 1.25rem', background: '#f1f5f9', color: 'var(--text-secondary)' }}
              onClick={() => setSearchQuery('')}
            >
              Reset
            </button>
          )}
        </div>

        {/* List of Tickets */}
        {filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', background: '#ffffff', padding: '3rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
            <Ticket size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Tiket Tidak Ditemukan</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Pastikan kode booking atau nomor handphone yang Anda masukkan sudah sesuai.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px' }}>
                      {booking.bookingCode}
                    </span>
                    <span className="badge-status active">{booking.bookingStatus}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.createdAt}</span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {booking.routeName}
                  </h4>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} color="var(--primary)" />
                      {booking.travelDate} ({booking.departureTime})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={14} color="var(--primary)" />
                      {booking.passengerName}
                    </span>
                    <span>
                      Kursi: <strong>{booking.selectedSeats?.join(', ')}</strong>
                    </span>
                    <span>
                      Total: <strong style={{ color: 'var(--primary)' }}>{formatRupiah(booking.totalPrice)}</strong>
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    className="btn-select-vehicle"
                    style={{ width: 'auto', padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                    onClick={() => onSelectTicket(booking)}
                  >
                    <Eye size={16} />
                    <span>Buka E-Ticket</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
