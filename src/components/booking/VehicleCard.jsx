import React, { useState } from 'react';
import { 
  Users, 
  Wifi, 
  Wind, 
  Zap, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  ChevronRight,
  Phone,
  ZoomIn,
  X,
  Armchair
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const VehicleCard = ({ 
  vehicle, 
  activeRoute, 
  isSelected, 
  onSelect, 
  searchParams, 
  availableSeatsCount 
}) => {
  const { formatRupiah } = useTravel();
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const basePrice = activeRoute?.basePrice || 150000;
  const totalPricePerSeat = basePrice + (vehicle.extraFee || 0);

  return (
    <>
      <div className={`vehicle-card ${isSelected ? 'selected-vehicle' : ''}`}>
        {/* Vehicle Image with Zoom Action for Prospective Passengers */}
        <div 
          className="vehicle-thumb-box"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowPhotoModal(true)}
          title="Klik untuk memperbesar foto armada yang akan Anda naiki"
        >
          <img 
            src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'} 
            alt={vehicle.name}
            loading="lazy" 
          />
          <div className="vehicle-cat-badge">{vehicle.category}</div>
          
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 600
          }}>
            <ZoomIn size={12} />
            <span>Lihat Foto Mobil</span>
          </div>
        </div>

        {/* Vehicle Info & Driver */}
        <div className="vehicle-details">
          <div className="vehicle-header-line">
            <div>
              <h3 className="vehicle-name">{vehicle.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span className="vehicle-plate">{vehicle.plateNumber}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Armchair size={13} />
                  Denah: {vehicle.seatLayoutType || 'Standar'} ({vehicle.capacity} Kursi)
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={16} color="var(--primary)" />
              Kapasitas: <strong>{vehicle.capacity} Kursi</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: availableSeatsCount > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
              {availableSeatsCount > 0 ? `Tersisa ${availableSeatsCount} Kursi Kosong` : 'Penuh'}
            </span>
          </div>

          {/* Facilities Chips */}
          <div className="facilities-tags">
            {vehicle.facilities?.map((facility, idx) => (
              <span key={idx} className="facility-chip">
                <CheckCircle2 size={12} color="var(--primary)" />
                {facility}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Seat Selector Action */}
        <div className="vehicle-pricing-action">
          <div style={{ textAlign: 'right' }}>
            <span className="price-label">Tarif per Penumpang</span>
            <div className="price-value">
              {formatRupiah(totalPricePerSeat)}
            </div>
            <span className="price-unit">Termasuk Tol & AC</span>
          </div>

          <button
            type="button"
            className={`btn-select-vehicle ${isSelected ? 'selected-btn' : ''}`}
            onClick={onSelect}
            disabled={availableSeatsCount < searchParams.passengers}
          >
            {isSelected ? (
              <>
                <CheckCircle2 size={18} />
                <span>Kursi Dipilih</span>
              </>
            ) : (
              <>
                <span>Pilih Kursi</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Enlarged Photo Preview Modal for Prospective Passengers */}
      {showPhotoModal && (
        <div className="modal-backdrop" onClick={() => setShowPhotoModal(false)}>
          <div 
            className="ticket-modal-card" 
            style={{ maxWidth: '720px', background: '#0f172a', color: 'white', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', height: '420px', background: '#020617' }}>
              <img 
                src={vehicle.imageUrl} 
                alt={vehicle.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <button
                onClick={() => setShowPhotoModal(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b' }}>
              <div>
                <span className="vehicle-plate">{vehicle.plateNumber}</span>
                <h3 style={{ fontSize: '1.25rem', color: 'white', margin: '4px 0 2px' }}>{vehicle.name}</h3>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Kategori: {vehicle.category} • {vehicle.capacity} Kursi Penumpang ({vehicle.seatLayoutType})
                </span>
              </div>

              <button
                type="button"
                className="btn-select-vehicle"
                style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                onClick={() => {
                  setShowPhotoModal(false);
                  onSelect();
                }}
              >
                <span>Pilih Mobil Ini</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
