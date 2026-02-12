
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { AnalyticsData, MapPoint } from '../types';
import DiseaseMap from './DiseaseMap';

const data: AnalyticsData[] = [
  { time: '06:00', moisture: 45, temperature: 18, nitrogen: 80 },
  { time: '09:00', moisture: 42, temperature: 22, nitrogen: 75 },
  { time: '12:00', moisture: 38, temperature: 28, nitrogen: 70 },
  { time: '15:00', moisture: 35, temperature: 30, nitrogen: 68 },
  { time: '18:00', moisture: 40, temperature: 25, nitrogen: 72 },
  { time: '21:00', moisture: 44, temperature: 20, nitrogen: 78 },
];

const mapPoints: MapPoint[] = [
  { id: '1', lat: 38.3000, lng: -122.2900, disease: 'Tomato Blight', severity: 'high', date: '2024-03-24' },
  { id: '2', lat: 38.3050, lng: -122.2850, disease: 'Potato Blight', severity: 'medium', date: '2024-03-23' },
  { id: '3', lat: 38.2950, lng: -122.3000, disease: 'Healthy Corn', severity: 'low', date: '2024-03-22' },
  { id: '4', lat: 38.2900, lng: -122.2800, disease: 'Apple Scab', severity: 'high', date: '2024-03-21' },
  { id: '5', lat: 38.3100, lng: -122.3100, disease: 'Grape Black Rot', severity: 'medium', date: '2024-03-24' },
];

const StatCard = ({ label, value, unit, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-500 text-sm font-medium">{label}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      <span className="text-slate-400 text-sm">{unit}</span>
    </div>
    <div className={`h-1 w-full bg-slate-100 rounded-full mt-4 overflow-hidden`}>
      <div className={`h-full ${color} rounded-full`} style={{ width: '70%' }}></div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Farm Overview</h2>
          <p className="text-slate-500">Real-time spatio-temporal analytics</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Dataset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Soil Moisture" value="42" unit="%" trend={-5} color="bg-blue-500" />
        <StatCard label="Temperature" value="24" unit="°C" trend={2} color="bg-orange-500" />
        <StatCard label="Nitrogen Level" value="78" unit="mg/kg" trend={12} color="bg-emerald-500" />
        <StatCard label="Healthy Crops" value="94" unit="%" trend={1.5} color="bg-purple-500" />
      </div>

      {/* Disease Heatmap Section */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden p-1">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Pathogen Spread Analysis</h3>
            <p className="text-slate-500 text-sm">Real-time geographic distribution of detected crop diseases.</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider">Live Map</div>
          </div>
        </div>
        <div className="h-[500px] w-full">
          <DiseaseMap points={mapPoints} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Moisture & Temperature Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="moisture" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMoisture)" strokeWidth={2} />
                <Area type="monotone" dataKey="temperature" stroke="#f97316" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Nutrient Composition</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend />
                <Bar dataKey="nitrogen" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
