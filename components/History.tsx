import React, { useState, useEffect, useCallback } from 'react';
import { getFuelEntries, getTripRecords } from '../services/db';
import { FuelEntry, TripRecord } from '../types';

type HistoryItem = (FuelEntry | TripRecord) & { type: 'fuel' | 'trip' };

const History: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const fuelEntries = await getFuelEntries();
      const tripRecords = await getTripRecords();

      const combined: HistoryItem[] = [
        ...fuelEntries.map((f): HistoryItem => ({ ...f, type: 'fuel' })),
        ...tripRecords.map((t): HistoryItem => ({ ...t, type: 'trip' })),
      ];

      combined.sort((a, b) => b.date - a.date);
      setItems(combined);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const FuelCard: React.FC<{ item: FuelEntry }> = ({ item }) => (
    <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center">
      <div>
        <p className="font-bold text-emerald-400">Fuel Added</p>
        <p className="text-sm text-slate-400">{new Date(item.date).toLocaleString()}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">{item.liters.toFixed(2)} L</p>
        <p className="text-sm text-slate-300">₹{item.amountINR.toFixed(2)}</p>
      </div>
    </div>
  );

  const TripCard: React.FC<{ item: TripRecord }> = ({ item }) => (
    <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center">
      <div>
        <p className="font-bold text-sky-400">Trip Completed</p>
        <p className="text-sm text-slate-400">{new Date(item.date).toLocaleString()}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">{item.distance.toFixed(2)} km</p>
        <p className="text-sm text-slate-300">~{item.fuelConsumed.toFixed(2)} L used</p>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-white">History</h1>
      {loading ? (
        <p className="text-center text-slate-400">Loading history...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-slate-400 px-4">No history found. Start a trip or add fuel to get started.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) =>
            item.type === 'fuel' ? (
              <FuelCard key={`fuel-${item.id}`} item={item as FuelEntry} />
            ) : (
              <TripCard key={`trip-${item.id}`} item={item as TripRecord} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default History;