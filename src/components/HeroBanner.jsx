import React from 'react';
import { Sparkles, ShieldCheck, Armchair, MapPin, Clock, Star } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export const HeroBanner = () => {
  const { routes, vehicles, drivers } = useTravel();

  const activeVehicles = vehicles.filter(v => v.status !== 'Nonaktif');
  const vehicleNames = activeVehicles.map(v => v.name).filter(Boolean);
  const vehicleSummaryText = vehicleNames.length > 0
    ? vehicleNames.slice(0, 3).join(', ')
    : 'eksekutif pilihan';

  return (
    <section className="hero-banner">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-tag">
              <img 
                src="/logo.png" 
                alt="Logo Violet Transport" 
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.4)' }} 
              />
              <span>Official Executive Travel & Shuttle Partner</span>
            </div>
            
            <h1 className="hero-title">
              Pesan Tiket Travel Cepat, <span>Pilih Kursi Sendiri</span> Sesuai Kenyamanan Anda
            </h1>
            
            <p className="hero-desc">
              Layanan antar jemput door-to-door dengan armada {vehicleSummaryText}. Didukung pengemudi berpengalaman, tarif transparan, dan sistem reservasi real-time.
            </p>

            <div className="hero-features-badge">
              <div className="hero-feature-item">
                <ShieldCheck size={18} />
                <span>100% Terpercaya & Berizin</span>
              </div>
              <div className="hero-feature-item">
                <Armchair size={18} />
                <span>Bebas Pilih Nomor Kursi</span>
              </div>
              <div className="hero-feature-item">
                <MapPin size={18} />
                <span>Layanan Door-to-Door</span>
              </div>
              <div className="hero-feature-item">
                <Clock size={18} />
                <span>Jadwal Keberangkatan Fleksibel</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-right-card">
              <div className="hero-stat-grid">
                <div className="hero-stat-card">
                  <h3>{routes.length}+</h3>
                  <p>Rute Terhubung</p>
                </div>
                <div className="hero-stat-card">
                  <h3>{vehicles.length}</h3>
                  <p>Armada Eksekutif</p>
                </div>
                <div className="hero-stat-card">
                  <h3>{drivers.length}</h3>
                  <p>Driver Profesional</p>
                </div>
                <div className="hero-stat-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <h3 style={{ margin: 0 }}>4.9</h3>
                    <Star size={18} fill="#f59e0b" color="#f59e0b" />
                  </div>
                  <p>Rating Pelanggan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
