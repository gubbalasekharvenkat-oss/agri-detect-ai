
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area 
} from 'recharts';
import { DiseaseStat, ModelMetric, MapPoint } from '../types';

const diseaseStats: DiseaseStat[] = [
  { name: 'Late Blight', count: 450 },
  { name: 'Early Blight', count: 300 },
  { name: 'Common Rust', count: 210 },
  { name: 'Leaf Rust', count: 180 },
  { name: 'Healthy', count: 1200 },
];

const modelMetrics: ModelMetric[] = [
  { version: 'v1.0', precision: 0.85, recall: 0.82, f1: 0.83, date: '2024-01' },
  { version: 'v1.1', precision: 0.88, recall: 0.85, f1: 0.86, date: '2024-02' },
  { version: 'v2.0', precision: 0.94, recall: 0.91, f1: 0.92, date: '2024-03' },
];

const regionalGrowth = [
  { month: 'Jan', north: 40, south: 24, east: 20 },
  { month: 'Feb', north: 30, south: 13, east: 22 },
  { month: 'Mar', north: 20, south: 98, east: 22 },
  { month: 'Apr', north: 27, south: 39, east: 20 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const AdminDashboard: React.FC = () => {
  const [isAddingDisease, setIsAddingDisease] = useState(false);

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h2>
          <p className="text-slate-500">Enterprise resource management and neural network metrics.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddingDisease(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Disease Data
          </button>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '12,482', trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Daily Scans', value: '3,104', trend: '+5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Model Accuracy', value: '94.2%', trend: '+2.1%', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Active Regions', value: '84', trend: 'Stable', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
              <span className={`text-xs font-bold ${stat.color} ${stat.bg} px-2 py-0.5 rounded-full`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model Performance */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Neural Network Evolution</h3>
            <select className="bg-slate-50 border-none rounded-xl text-sm font-bold p-2 outline-none">
              <option>Precision/Recall</option>
              <option>Latency</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={modelMetrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="version" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="precision" stroke="#10b981" strokeWidth={4} dot={{r: 6}} activeDot={{r: 8}} />
                <Line type="monotone" dataKey="recall" stroke="#3b82f6" strokeWidth={4} dot={{r: 6}} activeDot={{r: 8}} />
                <Line type="monotone" dataKey="f1" stroke="#8b5cf6" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Stats */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Pathogen Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {diseaseStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {diseaseStats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                  <span className="text-sm font-medium text-slate-600">{stat.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Analytics */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Regional Outbreak Dynamics</h3>
            <p className="text-sm text-slate-500">Cross-region pathogen propagation monitoring.</p>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={regionalGrowth}>
              <defs>
                <linearGradient id="colorNorth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip />
              <Area type="monotone" dataKey="north" stroke="#10b981" fillOpacity={1} fill="url(#colorNorth)" strokeWidth={3} />
              <Area type="monotone" dataKey="south" stroke="#f59e0b" fill="transparent" strokeWidth={3} />
              <Area type="monotone" dataKey="east" stroke="#3b82f6" fill="transparent" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Disease Modal Simulation */}
      {isAddingDisease && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-emerald-600 text-white">
              <h3 className="text-xl font-bold">New Pathogen Definition</h3>
              <button onClick={() => setIsAddingDisease(false)} className="hover:rotate-90 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Pathogen Name</label>
                  <input type="text" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Rice Blast" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Scientific Name</label>
                  <input type="text" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="Magnaporthe oryzae" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Clinical Description</label>
                <textarea className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm h-24 focus:ring-2 focus:ring-emerald-500" placeholder="Identify leaf lesions..."></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Neural Label Mapping</label>
                <input type="number" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="Model Output Index (e.g. 7)" />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsAddingDisease(false)} className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={() => setIsAddingDisease(false)} className="flex-1 py-4 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">Inject to Database</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
