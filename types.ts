
export interface FuelEntry {
  id?: number;
  date: number; // timestamp
  amountINR: number;
  liters: number;
  pricePerLiter: number;
}

export interface TripRecord {
  id?: number;
  date: number; // timestamp
  distance: number; // in kilometers
  fuelConsumed: number; // in liters
  averageMileage: number;
}
