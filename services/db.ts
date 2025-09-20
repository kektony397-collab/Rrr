
import { FuelEntry, TripRecord } from '../types';

const DB_NAME = 'bikeSpeedoDB';
const DB_VERSION = 1;
const FUEL_STORE = 'fuelEntries';
const TRIP_STORE = 'tripRecords';

let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening DB', request.error);
      reject(false);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(true);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(FUEL_STORE)) {
        db.createObjectStore(FUEL_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(TRIP_STORE)) {
        db.createObjectStore(TRIP_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addFuelEntry = (entry: FuelEntry): Promise<number> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FUEL_STORE], 'readwrite');
    const store = transaction.objectStore(FUEL_STORE);
    const request = store.add(entry);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

export const addTripRecord = (record: TripRecord): Promise<number> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TRIP_STORE], 'readwrite');
    const store = transaction.objectStore(TRIP_STORE);
    const request = store.add(record);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

export const getFuelEntries = (): Promise<FuelEntry[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FUEL_STORE], 'readonly');
    const store = transaction.objectStore(FUEL_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.sort((a,b) => b.date - a.date));
    request.onerror = () => reject(request.error);
  });
};

export const getTripRecords = (): Promise<TripRecord[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TRIP_STORE], 'readonly');
    const store = transaction.objectStore(TRIP_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.sort((a,b) => b.date - a.date));
    request.onerror = () => reject(request.error);
  });
};
