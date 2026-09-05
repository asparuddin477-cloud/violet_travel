import React from 'react';
import { 
  Armchair, 
  Disc, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Info,
  Car
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const InteractiveSeatMap = ({ 
  vehicle, 
  searchParams, 
  selectedSeats, 
  setSelectedSeats, 
  onProceedToPassenger 
}) => {
  const { cabinLayouts, getOccupiedSeats } = useTravel();

  const layoutType = vehicle.seatLayoutType || 'hiace-10';
  const layout = cabinLayouts[layoutType] || cabinLayouts['hiace-10'];

  // Check occupied seats for this specific vehicle, date, and schedule
  const occupiedSeats = getOccupiedSeats(
    vehicle.id, 
    searchParams.travelDate, 
    searchParams.departureTime
  );

  const maxSeatsAllowed = searchParams.passengers || 1;

  const handleSeatClick = (seat) => {
    if (!seat || seat.type !== 'seat') return;
    if (occupiedSeats.includes(seat.id)) return;

    if (selectedSeats.includes(seat.id)) {
      // Deselect
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      // Select
      if (selectedSeats.length < maxSeatsAllowed) {
        setSelectedSeats([...selectedSeats, seat.id]);
      } else {
        // If already at limit, replace the first selected seat
        const updated = [...selectedSeats.slice(1), seat.id];
        setSelectedSeats(updated);
      }
    }
  };

  const isComplete = selectedSeats.length === maxSeatsAllowed;

  return (
    <div className="seat-selection-container" id="seat-selection-view">
      <div className="seat-selection-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src={vehicle.imageUrl} 
            alt={vehicle.name} 
            style={{ width: '80px', height: '54px', borderRadius: '10px', objectFit: 'cover', border: '2px solid var(--border)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="vehicle-plate" style={{ fontSize: '0.75rem' }}>{vehicle.plateNumber}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                {layout.title || vehicle.name}
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: '2px 0 0' }}>
              Denah Kursi: {vehicle.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Silakan klik nomor kursi yang Anda inginkan. Total {maxSeatsAllowed} kursi diperlukan.
            </p>
          </div>
        </div>

        {/* Selected Seats Counter */}
        <div style={{
          background: isComplete ? 'var(--success-light)' : 'var(--primary-light)',
          color: isComplete ? 'var(--success)' : 'var(--primary-hover)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {isComplete ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>
            {selectedSeats.length} dari {maxSeatsAllowed} Kursi Dipilih: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Belum Ada'}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="seat-instructions">
        <Info size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
        <strong>Tips:</strong> Kursi bertanda <em>VIP</em> adalah baris depan atau captain seat dengan ruang kaki (legroom) lebih lega.
      </div>

      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-swatch available"></div>
          <span>Tersedia (Kosong)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch selected">✓</div>
          <span>Kursi Anda</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch occupied">✕</div>
          <span>Sudah Terisi (Booked)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch driver">
            <Disc size={14} />
          </div>
          <span>Posisi Sopir</span>
        </div>
      </div>

      {/* Cabin Visualization Box */}
      <div className="cabin-frame">
        {/* Windshield */}
        <div className="cabin-windshield">
          <Car size={14} style={{ marginRight: '6px' }} />
          BAGIAN DEPAN / KACA UTAMA
        </div>

        {/* Driver & Front Passenger Row */}
        <div className="cabin-front-row">
          {/* Driver Seat */}
          <div className="driver-seat-box">
            <Disc size={22} />
            <span>SOPIR</span>
          </div>

          {/* Center console / gear */}
          <div className="aisle-space">
            <span>DASHBOARD</span>
          </div>

          {/* Front Passenger Seat (if exists) */}
          {layout.frontPassenger ? (
            (() => {
              const seat = layout.frontPassenger;
              const isOccupied = occupiedSeats.includes(seat.id);
              const isSelected = selectedSeats.includes(seat.id);
              return (
                <button
                  type="button"
                  className={`seat-btn ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={isOccupied}
                  title={`${seat.note || 'Kursi ' + seat.label} ${isOccupied ? '(Sudah Dipesan)' : ''}`}
                >
                  {seat.isVip && <span className="seat-badge-vip">VIP</span>}
                  <Armchair size={22} />
                  <span>{seat.label}</span>
                </button>
              );
            })()
          ) : (
            <div className="aisle-space"></div>
          )}
        </div>

        {/* Passenger Cabin Rows */}
        <div className="cabin-body-rows">
          {layout.rows.map((rowSeats, rowIdx) => {
            const is4Cols = rowSeats.length >= 4;
            return (
              <div
                key={rowIdx}
                className={is4Cols ? 'cabin-grid-row-4cols' : 'cabin-grid-row'}
              >
                {rowSeats.map((item, colIdx) => {
                  if (item.type === 'aisle') {
                    return (
                      <div key={item.id || colIdx} className="aisle-space">
                        <span>LORONG</span>
                      </div>
                    );
                  }

                  const isOccupied = occupiedSeats.includes(item.id);
                  const isSelected = selectedSeats.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`seat-btn ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                      onClick={() => handleSeatClick(item)}
                      disabled={isOccupied}
                      title={`${item.note || 'Kursi ' + item.label} ${isOccupied ? '(Sudah Dipesan)' : ''}`}
                    >
                      {item.isVip && <span className="seat-badge-vip">VIP</span>}
                      <Armchair size={22} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Back trunk indicator */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#94a3b8',
          borderTop: '1px dashed #cbd5e1',
          paddingTop: '8px',
          marginTop: '12px'
        }}>
          BAGASI BELAKANG KENDARAAN
        </div>
      </div>

      {/* Action to proceed to passenger form */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button
          type="button"
          className="btn-confirm-booking"
          style={{ width: 'auto', padding: '0.85rem 2rem' }}
          onClick={onProceedToPassenger}
          disabled={selectedSeats.length === 0}
        >
          <span>Lanjut ke Formulir Penumpang ({selectedSeats.length} Kursi Dipilih)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
