import React, { useState } from 'react';
import { addFuelEntry } from '../services/db';
import { FuelEntry } from '../types';

interface AddFuelModalProps {
  onClose: () => void;
  onSave: () => void;
}

const AddFuelModal: React.FC<AddFuelModalProps> = ({ onClose, onSave }) => {
  const [amountINR, setAmountINR] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    const amount = parseFloat(amountINR);
    const price = parseFloat(pricePerLiter);

    if (isNaN(amount) || isNaN(price) || amount <= 0 || price <= 0) {
      setError('Please enter valid positive numbers.');
      return;
    }
    setError('');

    const liters = amount / price;

    const newEntry: FuelEntry = {
      date: Date.now(),
      amountINR: amount,
      liters: liters,
      pricePerLiter: price,
    };
    
    try {
      await addFuelEntry(newEntry);
      onSave();
    } catch (e) {
      setError('Failed to save fuel entry.');
      console.error(e);
    }
  };
  
  const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    id: string;
  }> = ({ label, value, onChange, placeholder, id }) => (
     <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-300">{label}</label>
        <input
            type="number"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 placeholder-slate-400"
            required
        />
     </div>
  );


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Add Fuel Entry</h2>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <InputField
            id="amountINR"
            label="Amount (INR)"
            value={amountINR}
            onChange={(e) => setAmountINR(e.target.value)}
            placeholder="e.g., 500"
        />

        <InputField
            id="pricePerLiter"
            label="Price per Liter (INR)"
            value={pricePerLiter}
            onChange={(e) => setPricePerLiter(e.target.value)}
            placeholder="e.g., 105.50"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-600 hover:bg-slate-500 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white transition-colors"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFuelModal;