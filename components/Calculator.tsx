import React, { useState, useMemo } from 'react';
import { DEFAULT_MILEAGE_KMPL } from '../constants';

const Calculator: React.FC = () => {
    const [price, setPrice] = useState('105');
    const [rupees, setRupees] = useState('500');
    const [liters, setLiters] = useState('');
    const [mileage, setMileage] = useState(String(DEFAULT_MILEAGE_KMPL));
    const [distance, setDistance] = useState('100');

    const calculatedLiters = useMemo(() => {
        const p = parseFloat(price);
        const r = parseFloat(rupees);
        if(p > 0 && r > 0) return (r/p).toFixed(2);
        return '0.00';
    }, [price, rupees]);

    const calculatedCost = useMemo(() => {
        const p = parseFloat(price);
        const l = parseFloat(liters);
        if(p > 0 && l > 0) return (p*l).toFixed(2);
        return '0.00';
    }, [price, liters]);

    const fuelForDistance = useMemo(() => {
        const m = parseFloat(mileage);
        const d = parseFloat(distance);
        if(m > 0 && d > 0) return (d/m).toFixed(2);
        return '0.00';
    }, [mileage, distance]);
    
    const InputField: React.FC<{
        label: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        unit?: string;
    }> = ({ label, value, onChange, unit }) => (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={onChange}
                    className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                />
                {unit && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">{unit}</span>}
            </div>
        </div>
    );
    
    const ResultDisplay: React.FC<{label: string; value: string; unit: string}> = ({label, value, unit}) => (
        <div className="mt-2">
            <span className="text-slate-400">{label}: </span>
            <span className="font-bold text-sky-400">{value} {unit}</span>
        </div>
    );

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-center text-white">Petrol Calculator</h1>
            
            <div className="bg-slate-800 p-4 rounded-xl space-y-3">
                <h2 className="text-lg font-semibold text-white">Cost & Liters</h2>
                <InputField label="Petrol Price" value={price} onChange={e => setPrice(e.target.value)} unit="₹/L"/>
                <InputField label="Amount to Fill" value={rupees} onChange={e => setRupees(e.target.value)} unit="₹"/>
                <ResultDisplay label="You will get" value={calculatedLiters} unit="Liters"/>
                <hr className="border-slate-600 my-4"/>
                <InputField label="Liters to Fill" value={liters} onChange={e => setLiters(e.target.value)} unit="L"/>
                <ResultDisplay label="Total cost will be" value={calculatedCost} unit="₹"/>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl space-y-3">
                <h2 className="text-lg font-semibold text-white">Mileage & Distance</h2>
                 <InputField label="Your Bike's Mileage" value={mileage} onChange={e => setMileage(e.target.value)} unit="km/L"/>
                 <InputField label="Distance to Travel" value={distance} onChange={e => setDistance(e.target.value)} unit="km"/>
                 <ResultDisplay label="Fuel needed" value={fuelForDistance} unit="Liters"/>
            </div>
        </div>
    );
};

export default Calculator;