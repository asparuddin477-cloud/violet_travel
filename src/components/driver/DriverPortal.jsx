import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  Star, 
  AlertCircle,
  Armchair,
  Bell,
  Check,
  ShieldCheck,
  Send,
  Users,
  UserCheck,
  History,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';

export const DriverPortal = () => {
  const { currentUser } = useAuth();
  const { 
    vehicles, 
    bookings, 
    drivers, 
    updateDriver, 
    acceptDriverTask, 
    dropoffPassenger,
    formatRupiah 
  } = useTravel();

  // Find linked driver object
  const driverData = drivers.find(
    d => d.id === currentUser?.driverId || d.name.toLowerCase().includes(currentUser?.name.toLowerCase())
  ) || drivers[0];

  const assignedVehicle = vehicles.find(v => v.id === driverData?.assignedVehicleId) || vehicles[0];

  const [driverStatus, setDriverStatus] = useState(driverData?.status || 'Siap Jalan');
  const [pickedUpPassengers, setPickedUpPassengers] = useState({});
  const [manifestTab, setManifestTab] = useState('active'); // 'active' | 'history'
  const [dropoffConfirmModal, setDropoffConfirmModal] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Filter bookings assigned to this driver
  const myBookings = bookings.filter(b => 
    b.driverId === driverData?.id ||
    b.driverName?.toLowerCase().includes(driverData?.name.toLowerCase()) ||
    b.vehicleId === assignedVehicle?.id
  );

  // Active passengers waiting to be picked up or currently on board
  const activeBookings = myBookings.filter(
    b => b.bookingStatus !== 'Selesai' && b.bookingStatus !== 'Dibatalkan'
  );

  // Completed passengers history (Selesai Turun)
  const completedBookings = myBookings.filter(
    b => b.bookingStatus === 'Selesai'
  );

  // Unaccepted / New tasks assigned by Admin
  const pendingTasks = myBookings.filter(b => 
    b.taskStatus === 'Menunggu Konfirmasi Sopir' || b.taskNotification?.status === 'unread'
  );

  // Play audio chime when new task is present
  useEffect(() => {
    if (pendingTasks.length > 0) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      } catch (e) {
        // AudioContext silent
      }
    }
  }, [pendingTasks.length]);

  const handleStatusChange = (newStatus) => {
    setDriverStatus(newStatus);
    if (driverData) {
      updateDriver(driverData.id, { status: newStatus });
    }
  };

  const togglePickedUp = (bookingId) => {
    setPickedUpPassengers(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const handleAcceptTask = (bookingId) => {
    acceptDriverTask(bookingId);
  };

  const handleOpenWhatsApp = (booking) => {
    const text = `Halo Bapak/Ibu *${booking.passengerName}*, saya *Pak ${driverData?.name}*, sopir Violet Travel armada *${assignedVehicle?.name}* (Plat: *${assignedVehicle?.plateNumber}*). \n\nSaya bertugas mengantar perjalanan Anda rute *${booking.routeName}* pada *${booking.travelDate}* jam *${booking.departureTime}*. \n\nSaat ini saya sedang menuju lokasi penjemputan Anda di:\n📍 *${booking.pickupAddress}*\n\nMohon bersiap di titik jemput ya. Terima kasih!`;
    const cleanPhone = booking.passengerPhone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleOpenMaps = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const handleConfirmDropoff = (booking) => {
    setDropoffConfirmModal(booking);
  };

  const handleExecuteDropoff = () => {
    if (!dropoffConfirmModal) return;
    dropoffPassenger(dropoffConfirmModal.id);
    setToastMsg(`✓ Penumpang ${dropoffConfirmModal.passengerName} telah berhasil diturunkan di tujuan & dipindahkan ke Riwayat.`);
    setTimeout(() => setToastMsg(''), 5000);
    setDropoffConfirmModal(null);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      {/* Driver Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)',
        color: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img 
            src={driverData?.avatar || currentUser?.avatar} 
            alt={currentUser?.name}
            style={{ width: '76px', height: '76px', borderRadius: '50%', border: '3px solid #8b5cf6', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-status active" style={{ background: '#34d399', color: '#064e3b' }}>
                PORTAL SOPIR RESMI
              </span>
              {pendingTasks.length > 0 && (
                <span style={{ background: '#ef4444', color: 'white', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '4px', animation: 'pulse 1.5s infinite' }}>
                  <Bell size={11} /> {pendingTasks.length} TUGAS BARU!
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'white', marginTop: '4px' }}>
              Selamat Bertugas, Pak {driverData?.name}!
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              No. SIM: {driverData?.licenseNumber} • Rating Pelanggan: {driverData?.rating} ★ ({driverData?.tripsCount} Perjalanan Selesai)
            </p>
          </div>
        </div>

        {/* Status Toggle Buttons */}
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(10px)' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
            Status Tugas Anda Sekarang:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Siap Jalan', 'Sedang Jalan', 'Istirahat'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: driverStatus === st ? '#10b981' : 'rgba(255,255,255,0.15)',
                  color: 'white',
                  transition: 'var(--transition)'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prominent Task Assignment Alert Banner from Admin */}
      {pendingTasks.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '2px solid #f59e0b',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.25)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#f59e0b',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)'
              }}>
                <Bell size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  NOTIFIKASI TUGAS PERJALANAN DARI ADMIN
                </span>
                <h3 style={{ fontSize: '1.35rem', color: '#92400e', margin: '2px 0 0' }}>
                  Ada {pendingTasks.length} Perjalanan Baru Diarahkan ke Anda!
                </h3>
              </div>
            </div>
            <span style={{ background: '#fef3c7', border: '1px solid #fcd34d', color: '#b45309', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
              Silakan periksa dan konfirmasi kesiapan Anda di bawah ini
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingTasks.map((task) => (
              <div 
                key={task.id} 
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  border: '1.5px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge-status pending" style={{ background: '#fef3c7', color: '#b45309', fontWeight: 700 }}>
                      Menunggu Konfirmasi Anda
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Kode Booking: <strong style={{ color: 'var(--primary)' }}>{task.bookingCode}</strong>
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {task.taskNotification?.assignedAt ? `Ditugaskan jam ${task.taskNotification.assignedAt}` : ''}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: '2px 0' }}>
                    {task.routeName}
                  </h4>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '6px' }}>
                    <span>📅 Jadwal: <strong>{task.travelDate} ({task.departureTime})</strong></span>
                    <span>👤 Penumpang: <strong>{task.passengerName}</strong> ({task.passengerPhone})</span>
                    <span>💺 Kursi: <strong>{task.selectedSeats?.join(', ')}</strong></span>
                  </div>

                  <div style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-primary)', background: '#faf5ff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ede9fe' }}>
                    📍 <strong>Titik Jemput:</strong> {task.pickupAddress} {task.pickupType && <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, marginLeft: '4px' }}>[{task.pickupType}]</span>} ➜ <strong>Tujuan:</strong> {task.dropoffAddress}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-select-vehicle"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      padding: '0.75rem 1.4rem',
                      fontSize: '0.92rem',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                    }}
                    onClick={() => handleAcceptTask(task.id)}
                  >
                    <CheckCircle2 size={18} />
                    <span>✓ Terima Tugas & Siap Berangkat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Vehicle & Manifest */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left: Vehicle Info with Uploaded Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={20} color="var(--primary)" />
              Armada Pegangan Anda
            </h3>

            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '180px', marginBottom: '1rem', border: '1px solid var(--border)' }}>
              <img 
                src={assignedVehicle?.imageUrl} 
                alt={assignedVehicle?.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              {assignedVehicle?.name}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0.5rem 0' }}>
              <span className="vehicle-plate" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>
                {assignedVehicle?.plateNumber}
              </span>
              <span className="badge-status active">{assignedVehicle?.category}</span>
            </div>

            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Kapasitas Total:</span>
                <strong>{assignedVehicle?.capacity} Kursi</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Tipe Denah:</span>
                <strong>{assignedVehicle?.seatLayoutType}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Fasilitas:</span>
                <span>{assignedVehicle?.facilities?.slice(0, 3).join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Manifest & Pick-up List */}
        <div>
          <div className="admin-card">
            <div className="admin-card-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  Manifest Penumpang & Titik Penjemputan
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                  Daftar penumpang yang memesan kursi di mobil Anda. Hubungi nomor WA, navigasikan titik jemput, dan turunkan penumpang setelah sampai.
                </p>
              </div>
              <span className="active-route-pill" style={{ fontSize: '0.82rem' }}>
                {activeBookings.length} Penumpang Aktif
              </span>
            </div>

            {/* Sub-tabs: Penumpang Aktif vs Riwayat Selesai */}
            <div style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1.5px solid var(--border)',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <button
                type="button"
                onClick={() => setManifestTab('active')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: manifestTab === 'active' ? 'var(--primary)' : '#f1f5f9',
                  color: manifestTab === 'active' ? 'white' : 'var(--text-secondary)',
                  transition: 'var(--transition)'
                }}
              >
                <Users size={15} />
                <span>Penumpang Aktif ({activeBookings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setManifestTab('history')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: manifestTab === 'history' ? '#059669' : '#f1f5f9',
                  color: manifestTab === 'history' ? 'white' : 'var(--text-secondary)',
                  transition: 'var(--transition)'
                }}
              >
                <History size={15} />
                <span>Riwayat Penumpang Selesai ({completedBookings.length})</span>
              </button>
            </div>

            {toastMsg && (
              <div style={{
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.25rem'
              }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>{toastMsg}</span>
              </div>
            )}

            {/* TAB 1: PENUMPANG AKTIF */}
            {manifestTab === 'active' && (
              activeBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                  <Clock size={40} color="#cbd5e1" style={{ marginBottom: '8px' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Semua Penumpang Sudah Diantar & Turun!</p>
                  <p style={{ fontSize: '0.84rem' }}>Tidak ada penumpang aktif saat ini. Anda dapat mengecek data di tab <strong>Riwayat Penumpang</strong>.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {activeBookings.map((b) => {
                    const isDone = pickedUpPassengers[b.id];
                    const isAccepted = b.taskStatus === 'Tugas Diterima & Siap Jalan';

                    return (
                      <div 
                        key={b.id}
                        style={{
                          border: '1.5px solid var(--border)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '1.25rem',
                          background: isDone ? '#f0fdf4' : '#ffffff',
                          borderColor: isDone ? '#86efac' : isAccepted ? '#bbf7d0' : 'var(--border)',
                          transition: 'var(--transition)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                              {b.passengerName}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              ({b.passengerPhone})
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className={`badge-status ${isAccepted ? 'active' : 'pending'}`}>
                              {isAccepted ? '✓ Tugas Diterima' : '⏳ Tugas Baru'}
                            </span>
                            <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                              {b.travelDate} • {b.departureTime}
                            </span>
                          </div>
                        </div>

                        {/* Seats & Route */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                          <div>
                            Kursi Dipilih: {' '}
                            {b.selectedSeats?.map(s => (
                              <span key={s} className="seat-chip" style={{ marginRight: '4px' }}>{s}</span>
                            ))}
                          </div>
                          <div>•</div>
                          <div>Rute: <strong>{b.routeName}</strong></div>
                        </div>

                        {/* Pick-up & Drop-off addresses */}
                        <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.88rem' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                            <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Titik Jemput:</strong>
                                {b.pickupType && (
                                  <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, border: '1px solid #bfdbfe' }}>
                                    🚗 {b.pickupType}
                                  </span>
                                )}
                              </div>
                              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{b.pickupAddress}</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <MapPin size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Titik Antar:</strong>
                              <div style={{ color: 'var(--text-primary)' }}>{b.dropoffAddress}</div>
                            </div>
                          </div>

                          {b.notes && (
                            <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--accent)' }}>
                              Catatan: {b.notes}
                            </div>
                          )}
                        </div>

                        {/* Driver Action Buttons */}
                        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn-select-vehicle"
                            style={{ width: 'auto', background: '#25d366', padding: '0.48rem 0.95rem', fontSize: '0.82rem' }}
                            onClick={() => handleOpenWhatsApp(b)}
                          >
                            <MessageCircle size={15} />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            className="btn-select-vehicle"
                            style={{ width: 'auto', background: '#3b82f6', padding: '0.48rem 0.95rem', fontSize: '0.82rem' }}
                            onClick={() => handleOpenMaps(b.pickupAddress)}
                            title="Navigasi ke titik jemput penumpang"
                          >
                            <Navigation size={15} />
                            <span>Maps Jemput</span>
                          </button>

                          <button
                            type="button"
                            className="btn-select-vehicle"
                            style={{ width: 'auto', background: '#8b5cf6', padding: '0.48rem 0.95rem', fontSize: '0.82rem' }}
                            onClick={() => handleOpenMaps(b.dropoffAddress)}
                            title="Navigasi ke titik antar tujuan"
                          >
                            <MapPin size={15} />
                            <span>Maps Antar</span>
                          </button>

                          <button
                            type="button"
                            className="btn-select-vehicle"
                            style={{
                              width: 'auto',
                              background: isDone ? '#10b981' : '#f1f5f9',
                              color: isDone ? 'white' : 'var(--text-secondary)',
                              padding: '0.48rem 0.95rem',
                              fontSize: '0.82rem'
                            }}
                            onClick={() => togglePickedUp(b.id)}
                          >
                            <CheckCircle2 size={15} />
                            <span>{isDone ? 'Sudah Naik Mobil ✓' : 'Tandai Naik Mobil'}</span>
                          </button>

                          {/* Tombol Turunkan Penumpang */}
                          <button
                            type="button"
                            className="btn-select-vehicle"
                            style={{
                              width: 'auto',
                              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                              color: 'white',
                              padding: '0.48rem 1.15rem',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)',
                              marginLeft: 'auto'
                            }}
                            onClick={() => handleConfirmDropoff(b)}
                            title="Klik jika penumpang sudah sampai di tujuan dan turun dari mobil"
                          >
                            <UserCheck size={16} />
                            <span>Turunkan Penumpang</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* TAB 2: RIWAYAT PENUMPANG SELESAI */}
            {manifestTab === 'history' && (
              completedBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                  <History size={44} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Belum Ada Riwayat Penumpang Selesai</h4>
                  <p style={{ fontSize: '0.84rem' }}>
                    Penumpang yang telah sampai dan Anda klik tombol <strong>"Turunkan Penumpang"</strong> akan otomatis tersimpan di riwayat ini.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {completedBookings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        border: '1.5px solid #bbf7d0',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem',
                        background: '#f0fdf4',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#166534' }}>
                            {b.passengerName}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            ({b.passengerPhone})
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="badge-status active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                            ✓ Selesai Diturunkan {b.droppedOffAt ? `(Pukul ${b.droppedOffAt})` : ''}
                          </span>
                          <span style={{ fontSize: '0.8rem', background: 'white', border: '1px solid #bbf7d0', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            {b.travelDate} • {b.departureTime}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                        <div>
                          Kursi: {' '}
                          {b.selectedSeats?.map(s => (
                            <span key={s} className="seat-chip" style={{ marginRight: '4px' }}>{s}</span>
                          ))}
                        </div>
                        <div>•</div>
                        <div>Rute: <strong>{b.routeName}</strong></div>
                        <div>•</div>
                        <div>Total Tarif: <strong>{formatRupiah(b.totalPrice)}</strong> ({b.paymentStatus || 'Lunas'})</div>
                      </div>

                      <div style={{ background: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #dcfce7', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Alamat Pengantaran:</div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{b.dropoffAddress}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button
                          type="button"
                          className="btn-select-vehicle"
                          style={{ width: 'auto', background: '#25d366', padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                          onClick={() => handleOpenWhatsApp(b)}
                          title="Hubungi jika ada barang tertinggal di mobil"
                        >
                          <MessageCircle size={15} />
                          <span>Hubungi WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          className="btn-select-vehicle"
                          style={{ width: 'auto', background: '#e2e8f0', color: 'var(--text-secondary)', padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                          onClick={() => handleOpenMaps(b.dropoffAddress)}
                        >
                          <Navigation size={15} />
                          <span>Lokasi Antar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal Turunkan Penumpang */}
      {dropoffConfirmModal && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }}>
          <div 
            className="ticket-modal-card"
            style={{ maxWidth: '480px', padding: '0', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', background: '#fff7ed', borderBottom: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#ea580c', color: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#9a3412', fontSize: '1.15rem' }}>Konfirmasi Turunkan Penumpang</h4>
                  <span style={{ fontSize: '0.78rem', color: '#c2410c' }}>Selesaikan perjalanan untuk penumpang ini</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setDropoffConfirmModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Apakah penumpang <strong>{dropoffConfirmModal.passengerName}</strong> ({dropoffConfirmModal.passengerPhone}) sudah sampai di tujuan dan turun dari mobil?
              </p>

              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.86rem', marginBottom: '1.25rem' }}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Titik Antar Tujuan:</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dropoffConfirmModal.dropoffAddress}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Nomor Kursi:</span>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{dropoffConfirmModal.selectedSeats?.join(', ')}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#047857', background: '#ecfdf5', padding: '10px 12px', borderRadius: '6px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                <span>Setelah diturunkan, data otomatis hilang dari dashboard aktif dan tersimpan rapi di <strong>Riwayat Penumpang</strong>.</span>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn-select-vehicle"
                style={{ width: 'auto', background: '#e2e8f0', color: 'var(--text-secondary)' }}
                onClick={() => setDropoffConfirmModal(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-select-vehicle"
                style={{ 
                  width: 'auto', 
                  background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', 
                  padding: '0.75rem 1.5rem',
                  color: 'white',
                  fontWeight: 700
                }}
                onClick={handleExecuteDropoff}
              >
                <CheckCircle2 size={16} />
                <span>Ya, Penumpang Sudah Turun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
