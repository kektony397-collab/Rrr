
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
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
        <input
            type="number"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
            required
        />
     </div>
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4">
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
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md text-sm font-medium bg-cyan-600 hover:bg-cyan-700 text-white transition-colors"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFuelModal;
