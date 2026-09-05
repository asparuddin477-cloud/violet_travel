import React, { useState, useEffect, useRef } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  HeroBanner 
} from './components/HeroBanner';
import { 
  RouteSearchCard 
} from './components/booking/RouteSearchCard';
import { 
  VehicleCard 
} from './components/booking/VehicleCard';
import { 
  InteractiveSeatMap 
} from './components/booking/InteractiveSeatMap';
import { 
  PassengerForm 
} from './components/booking/PassengerForm';
import { 
  ETicketModal 
} from './components/booking/ETicketModal';
import { 
  CheckTicketView 
} from './components/booking/CheckTicketView';
import { 
  AdminDashboard 
} from './components/admin/AdminDashboard';
import { 
  DriverPortal 
} from './components/driver/DriverPortal';
import { 
  LoginModal 
} from './components/auth/LoginModal';
import { 
  useTravel, 
  TravelProvider 
} from './context/TravelContext';
import { 
  useAuth, 
  AuthProvider 
} from './context/AuthContext';
import { 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Award, 
  HelpCircle,
  Bus
} from 'lucide-react';

function TravelApp() {
  const { routes, vehicles, schedules, settings, getOccupiedSeats, formatRupiah } = useTravel();
  const { currentUser, isSopir, isAdmin } = useAuth();

  const [currentTab, setCurrentTab] = useState('booking'); // 'booking' | 'check-ticket'
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDriverPortal, setIsDriverPortal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Automatically activate Driver Portal if Sopir logs in
  useEffect(() => {
    if (currentUser?.role === 'sopir') {
      setIsDriverPortal(true);
      setIsAdminMode(false);
    } else if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
      setIsDriverPortal(false);
    }
  }, [currentUser]);

  // Tomorrow's date default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const activeRoutesList = routes.filter(r => r.active !== false);
  const activeVehiclesList = vehicles.filter(v => v.status !== 'Nonaktif');
  const firstRoute = activeRoutesList[0] || routes[0];

  const [searchParams, setSearchParams] = useState({
    origin: firstRoute?.origin || 'Samarinda',
    destination: firstRoute?.destination || 'Balikpapan (Bandara / Kota)',
    travelDate: defaultDateStr,
    departureTime: schedules[0]?.time || '08:30 WITA',
    passengers: 1
  });

  // Automatically synchronize searchParams when routes are added, updated, or removed by admin
  useEffect(() => {
    if (activeRoutesList.length > 0) {
      const match = activeRoutesList.some(
        r => r.origin === searchParams.origin && r.destination === searchParams.destination
      );
      if (!match) {
        setSearchParams(prev => ({
          ...prev,
          origin: activeRoutesList[0].origin,
          destination: activeRoutesList[0].destination
        }));
      }
    }
  }, [routes]);

  const handleSelectRouteFromFooter = (r) => {
    setSearchParams(prev => ({
      ...prev,
      origin: r.origin,
      destination: r.destination
    }));
    setSelectedVehicle(null);
    setSelectedSeats([]);
    setShowPassengerForm(false);
    setCurrentTab('booking');
    setIsAdminMode(false);
    setIsDriverPortal(false);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [activeTicketModal, setActiveTicketModal] = useState(null);

  const seatSectionRef = useRef(null);
  const passengerSectionRef = useRef(null);

  // Guard against accidental back swipe / browser closure on mobile devices
  useEffect(() => {
    // Push dummy history entry so swipe-back gesture does not exit the app
    window.history.pushState({ app: 'violet_travel' }, '');

    const handlePopState = () => {
      if (activeTicketModal) {
        setActiveTicketModal(null);
        window.history.pushState({ app: 'violet_travel' }, '');
        return;
      }
      if (isLoginModalOpen) {
        setIsLoginModalOpen(false);
        window.history.pushState({ app: 'violet_travel' }, '');
        return;
      }
      if (showPassengerForm) {
        setShowPassengerForm(false);
        window.history.pushState({ app: 'violet_travel' }, '');
        return;
      }
      if (selectedVehicle) {
        setSelectedVehicle(null);
        setSelectedSeats([]);
        window.history.pushState({ app: 'violet_travel' }, '');
        return;
      }
      if (isAdminMode || isDriverPortal) {
        setIsAdminMode(false);
        setIsDriverPortal(false);
        setCurrentTab('booking');
        window.history.pushState({ app: 'violet_travel' }, '');
        return;
      }
      if (currentTab !== 'booking') {
        setCurrentTab('booking');
        window.history.pushState({ app: 'violet_travel' }, '');
        return;
      }

      // If already at initial view, absorb the back gesture so the app stays open
      window.history.pushState({ app: 'violet_travel' }, '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTicketModal, isLoginModalOpen, showPassengerForm, selectedVehicle, isAdminMode, isDriverPortal, currentTab]);

  // Find matching route
  const activeRoute = routes.find(
    r => r.active && r.origin === searchParams.origin && r.destination === searchParams.destination
  ) || routes.find(r => r.active) || routes[0];

  // Auto-scroll when selecting a vehicle
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedSeats([]);
    setShowPassengerForm(false);
    setTimeout(() => {
      seatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleProceedToPassenger = () => {
    setShowPassengerForm(true);
    setTimeout(() => {
      passengerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBookingSuccess = (createdBooking) => {
    setActiveTicketModal(createdBooking);
    setSelectedVehicle(null);
    setSelectedSeats([]);
    setShowPassengerForm(false);
  };

  return (
    <div className="travel-app">
      {/* Header & Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        isDriverPortal={isDriverPortal}
        setIsDriverPortal={setIsDriverPortal}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      {isDriverPortal ? (
        <DriverPortal />
      ) : isAdminMode ? (
        <AdminDashboard
          onBackToCustomer={() => {
            setIsAdminMode(false);
            setCurrentTab('booking');
          }}
          onOpenTicketModal={(booking) => setActiveTicketModal(booking)}
        />
      ) : currentTab === 'check-ticket' ? (
        <CheckTicketView onSelectTicket={(booking) => setActiveTicketModal(booking)} />
      ) : (
        <>
          {/* Hero Banner */}
          <HeroBanner />

          {/* Booking Flow */}
          <main className="container" style={{ position: 'relative' }}>
            {/* Search Card */}
            <RouteSearchCard
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearch={() => {
                setSelectedVehicle(null);
                setSelectedSeats([]);
                setShowPassengerForm(false);
              }}
            />

            {/* Vehicle Selection Section */}
            <section className="booking-section">
              <div className="section-title-wrap">
                <div>
                  <h2 className="section-title">Pilihan Armada & Jadwal Perjalanan</h2>
                  <p className="section-subtitle">
                    Foto armada asli yang akan Anda naiki. Klik pada foto untuk memperbesar atau klik "Pilih Kursi" untuk reservasi nomor kursi.
                  </p>
                </div>

                <div className="active-route-pill">
                  <MapPin size={18} />
                  <span>{searchParams.origin}</span>
                  <span>➜</span>
                  <span>{searchParams.destination}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>({searchParams.departureTime})</span>
                </div>
              </div>

              {/* Vehicle Cards List */}
              <div className="vehicles-list-grid">
                {activeVehiclesList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 'var(--radius-lg)', gridColumn: '1 / -1', border: '1px dashed var(--border)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Belum ada armada aktif. Silakan tambahkan armada di menu Pengaturan & Admin.</p>
                  </div>
                ) : (
                  activeVehiclesList.map((vehicle) => {
                    const occupied = getOccupiedSeats(vehicle.id, searchParams.travelDate, searchParams.departureTime);
                    const availableCount = Math.max(0, vehicle.capacity - occupied.length);
                    const isSelected = selectedVehicle?.id === vehicle.id;

                    return (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        activeRoute={activeRoute}
                        isSelected={isSelected}
                        onSelect={() => handleSelectVehicle(vehicle)}
                        searchParams={searchParams}
                        availableSeatsCount={availableCount}
                      />
                    );
                  })
                )}
              </div>

              {/* Interactive Seat Selection Section */}
              {selectedVehicle && (
                <div ref={seatSectionRef}>
                  <InteractiveSeatMap
                    vehicle={selectedVehicle}
                    searchParams={searchParams}
                    selectedSeats={selectedSeats}
                    setSelectedSeats={setSelectedSeats}
                    onProceedToPassenger={handleProceedToPassenger}
                  />
                </div>
              )}

              {/* Passenger Checkout & Payment Form */}
              {selectedVehicle && showPassengerForm && selectedSeats.length > 0 && (
                <div ref={passengerSectionRef}>
                  <PassengerForm
                    vehicle={selectedVehicle}
                    activeRoute={activeRoute}
                    searchParams={searchParams}
                    selectedSeats={selectedSeats}
                    onBookingSuccess={handleBookingSuccess}
                  />
                </div>
              )}
            </section>
          </main>
        </>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          if (user.role === 'sopir') {
            setIsDriverPortal(true);
            setIsAdminMode(false);
          } else if (user.role === 'admin' || user.role === 'superadmin') {
            setIsAdminMode(true);
            setIsDriverPortal(false);
          }
        }}
      />

      {/* Digital Boarding Pass / E-Ticket Modal */}
      {activeTicketModal && (
        <ETicketModal
          booking={activeTicketModal}
          onClose={() => setActiveTicketModal(null)}
        />
      )}

      {/* Global Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', marginBottom: '0.75rem' }}>
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)' 
                  }} 
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                    {settings.companyName || 'Violet Transport'}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {settings.tagline || 'Your Trusted Travel Partner'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                {settings.tagline || 'Perjalanan Eksekutif Aman, Nyaman, & Tepat Waktu'}. Layanan travel antar-kota terpercaya dengan armada eksekutif, door-to-door shuttle, dan sistem reservasi kursi online termudah.
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <p>📍 {settings.address || 'Jl. Cinta Gg Damai'}</p>
                <p>📞 Layanan 24 Jam: {settings.csPhone || '082158097766'}</p>
              </div>
            </div>

            <div className="footer-col">
              <h5>Rute Populer</h5>
              <ul>
                {activeRoutesList.length === 0 ? (
                  <li style={{ color: '#94a3b8' }}>Belum ada rute aktif</li>
                ) : (
                  activeRoutesList.slice(0, 8).map((r) => (
                    <li 
                      key={r.id}
                      onClick={() => handleSelectRouteFromFooter(r)}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'all 0.2s', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        padding: '2px 0'
                      }}
                      title={`Klik untuk mencari rute ${r.origin} ➜ ${r.destination}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fbbf24';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span>{r.origin}</span>
                      <span style={{ color: '#c084fc', fontSize: '0.85rem' }}>➜</span>
                      <span>{r.destination}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="footer-col">
              <h5>Pilihan Armada</h5>
              <ul>
                {activeVehiclesList.length === 0 ? (
                  <li style={{ color: '#94a3b8' }}>Belum ada armada aktif</li>
                ) : (
                  activeVehiclesList.slice(0, 8).map((v) => (
                    <li 
                      key={v.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        padding: '3px 0'
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{v.name}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="footer-col">
              <h5>Bantuan & Informasi</h5>
              <ul>
                <li>Syarat & Ketentuan</li>
                <li>Kebijakan Privasi</li>
                <li>Cara Pembayaran QRIS / Bank</li>
                <li>Hubungi WhatsApp CS: {settings.csWhatsApp}</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} {settings.legalName}. Hak Cipta Dilindungi Undang-Undang.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TravelProvider>
        <TravelApp />
      </TravelProvider>
    </AuthProvider>
  );
}
