import React, { useState, useRef, useEffect } from 'react';
import { 
  Bus, 
  Settings, 
  Ticket, 
  Calendar, 
  Menu, 
  X, 
  ShieldCheck, 
  UserCheck, 
  PhoneCall, 
  LogIn, 
  LogOut, 
  Car, 
  Users,
  ChevronDown,
  Cloud,
  Database
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ 
  currentTab, 
  setCurrentTab, 
  isAdminMode, 
  setIsAdminMode, 
  isDriverPortal, 
  setIsDriverPortal,
  onOpenLoginModal 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const { settings, bookings, isCloudConnected, cloudSyncState, activeProjectId } = useTravel();
  const { currentUser, logout, isSuperAdmin, isAdmin, isSopir } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tabKey) => {
    setCurrentTab(tabKey);
    setIsAdminMode(false);
    setIsDriverPortal(false);
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (!currentUser) {
      onOpenLoginModal();
      return;
    }
    setIsDriverPortal(false);
    setIsAdminMode(true);
    setCurrentTab('admin-routes');
    setMobileMenuOpen(false);
  };

  const handleDriverPortalClick = () => {
    if (!currentUser) {
      onOpenLoginModal();
      return;
    }
    setIsAdminMode(false);
    setIsDriverPortal(true);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        {/* Brand Logo */}
        <div className="nav-brand" onClick={() => handleTabClick('booking')}>
          <img 
            src="/logo.png" 
            alt="Violet Transport Logo" 
            className="nav-brand-logo" 
          />
          <div className="brand-text-group">
            <span className="brand-main-title">
              {settings.companyName ? (
                settings.companyName.toUpperCase()
              ) : (
                <><span>VIOLET</span> TRANSPORT</>
              )}
            </span>
            <span className="brand-tagline">
              {settings.tagline || 'Your Trusted Travel Partner'}
            </span>
          </div>
        </div>

        {/* Desktop Tabs */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${currentTab === 'booking' && !isAdminMode && !isDriverPortal ? 'active' : ''}`}
            onClick={() => handleTabClick('booking')}
          >
            <Calendar size={15} />
            <span>Pesan Perjalanan</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'check-ticket' && !isAdminMode && !isDriverPortal ? 'active' : ''}`}
            onClick={() => handleTabClick('check-ticket')}
          >
            <Ticket size={15} />
            <span>Cek Tiket / Riwayat</span>
            <span style={{ fontSize: '0.68rem', background: '#ede9fe', color: '#6d28d9', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
              {bookings.length}
            </span>
          </button>

          {/* If Sopir is logged in, show Driver Portal button */}
          {isSopir && (
            <button
              className={`nav-tab-btn ${isDriverPortal ? 'active' : ''}`}
              onClick={handleDriverPortalClick}
              style={{ color: '#059669', background: isDriverPortal ? '#ecfdf5' : 'transparent' }}
            >
              <Car size={15} />
              <span>Portal Tugas Sopir</span>
              <span className="admin-mode-badge" style={{ background: '#10b981' }}>SOPIR</span>
            </button>
          )}
        </nav>

        {/* Desktop Actions / Auth Status with Account Menu */}
        <div className="nav-actions">
          {/* Cloud Database Status Pill */}
          <div 
            className={`cloud-status-pill ${isCloudConnected ? 'online' : 'local'}`}
            title={isCloudConnected 
              ? `Terhubung ke Firebase Firestore (${activeProjectId || 'Live'}). Kolaborasi real-time aktif.` 
              : 'Mode Offline Demo (Data lokal browser). Masukkan konfigurasi Firebase di .env untuk online bersama.'}
          >
            <span className={`pulse-dot ${isCloudConnected ? 'online' : 'local'}`} />
            {isCloudConnected ? <Cloud size={13} /> : <Database size={13} />}
            <span className="cloud-status-text">{isCloudConnected ? 'Cloud Live' : 'Mode Lokal'}</span>
          </div>

          {currentUser ? (
            <div className="user-menu-container" ref={accountMenuRef}>
              <button
                type="button"
                className="user-pill-btn"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                title="Buka menu akun"
                style={{
                  borderColor: isAdminMode ? 'var(--primary)' : 'var(--border)',
                  background: isAdminMode ? '#faf5ff' : '#f8fafc'
                }}
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div className="user-pill-name" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {currentUser.name}
                  </div>
                  <span className="user-pill-role" style={{ 
                    fontSize: '0.64rem', 
                    fontWeight: 700,
                    color: currentUser.role === 'superadmin' ? '#9333ea' : currentUser.role === 'admin' ? '#2563eb' : '#059669' 
                  }}>
                    {currentUser.roleLabel}
                  </span>
                </div>
                <ChevronDown size={13} color="var(--text-muted)" style={{ transform: accountMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Account Dropdown Menu */}
              {accountMenuOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {currentUser.name}
                      </div>
                      <span style={{ 
                        fontSize: '0.66rem', 
                        fontWeight: 700,
                        color: currentUser.role === 'superadmin' ? '#9333ea' : currentUser.role === 'admin' ? '#2563eb' : '#059669',
                        display: 'block'
                      }}>
                        {currentUser.role === 'superadmin' ? 'Pemilik / Super Admin' : currentUser.roleLabel}
                      </span>
                    </div>
                  </div>

                  {/* Super Admin & Admin Access */}
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        className={`user-dropdown-item ${isAdminMode ? 'active' : ''}`}
                        onClick={() => {
                          handleAdminClick();
                          setAccountMenuOpen(false);
                        }}
                      >
                        <Settings size={15} color="var(--primary)" />
                        <div>
                          <div style={{ fontWeight: 700 }}>Pengaturan & Admin</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Kelola rute, armada, sopir & tiket</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`user-dropdown-item ${!isAdminMode && currentTab === 'booking' ? 'active' : ''}`}
                        onClick={() => {
                          handleTabClick('booking');
                          setAccountMenuOpen(false);
                        }}
                      >
                        <Calendar size={15} color="var(--secondary)" />
                        <div>
                          <div style={{ fontWeight: 700 }}>Mode Pemesanan Pelanggan</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Tampilan booking publik</div>
                        </div>
                      </button>
                      <div style={{ height: '1px', background: 'var(--border)', margin: '0.35rem 0' }} />
                    </>
                  )}

                  {/* Driver Link if Sopir */}
                  {isSopir && (
                    <>
                      <button
                        type="button"
                        className={`user-dropdown-item ${isDriverPortal ? 'active' : ''}`}
                        onClick={() => {
                          handleDriverPortalClick();
                          setAccountMenuOpen(false);
                        }}
                      >
                        <Car size={15} color="#059669" />
                        <div>
                          <div style={{ fontWeight: 700 }}>Portal Tugas Sopir</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Buka manifest tugas Anda</div>
                        </div>
                      </button>
                      <div style={{ height: '1px', background: 'var(--border)', margin: '0.35rem 0' }} />
                    </>
                  )}

                  <button
                    type="button"
                    className="user-dropdown-item logout"
                    onClick={() => {
                      logout();
                      setAccountMenuOpen(false);
                      setIsAdminMode(false);
                      setCurrentTab('booking');
                    }}
                  >
                    <LogOut size={15} />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="btn-login-nav"
              onClick={onOpenLoginModal}
            >
              <LogIn size={14} />
              <span>Masuk</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu Navigasi"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0.5rem 0.75rem', 
              borderRadius: '8px', 
              background: isCloudConnected ? '#ecfdf5' : '#f1f5f9', 
              color: isCloudConnected ? '#065f46' : '#475569', 
              fontSize: '0.75rem', 
              fontWeight: 600,
              marginBottom: '0.6rem' 
            }}
          >
            <span className={`pulse-dot ${isCloudConnected ? 'online' : 'local'}`} />
            {isCloudConnected ? <Cloud size={14} /> : <Database size={14} />}
            <span>Database: <strong>{isCloudConnected ? `Firebase Live (${activeProjectId})` : 'Mode Lokal Browser'}</strong></span>
          </div>

          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <strong>{currentUser.name}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                  {currentUser.roleLabel}
                </div>
              </div>
              <button
                onClick={logout}
                style={{ background: '#fee2e2', border: 'none', color: '#dc2626', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}
              >
                Keluar
              </button>
            </div>
          )}

          <button
            className={`mobile-nav-item ${currentTab === 'booking' && !isAdminMode && !isDriverPortal ? 'active' : ''}`}
            onClick={() => handleTabClick('booking')}
          >
            <Calendar size={20} color="#6d28d9" />
            <span>Pemesanan Tiket & Armada</span>
          </button>

          <button
            className={`mobile-nav-item ${currentTab === 'check-ticket' && !isAdminMode && !isDriverPortal ? 'active' : ''}`}
            onClick={() => handleTabClick('check-ticket')}
          >
            <Ticket size={20} color="#6d28d9" />
            <span>Cek Tiket Saya ({bookings.length})</span>
          </button>

          {isSopir && (
            <button
              className={`mobile-nav-item ${isDriverPortal ? 'active' : ''}`}
              onClick={handleDriverPortalClick}
              style={{ color: '#059669' }}
            >
              <Car size={20} color="#059669" />
              <span>Portal Tugas Sopir (Manifest Mobil Anda)</span>
            </button>
          )}

          {isAdmin && (
            <button
              className={`mobile-nav-item ${isAdminMode ? 'active' : ''}`}
              onClick={handleAdminClick}
            >
              <Settings size={20} color="#6d28d9" />
              <span>Panel Pengaturan Admin ({isSuperAdmin ? 'Super Admin' : 'Admin'})</span>
            </button>
          )}

          {!currentUser && (
            <button
              className="mobile-nav-item"
              onClick={() => { setMobileMenuOpen(false); onOpenLoginModal(); }}
              style={{ background: '#ede9fe', color: '#6d28d9' }}
            >
              <LogIn size={20} color="#6d28d9" />
              <span>Masuk Akun (Super Admin, Admin, Sopir)</span>
            </button>
          )}

          <div style={{ padding: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <PhoneCall size={16} color="#10b981" />
              <span>Bantuan CS: {settings.csPhone}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
