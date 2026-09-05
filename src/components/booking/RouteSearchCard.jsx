import React from 'react';
import { MapPin, Calendar, Clock, Users, ArrowLeftRight, Search } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const RouteSearchCard = ({ searchParams, setSearchParams, onSearch }) => {
  const { routes, schedules } = useTravel();

  // Extract unique origins and destinations
  const origins = Array.from(new Set(routes.filter(r => r.active).map(r => r.origin)));
  const destinations = Array.from(new Set(routes.filter(r => r.active).map(r => r.destination)));

  const handleSwap = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const handleChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="search-box-card">
      <form onSubmit={handleSubmit} className="search-form-grid">
        {/* Origin */}
        <div className="form-group">
          <label>
            <MapPin size={16} />
            <span>Kota / Titik Asal</span>
          </label>
          <select
            className="form-select"
            value={searchParams.origin}
            onChange={(e) => handleChange('origin', e.target.value)}
            required
          >
            {origins.length === 0 ? (
              <option value="">Belum ada rute tersedia</option>
            ) : (
              origins.map(origin => (
                <option key={origin} value={origin}>{origin}</option>
              ))
            )}
          </select>
        </div>

        {/* Swap Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn-swap-route"
            onClick={handleSwap}
            title="Tukar Asal dan Tujuan"
            aria-label="Tukar Asal dan Tujuan"
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>

        {/* Destination */}
        <div className="form-group">
          <label>
            <MapPin size={16} />
            <span>Kota / Titik Tujuan</span>
          </label>
          <select
            className="form-select"
            value={searchParams.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            required
          >
            {destinations.length === 0 ? (
              <option value="">Belum ada rute tersedia</option>
            ) : (
              destinations.map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))
            )}
          </select>
        </div>

        {/* Date */}
        <div className="form-group">
          <label>
            <Calendar size={16} />
            <span>Tanggal Berangkat</span>
          </label>
          <input
            type="date"
            className="form-control"
            value={searchParams.travelDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleChange('travelDate', e.target.value)}
            required
          />
        </div>

        {/* Departure Time */}
        <div className="form-group">
          <label>
            <Clock size={16} />
            <span>Jam Keberangkatan</span>
          </label>
          <select
            className="form-select"
            value={searchParams.departureTime}
            onChange={(e) => handleChange('departureTime', e.target.value)}
            required
          >
            {schedules.map(sch => (
              <option key={sch.id} value={sch.time}>
                {sch.time} ({sch.label})
              </option>
            ))}
          </select>
        </div>

        {/* Passenger Count */}
        <div className="form-group">
          <label>
            <Users size={16} />
            <span>Jumlah Kursi</span>
          </label>
          <select
            className="form-select"
            value={searchParams.passengers}
            onChange={(e) => handleChange('passengers', Number(e.target.value))}
          >
            <option value={1}>1 Orang Penumpang</option>
            <option value={2}>2 Orang Penumpang</option>
            <option value={3}>3 Orang Penumpang</option>
            <option value={4}>4 Orang Penumpang</option>
            <option value={5}>5 Orang Penumpang</option>
            <option value={6}>6 Orang (Rombongan)</option>
          </select>
        </div>

        {/* Search Action */}
        <button type="submit" className="btn-search-tickets">
          <Search size={18} />
          <span>Cari Armada</span>
        </button>
      </form>
    </div>
  );
};
