import React from 'react';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Leaf, TrendingUp, ShieldCheck, Droplets, Trees } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminEcoImpact = () => {
  const { environmentalImpact } = useData();

  const monthlyRecyclingTrend = [
    { month: 'Jan', waste: 4200, co2: 6300 },
    { month: 'Feb', waste: 6800, co2: 10200 },
    { month: 'Mar', waste: 9500, co2: 14250 },
    { month: 'Apr', waste: 12400, co2: 18600 },
    { month: 'May', waste: 15800, co2: 23700 },
    { month: 'Jun', waste: 19200, co2: 28800 }
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Environmental Impact Dashboard" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-6 border border-emerald-500/30 shadow-xl">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <Leaf className="w-5 h-5 text-lime-400" />
              <span>ECO MART Environmental Impact & Sustainability Ledger</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">Verified metrics measuring landfill waste diverted, CO2 offsets, and trees preserved across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500 uppercase">Total Waste Recycled</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{environmentalImpact.totalWasteRecycledKg.toLocaleString('en-IN')} kg</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Diverted from Indian Landfills</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500 uppercase">CO₂ Greenhouse Offset</p>
              <h3 className="text-3xl font-extrabold text-lime-600 mt-1">{environmentalImpact.co2SavedKg.toLocaleString('en-IN')} kg</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Net Carbon Footprint Reduction</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500 uppercase">Trees Equivalent Saved</p>
              <h3 className="text-3xl font-extrabold text-teal-600 mt-1">{environmentalImpact.treesPreserved} Trees</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Forest Resource Conservation</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <p className="text-xs font-bold text-emerald-800 uppercase">Plastic Diverted</p>
              <p className="text-xl font-extrabold text-emerald-900 mt-1">{(environmentalImpact.plasticDivertedKg || 18400).toLocaleString('en-IN')} kg</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <p className="text-xs font-bold text-blue-800 uppercase">Paper Recovered</p>
              <p className="text-xl font-extrabold text-blue-900 mt-1">{(environmentalImpact.paperRecoveredKg || 14200).toLocaleString('en-IN')} kg</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <p className="text-xs font-bold text-amber-800 uppercase">E-Waste Processed</p>
              <p className="text-xl font-extrabold text-amber-900 mt-1">{(environmentalImpact.eWasteRecycledKg || 8900).toLocaleString('en-IN')} kg</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900">Monthly Recycling Tonnage & CO₂ Saved Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRecyclingTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="waste" fill="#10b981" name="Waste Recycled (kg)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="co2" fill="#84cc16" name="CO2 Saved (kg)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEcoImpact;
