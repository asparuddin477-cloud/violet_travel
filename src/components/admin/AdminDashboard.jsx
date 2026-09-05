import React, { useState } from 'react';
import { 
  MapPin, 
  DollarSign, 
  Car, 
  UserCheck, 
  FileSpreadsheet, 
  Settings as SettingsIcon,
  ArrowLeft,
  ShieldCheck,
  Users as UsersIcon,
  LogOut
} from 'lucide-react';
import { RouteSettings } from './RouteSettings';
import { PriceSettings } from './PriceSettings';
import { VehicleSettings } from './VehicleSettings';
import { DriverSettings } from './DriverSettings';
import { BookingManifest } from './BookingManifest';
import { GeneralSettings } from './GeneralSettings';
import { UserManagement } from './UserManagement';
import { useTravel } from '../../context/TravelContext';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = ({ onBackToCustomer, onOpenTicketModal }) => {
  const [adminSubTab, setAdminSubTab] = useState('routes');
  const { routes, vehicles, drivers, bookings } = useTravel();
  const { currentUser, isSuperAdmin, logout } = useAuth();

  return (
    <div className="admin-wrapper">
      <div className="container">
        {/* Admin Header Box */}
        <div className="admin-header-box">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="admin-mode-badge" style={{ background: isSuperAdmin ? '#9333ea' : 'var(--accent)' }}>
                {isSuperAdmin ? 'SUPER ADMIN PANEL' : 'ADMIN OPERASIONAL'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Violet Travel Management System</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>
              Pusat Pengaturan & Manajemen Operasional
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {currentUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 'var(--radius-full)' }}>
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>{currentUser.name}</strong> ({currentUser.roleLabel})
                </div>
                <button
                  type="button"
                  onClick={logout}
                  title="Keluar / Logout"
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            <button 
              className="btn-admin-switch"
              onClick={onBackToCustomer}
              style={{ width: 'auto' }}
            >
              <ArrowLeft size={16} />
              <span>Halaman Pemesanan</span>
            </button>
          </div>
        </div>

        {/* Admin Subtabs */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="admin-nav-tabs">
            <button
              className={`admin-tab-btn ${adminSubTab === 'routes' ? 'active' : ''}`}
              onClick={() => setAdminSubTab('routes')}
            >
              <MapPin size={17} />
              <span>Rute & Jadwal ({routes.length})</span>
            </button>

            <button
              className={`admin-tab-btn ${adminSubTab === 'prices' ? 'active' : ''}`}
              onClick={() => setAdminSubTab('prices')}
            >
              <DollarSign size={17} />
              <span>Tarif & Diskon</span>
            </button>

            <button
              className={`admin-tab-btn ${adminSubTab === 'vehicles' ? 'active' : ''}`}
              onClick={() => setAdminSubTab('vehicles')}
            >
              <Car size={17} />
              <span>Armada & Denah ({vehicles.length})</span>
            </button>

            <button
              className={`admin-tab-btn ${adminSubTab === 'drivers' ? 'active' : ''}`}
              onClick={() => setAdminSubTab('drivers')}
            >
              <UserCheck size={17} />
              <span>Sopir / Driver ({drivers.length})</span>
            </button>

            <button
              className={`admin-tab-btn ${adminSubTab === 'manifest' ? 'active' : ''}`}
              onClick={() => setAdminSubTab('manifest')}
            >
              <FileSpreadsheet size={17} />
              <span>Manifest Pemesanan ({bookings.length})</span>
            </button>

            {isSuperAdmin && (
              <button
                className={`admin-tab-btn ${adminSubTab === 'users' ? 'active' : ''}`}
                onClick={() => setAdminSubTab('users')}
              >
                <UsersIcon size={17} />
                <span>Akun & Pengguna</span>
              </button>
            )}

            <button
              className={`admin-tab-btn ${adminSubTab === 'general' ? 'active' : ''}`}
              onClick={() => setAdminSubTab('general')}
            >
              <SettingsIcon size={17} />
              <span>Pengaturan Profil</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {adminSubTab === 'routes' && <RouteSettings />}
        {adminSubTab === 'prices' && <PriceSettings />}
        {adminSubTab === 'vehicles' && <VehicleSettings />}
        {adminSubTab === 'drivers' && <DriverSettings />}
        {adminSubTab === 'manifest' && <BookingManifest onOpenTicketModal={onOpenTicketModal} />}
        {adminSubTab === 'users' && isSuperAdmin && <UserManagement />}
        {adminSubTab === 'general' && <GeneralSettings />}
      </div>
    </div>
  );
};
