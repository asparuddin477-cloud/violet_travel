import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  INITIAL_ROUTES,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_SCHEDULES,
  INITIAL_BOOKINGS,
  INITIAL_SETTINGS,
  CABIN_LAYOUTS
} from '../data/initialData';
import {
  isFirebaseConfigured,
  activeProjectId,
  subscribeCollection,
  subscribeDocument,
  saveDocument,
  updateDocument,
  deleteDocument,
  seedInitialDataToFirebase
} from '../services/firebase';

const TravelContext = createContext(null);

export const TravelProvider = ({ children }) => {
  // Load initial state from localStorage or fallback to defaults
  const [routes, setRoutes] = useState(() => {
    const saved = localStorage.getItem('vt_routes');
    return saved ? JSON.parse(saved) : INITIAL_ROUTES;
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('vt_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('vt_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('vt_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('vt_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('vt_settings');
    if (!saved) return INITIAL_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
        pickupServiceTypes: parsed.pickupServiceTypes && parsed.pickupServiceTypes.length > 0 
          ? parsed.pickupServiceTypes 
          : INITIAL_SETTINGS.pickupServiceTypes
      };
    } catch (e) {
      return INITIAL_SETTINGS;
    }
  });

  // Cloud status states
  const [isCloudConnected, setIsCloudConnected] = useState(isFirebaseConfigured);
  const [cloudSyncState, setCloudSyncState] = useState(isFirebaseConfigured ? 'connecting' : 'local-only');
  const [cloudError, setCloudError] = useState(null);
  const autoSeededRef = useRef(false);

  // Sync to local cache (localStorage) whenever state changes
  useEffect(() => {
    localStorage.setItem('vt_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('vt_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('vt_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('vt_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('vt_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('vt_settings', JSON.stringify(settings));
  }, [settings]);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setCloudSyncState('local-only');
      return;
    }

    setCloudSyncState('syncing');

    // 1. Subscribe to Routes
    const unsubRoutes = subscribeCollection('routes', (remoteRoutes) => {
      if (remoteRoutes && remoteRoutes.length > 0) {
        setRoutes(remoteRoutes);
        setIsCloudConnected(true);
        setCloudSyncState('live');
      } else if (!autoSeededRef.current) {
        // Auto-seed if collection is empty
        handleAutoSeed();
      }
    }, (err) => {
      setCloudError(err.message);
      setCloudSyncState('error');
    });

    // 2. Subscribe to Vehicles
    const unsubVehicles = subscribeCollection('vehicles', (remoteVehicles) => {
      if (remoteVehicles && remoteVehicles.length > 0) {
        setVehicles(remoteVehicles);
      }
    });

    // 3. Subscribe to Drivers
    const unsubDrivers = subscribeCollection('drivers', (remoteDrivers) => {
      if (remoteDrivers && remoteDrivers.length > 0) {
        setDrivers(remoteDrivers);
      }
    });

    // 4. Subscribe to Schedules
    const unsubSchedules = subscribeCollection('schedules', (remoteSchedules) => {
      if (remoteSchedules && remoteSchedules.length > 0) {
        setSchedules(remoteSchedules);
      }
    });

    // 5. Subscribe to Bookings (real-time order updates for all users)
    const unsubBookings = subscribeCollection('bookings', (remoteBookings) => {
      if (remoteBookings && remoteBookings.length > 0) {
        // Sort newest first
        const sorted = [...remoteBookings].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setBookings(sorted);
      }
    });

    // 6. Subscribe to Settings
    const unsubSettings = subscribeDocument('settings', 'general', (remoteSettings) => {
      if (remoteSettings) {
        setSettings((prev) => ({
          ...prev,
          ...remoteSettings,
          pickupServiceTypes: remoteSettings.pickupServiceTypes && remoteSettings.pickupServiceTypes.length > 0 
            ? remoteSettings.pickupServiceTypes 
            : prev.pickupServiceTypes
        }));
      }
    });

    return () => {
      unsubRoutes();
      unsubVehicles();
      unsubDrivers();
      unsubSchedules();
      unsubBookings();
      unsubSettings();
    };
  }, []);

  // Auto-seed initial data if Firestore is empty on first load
  const handleAutoSeed = async () => {
    if (autoSeededRef.current || !isFirebaseConfigured) return;
    autoSeededRef.current = true;
    try {
      await seedInitialDataToFirebase({
        routes: INITIAL_ROUTES,
        vehicles: INITIAL_VEHICLES,
        drivers: INITIAL_DRIVERS,
        schedules: INITIAL_SCHEDULES,
        bookings: INITIAL_BOOKINGS,
        settings: INITIAL_SETTINGS
      });
      setIsCloudConnected(true);
      setCloudSyncState('live');
    } catch (e) {
      console.warn('Auto-seed to Firestore skipped or failed:', e);
    }
  };

  // Manual Push / Sync to Cloud
  const syncToCloud = async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase belum dikonfigurasi. Periksa file .env Anda.');
    }
    setCloudSyncState('syncing');
    try {
      await seedInitialDataToFirebase({
        routes,
        vehicles,
        drivers,
        schedules,
        bookings,
        settings
      });
      setIsCloudConnected(true);
      setCloudSyncState('live');
      return { success: true, message: 'Seluruh data berhasil disinkronkan ke Cloud Firestore!' };
    } catch (err) {
      setCloudError(err.message);
      setCloudSyncState('error');
      throw err;
    }
  };

  // Route CRUD
  const addRoute = async (route) => {
    const newRoute = { ...route, id: `route-${Date.now()}`, active: true };
    setRoutes((prev) => [newRoute, ...prev]);
    if (isFirebaseConfigured) {
      try {
        await saveDocument('routes', newRoute.id, newRoute);
      } catch (err) {
        console.error('Error saving route to Firestore:', err);
      }
    }
    return newRoute;
  };

  const updateRoute = async (id, updatedData) => {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r)));
    if (isFirebaseConfigured) {
      try {
        await updateDocument('routes', id, updatedData);
      } catch (err) {
        console.error('Error updating route in Firestore:', err);
      }
    }
  };

  const deleteRoute = async (id) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
    if (isFirebaseConfigured) {
      try {
        await deleteDocument('routes', id);
      } catch (err) {
        console.error('Error deleting route in Firestore:', err);
      }
    }
  };

  const toggleRouteActive = async (id) => {
    const target = routes.find((r) => r.id === id);
    if (!target) return;
    const newActiveState = !target.active;
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: newActiveState } : r))
    );
    if (isFirebaseConfigured) {
      try {
        await updateDocument('routes', id, { active: newActiveState });
      } catch (err) {
        console.error('Error toggling route in Firestore:', err);
      }
    }
  };

  // Vehicle CRUD
  const addVehicle = async (vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
      status: vehicle.status || 'Aktif',
      extraFee: Number(vehicle.extraFee) || 0,
      capacity: Number(vehicle.capacity) || 10
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    if (isFirebaseConfigured) {
      try {
        await saveDocument('vehicles', newVehicle.id, newVehicle);
      } catch (err) {
        console.error('Error saving vehicle to Firestore:', err);
      }
    }
    return newVehicle;
  };

  const updateVehicle = async (id, updatedData) => {
    const formattedData = {
      ...updatedData,
      ...(updatedData.extraFee !== undefined ? { extraFee: Number(updatedData.extraFee) } : {}),
      ...(updatedData.capacity !== undefined ? { capacity: Number(updatedData.capacity) } : {})
    };
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...formattedData } : v))
    );
    if (isFirebaseConfigured) {
      try {
        await updateDocument('vehicles', id, formattedData);
      } catch (err) {
        console.error('Error updating vehicle in Firestore:', err);
      }
    }
  };

  const deleteVehicle = async (id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (isFirebaseConfigured) {
      try {
        await deleteDocument('vehicles', id);
      } catch (err) {
        console.error('Error deleting vehicle in Firestore:', err);
      }
    }
  };

  // Driver CRUD
  const addDriver = async (driver) => {
    const newDriver = {
      ...driver,
      id: `drv-${Date.now()}`,
      rating: 5.0,
      tripsCount: 0,
      status: driver.status || 'Siap Jalan',
      avatar:
        driver.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setDrivers((prev) => [newDriver, ...prev]);
    if (isFirebaseConfigured) {
      try {
        await saveDocument('drivers', newDriver.id, newDriver);
      } catch (err) {
        console.error('Error saving driver to Firestore:', err);
      }
    }
    return newDriver;
  };

  const updateDriver = async (id, updatedData) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...updatedData } : d)));
    if (updatedData.assignedVehicleId !== undefined) {
      setVehicles((prev) =>
        prev.map((v) => {
          if (updatedData.assignedVehicleId && v.id === updatedData.assignedVehicleId) {
            return { ...v, assignedDriverId: id };
          }
          if (v.assignedDriverId === id && v.id !== updatedData.assignedVehicleId) {
            return { ...v, assignedDriverId: '' };
          }
          return v;
        })
      );
    }
    if (isFirebaseConfigured) {
      try {
        await updateDocument('drivers', id, updatedData);
        if (updatedData.assignedVehicleId) {
          await updateDocument('vehicles', updatedData.assignedVehicleId, { assignedDriverId: id });
        }
      } catch (err) {
        console.error('Error updating driver in Firestore:', err);
      }
    }
  };

  const deleteDriver = async (id) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    if (isFirebaseConfigured) {
      try {
        await deleteDocument('drivers', id);
      } catch (err) {
        console.error('Error deleting driver in Firestore:', err);
      }
    }
  };

  // Schedule CRUD
  const addSchedule = async (schedule) => {
    const newSchedule = { ...schedule, id: `sch-${Date.now()}` };
    setSchedules((prev) => [...prev, newSchedule]);
    if (isFirebaseConfigured) {
      try {
        await saveDocument('schedules', newSchedule.id, newSchedule);
      } catch (err) {
        console.error('Error saving schedule to Firestore:', err);
      }
    }
  };

  const deleteSchedule = async (id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    if (isFirebaseConfigured) {
      try {
        await deleteDocument('schedules', id);
      } catch (err) {
        console.error('Error deleting schedule in Firestore:', err);
      }
    }
  };

  // Booking CRUD (Real-time collaborative bookings)
  const addBooking = async (bookingData) => {
    const bookingCode = `VT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      ...bookingData,
      id: `BK-${Date.now()}`,
      bookingCode,
      bookingStatus: 'Dikonfirmasi',
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };
    setBookings((prev) => [newBooking, ...prev]);
    if (isFirebaseConfigured) {
      try {
        await saveDocument('bookings', newBooking.id, newBooking);
      } catch (err) {
        console.error('Error saving booking to Firestore:', err);
      }
    }
    return newBooking;
  };

  const updateBookingStatus = async (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, bookingStatus: newStatus } : b))
    );
    if (isFirebaseConfigured) {
      try {
        await updateDocument('bookings', id, { bookingStatus: newStatus });
      } catch (err) {
        console.error('Error updating booking status in Firestore:', err);
      }
    }
  };

  const updatePaymentStatus = async (id, newPaymentStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paymentStatus: newPaymentStatus } : b))
    );
    if (isFirebaseConfigured) {
      try {
        await updateDocument('bookings', id, { paymentStatus: newPaymentStatus });
      } catch (err) {
        console.error('Error updating payment status in Firestore:', err);
      }
    }
  };

  const cancelBooking = async (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, bookingStatus: 'Dibatalkan' } : b))
    );
    if (isFirebaseConfigured) {
      try {
        await updateDocument('bookings', id, { bookingStatus: 'Dibatalkan' });
      } catch (err) {
        console.error('Error cancelling booking in Firestore:', err);
      }
    }
  };

  // Assign driver to a booking
  const assignDriverToBooking = async (bookingId, driverId) => {
    const targetDriver = drivers.find((d) => d.id === driverId);
    if (!targetDriver) return null;

    const assignedVehicle = vehicles.find((v) => v.id === targetDriver.assignedVehicleId);

    const updatedFields = {
      driverId: targetDriver.id,
      driverName: targetDriver.name,
      driverPhone: targetDriver.phone,
      ...(assignedVehicle ? {
        vehicleId: assignedVehicle.id,
        vehicleName: assignedVehicle.name,
        plateNumber: assignedVehicle.plateNumber
      } : {}),
      taskStatus: 'Menunggu Konfirmasi Sopir',
      taskNotification: {
        id: `notif-${Date.now()}`,
        assignedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'unread',
        driverId: targetDriver.id,
        driverName: targetDriver.name,
        message: `Tugas perjalanan baru tanggal ${(bookings.find(b => b.id === bookingId)?.travelDate) || ''}.`
      }
    };

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ...updatedFields } : b))
    );

    if (isFirebaseConfigured) {
      try {
        await updateDocument('bookings', bookingId, updatedFields);
      } catch (err) {
        console.error('Error assigning driver in Firestore:', err);
      }
    }
    return targetDriver;
  };

  // Driver accepts the assigned task
  const acceptDriverTask = async (bookingId) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    const updatedNotification = {
      ...(targetBooking?.taskNotification || {}),
      status: 'accepted',
      acceptedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              taskStatus: 'Tugas Diterima & Siap Jalan',
              taskNotification: updatedNotification
            }
          : b
      )
    );

    if (isFirebaseConfigured) {
      try {
        await updateDocument('bookings', bookingId, {
          taskStatus: 'Tugas Diterima & Siap Jalan',
          taskNotification: updatedNotification
        });
      } catch (err) {
        console.error('Error accepting driver task in Firestore:', err);
      }
    }
  };

  // Driver drops off passenger
  const dropoffPassenger = async (bookingId) => {
    const updateData = {
      bookingStatus: 'Selesai',
      taskStatus: 'Perjalanan Selesai',
      droppedOffAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ...updateData } : b))
    );

    if (isFirebaseConfigured) {
      try {
        await updateDocument('bookings', bookingId, updateData);
      } catch (err) {
        console.error('Error updating dropoff in Firestore:', err);
      }
    }
  };

  // Update Settings
  const updateSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    if (isFirebaseConfigured) {
      try {
        await saveDocument('settings', 'general', merged);
      } catch (err) {
        console.error('Error saving settings to Firestore:', err);
      }
    }
  };

  // Seat occupancy calculation
  const getOccupiedSeats = useCallback((vehicleId, travelDate, departureTime) => {
    const relevantBookings = bookings.filter(
      (b) =>
        b.vehicleId === vehicleId &&
        b.travelDate === travelDate &&
        b.departureTime === departureTime &&
        b.bookingStatus !== 'Dibatalkan'
    );

    const occupied = new Set();
    relevantBookings.forEach((b) => {
      if (Array.isArray(b.selectedSeats)) {
        b.selectedSeats.forEach((seat) => occupied.add(seat));
      }
    });

    return Array.from(occupied);
  }, [bookings]);

  // Helper currency formatter
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num || 0);
  };

  // Reset to initial defaults
  const resetToDefaults = async () => {
    setRoutes(INITIAL_ROUTES);
    setVehicles(INITIAL_VEHICLES);
    setDrivers(INITIAL_DRIVERS);
    setSchedules(INITIAL_SCHEDULES);
    setBookings(INITIAL_BOOKINGS);
    setSettings(INITIAL_SETTINGS);
    localStorage.clear();

    if (isFirebaseConfigured) {
      try {
        await seedInitialDataToFirebase({
          routes: INITIAL_ROUTES,
          vehicles: INITIAL_VEHICLES,
          drivers: INITIAL_DRIVERS,
          schedules: INITIAL_SCHEDULES,
          bookings: INITIAL_BOOKINGS,
          settings: INITIAL_SETTINGS
        });
      } catch (err) {
        console.error('Error resetting Firestore defaults:', err);
      }
    }
  };

  return (
    <TravelContext.Provider
      value={{
        routes,
        vehicles,
        drivers,
        schedules,
        bookings,
        settings,
        cabinLayouts: CABIN_LAYOUTS,
        addRoute,
        updateRoute,
        deleteRoute,
        toggleRouteActive,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addDriver,
        updateDriver,
        deleteDriver,
        addSchedule,
        deleteSchedule,
        addBooking,
        updateBookingStatus,
        updatePaymentStatus,
        cancelBooking,
        assignDriverToBooking,
        acceptDriverTask,
        dropoffPassenger,
        getOccupiedSeats,
        formatRupiah,
        setSettings: updateSettings,
        resetToDefaults,
        // Cloud properties
        isCloudConnected,
        cloudSyncState,
        cloudError,
        activeProjectId,
        syncToCloud
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
