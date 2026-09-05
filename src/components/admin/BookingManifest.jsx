import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Printer, 
  Filter,
  Car,
  User,
  Phone,
  UserCheck,
  Bell,
  Check,
  AlertCircle
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const BookingManifest = ({ onOpenTicketModal }) => {
  const { 
    bookings, 
    drivers, 
    vehicles, 
    updateBookingStatus, 
    updatePaymentStatus, 
    assignDriverToBooking, 
    formatRupiah 
  } = useTravel();

  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const filtered = bookings.filter((b) => {
    if (filterDate && b.travelDate !== filterDate) return false;
    if (filterStatus !== 'Semua' && b.bookingStatus !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        b.bookingCode?.toLowerCase().includes(q) ||
        b.passengerName?.toLowerCase().includes(q) ||
        b.passengerPhone?.toLowerCase().includes(q) ||
        b.routeName?.toLowerCase().includes(q) ||
        b.driverName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleAssignDriver = (bookingId, driverId) => {
    const assigned = assignDriverToBooking(bookingId, driverId);
    if (assigned) {
      setToastMsg(`Tugas perjalanan berhasil dialihkan ke Pak ${assigned.name}! Notifikasi tugas telah dikirimkan ke Dashboard Sopir.`);
      setTimeout(() => setToastMsg(''), 4500);
    }
  };

  return (
    <div className="admin-card">
      {/* Toast Notification for Driver Assignment */}
      {toastMsg && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)'
        }}>
          <Bell size={20} />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="admin-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span className="admin-mode-badge" style={{ background: 'var(--primary)' }}>OPERASIONAL PENUGASAN</span>
          </div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
            Manifest Penumpang & Penugasan Sopir
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Admin & Superadmin dapat mengarahkan dan menentukan sopir yang bertugas pada setiap pesanan. Notifikasi tugas akan otomatis masuk ke dashboard sopir.
          </p>
        </div>

        <button
          className="btn-select-vehicle"
          style={{ width: 'auto', background: '#0f172a', padding: '0.65rem 1.25rem' }}
          onClick={() => window.print()}
        >
          <Printer size={16} />
          <span>Cetak Manifest Hari Ini</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr auto',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        background: '#f8fafc',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px', height: '40px' }}
            placeholder="Cari nama, kode booking, nomor telepon, atau nama sopir..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <input
            type="date"
            className="form-control"
            style={{ height: '40px' }}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <div>
          <select
            className="form-select"
            style={{ height: '40px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Semua">Semua Status Pesanan</option>
            <option value="Dikonfirmasi">Dikonfirmasi</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>

        {(filterDate || filterStatus !== 'Semua' || searchTerm) && (
          <button
            className="btn-select-vehicle"
            style={{ width: 'auto', background: '#e2e8f0', color: 'var(--text-primary)', height: '40px' }}
            onClick={() => { setFilterDate(''); setFilterStatus('Semua'); setSearchTerm(''); }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Manifest Table */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kode & Waktu</th>
              <th>Nama Penumpang</th>
              <th>Rute & Jam</th>
              <th style={{ minWidth: '220px' }}>Penugasan Sopir & Armada</th>
              <th>Kursi</th>
              <th>Total & Pembayaran</th>
              <th>Status Tiket</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Tidak ada pemesanan yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((b) => {
                const currentDriverId = b.driverId || drivers.find(d => d.name === b.driverName)?.id || '';
                const isTaskAccepted = b.taskStatus === 'Tugas Diterima & Siap Jalan';

                return (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: 'var(--primary)', display: 'block' }}>{b.bookingCode}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.createdAt}</span>
                    </td>

                    <td>
                      <strong>{b.passengerName}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {b.passengerPhone}
                      </div>
                      {b.pickupType && (
                        <div style={{ marginTop: '4px' }}>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            background: '#eff6ff', 
                            color: '#1d4ed8', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            display: 'inline-block',
                            border: '1px solid #bfdbfe'
                          }}>
                            🚗 {b.pickupType}
                          </span>
                        </div>
                      )}
                      {b.pickupAddress && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '220px' }} title={b.pickupAddress}>
                          📍 {b.pickupAddress}
                        </div>
                      )}
                    </td>

                    <td>
                      <div>{b.routeName}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {b.travelDate} ({b.departureTime})
                      </span>
                    </td>

                    {/* Interactive Driver Assignment Column */}
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {b.vehicleName}
                      </div>

                      <div style={{ marginTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                          <UserCheck size={14} color="var(--primary)" />
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Arahkan Sopir:
                          </span>
                        </div>
                        <select
                          className="form-select"
                          style={{
                            fontSize: '0.82rem',
                            padding: '4px 8px',
                            fontWeight: 600,
                            borderColor: 'var(--border-focus)',
                            background: '#fdf4ff',
                            color: 'var(--text-primary)'
                          }}
                          value={currentDriverId}
                          onChange={(e) => handleAssignDriver(b.id, e.target.value)}
                          title="Ubah atau arahkan pengemudi yang bertugas membawa perjalanan ini"
                        >
                          {drivers.map((d) => (
                            <option key={d.id} value={d.id}>
                              Pak {d.name} ({d.status})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ marginTop: '5px' }}>
                        <span
                          className="badge-status"
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            background: isTaskAccepted ? '#dcfce7' : '#fef3c7',
                            color: isTaskAccepted ? '#15803d' : '#b45309',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700
                          }}
                        >
                          {isTaskAccepted ? (
                            <>
                              <CheckCircle2 size={12} />
                              <span>✓ Tugas Diterima Sopir</span>
                            </>
                          ) : (
                            <>
                              <Bell size={12} />
                              <span>⏳ Notifikasi Terkirim ke Sopir</span>
                            </>
                          )}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {b.selectedSeats?.map(seat => (
                          <span key={seat} className="seat-chip">{seat}</span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <strong>{formatRupiah(b.totalPrice)}</strong>
                      <div>
                        <select
                          style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)', marginTop: '2px' }}
                          value={b.paymentStatus}
                          onChange={(e) => updatePaymentStatus(b.id, e.target.value)}
                        >
                          <option value="Lunas">Lunas</option>
                          <option value="Belum Lunas">Belum Lunas</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <select
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border)',
                          background:
                            b.bookingStatus === 'Dikonfirmasi'
                              ? 'var(--success-light)'
                              : b.bookingStatus === 'Selesai'
                              ? '#dbeafe'
                              : 'var(--danger-light)',
                          color:
                            b.bookingStatus === 'Dikonfirmasi'
                              ? 'var(--success)'
                              : b.bookingStatus === 'Selesai'
                              ? '#1e40af'
                              : 'var(--danger)'
                        }}
                        value={b.bookingStatus}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                      >
                        <option value="Dikonfirmasi">Dikonfirmasi</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </td>

                    <td>
                      <div className="action-btns-group" style={{ justifyContent: 'center' }}>
                        <button
                          className="btn-table-icon"
                          onClick={() => onOpenTicketModal(b)}
                          title="Buka E-Ticket"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
