import React, { useState, useEffect, useRef, useCallback } from 'react';
import Speedometer from './Speedometer';
import AddFuelModal from './AddFuelModal';
import { addTripRecord, getFuelEntries, getTripRecords } from '../services/db';
import { DEFAULT_MILEAGE_KMPL } from '../constants';
import { TripRecord } from '../types';

const InfoCard: React.FC<{ label: string; value: string; unit: string }> = ({ label, value, unit }) => (
  <div className="bg-slate-800 p-4 rounded-xl text-center shadow-lg">
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="text-sm text-slate-400">{label} ({unit})</div>
  </div>
);

const Dashboard: React.FC = () => {
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isTripActive, setTripActive] = useState(false);
  const [showAddFuelModal, setShowAddFuelModal] = useState(false);
  const [totalFuel, setTotalFuel] = useState(0); // in Liters
  const [fuelConsumed, setFuelConsumed] = useState(0);
  const [geoError, setGeoError] = useState<string | null>(null);

  const watchId = useRef<number | null>(null);
  const lastPosition = useRef<GeolocationPosition | null>(null);
  const tripDistance = useRef(0);

  const loadData = useCallback(async () => {
    try {
      const fuelEntries = await getFuelEntries();
      const tripRecords = await getTripRecords();
      const totalLitersFilled = fuelEntries.reduce((acc, entry) => acc + entry.liters, 0);
      const totalLitersConsumed = tripRecords.reduce((acc, record) => acc + record.fuelConsumed, 0);
      setTotalFuel(totalLitersFilled - totalLitersConsumed);
    } catch (error) {
      console.error("Failed to load initial data from DB", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const haversineDistance = (coords1: GeolocationCoordinates, coords2: GeolocationCoordinates): number => {
    const R = 6371e3; // metres
    const φ1 = coords1.latitude * Math.PI/180;
    const φ2 = coords2.latitude * Math.PI/180;
    const Δφ = (coords2.latitude-coords1.latitude) * Math.PI/180;
    const Δλ = (coords2.longitude-coords1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
  }
  
  const handlePositionUpdate = (position: GeolocationPosition) => {
    setGeoError(null);
    let currentSpeed = 0;
    if (position.coords.speed !== null && position.coords.speed > 0) {
      currentSpeed = position.coords.speed * 3.6; // m/s to km/h
    } else if (lastPosition.current) {
        const dist = haversineDistance(lastPosition.current.coords, position.coords);
        const timeDiff = (position.timestamp - lastPosition.current.timestamp) / 1000; // seconds
        if(timeDiff > 0) {
            const speedMs = dist / timeDiff;
            currentSpeed = speedMs * 3.6; // m/s to km/h
        }
    }
    
    setSpeed(currentSpeed > 200 ? 200 : currentSpeed);

    if (lastPosition.current) {
      const distanceIncrement = haversineDistance(lastPosition.current.coords, position.coords) / 1000; // to km
      tripDistance.current += distanceIncrement;
      setDistance(tripDistance.current);
      setFuelConsumed(tripDistance.current / DEFAULT_MILEAGE_KMPL);
    }
    lastPosition.current = position;
  };

  const handleGeoError = (error: GeolocationPositionError) => {
    setGeoError(`Error ${error.code}: ${error.message}`);
  };

  const startTrip = () => {
    if (navigator.geolocation) {
      setGeoError(null);
      tripDistance.current = 0;
      setDistance(0);
      setFuelConsumed(0);
      lastPosition.current = null;
      watchId.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handleGeoError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      setTripActive(true);
    } else {
      setGeoError("Geolocation is not supported by this browser.");
    }
  };

  const stopTrip = async () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setTripActive(false);
    setSpeed(0);

    if (distance > 0.01) { // Only save trips with meaningful distance
      const newTrip: TripRecord = {
        date: Date.now(),
        distance: distance,
        fuelConsumed: fuelConsumed,
        averageMileage: DEFAULT_MILEAGE_KMPL,
      };
      await addTripRecord(newTrip);
      await loadData(); // Reload data to update total fuel
    }
  };

  const handleFuelAdded = () => {
    loadData();
    setShowAddFuelModal(false);
  };
  
  const fuelRemaining = totalFuel - fuelConsumed;
  const estimatedRange = fuelRemaining * DEFAULT_MILEAGE_KMPL;

  return (
    <div className="p-4 flex flex-col items-center gap-6">
      {geoError && (
          <div className="w-full p-4 mb-4 text-sm text-red-300 bg-red-900/50 border border-red-500/30 rounded-lg" role="alert">
              <span className="font-medium">Geolocation Error:</span> {geoError}
          </div>
      )}
      <Speedometer speed={speed} />
      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
        <InfoCard label="Distance" value={distance.toFixed(1)} unit="km" />
        <InfoCard label="Est. Range" value={estimatedRange > 0 ? estimatedRange.toFixed(0) : '0'} unit="km" />
        <InfoCard label="Fuel Left" value={fuelRemaining > 0 ? fuelRemaining.toFixed(1) : '0'} unit="L" />
      </div>

      <div className="w-full max-w-md flex flex-col gap-4">
        <button
          onClick={isTripActive ? stopTrip : startTrip}
          className={`w-full py-4 px-6 text-xl font-bold rounded-xl transition-all duration-300 shadow-lg transform active:scale-95 ${
            isTripActive
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
              : 'bg-sky-500 hover:bg-sky-600 text-slate-900 shadow-sky-500/30'
          }`}
        >
          {isTripActive ? 'Stop Trip' : 'Start Trip'}
        </button>
        <button
            onClick={() => setShowAddFuelModal(true)}
            className="w-full py-3 px-6 text-lg font-semibold rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors duration-200"
        >
            Add Fuel
        </button>
      </div>

      {showAddFuelModal && <AddFuelModal onClose={() => setShowAddFuelModal(false)} onSave={handleFuelAdded} />}
    </div>
  );
};

export default Dashboard;