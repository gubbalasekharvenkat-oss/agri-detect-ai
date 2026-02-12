
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPoint } from '../types';

// Fix for default Leaflet icon issues in React
const getIcon = (severity: 'low' | 'medium' | 'high') => {
  const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#10b981';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px ${color}88;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

interface DiseaseMapProps {
  points: MapPoint[];
}

const DiseaseMap: React.FC<DiseaseMapProps> = ({ points }) => {
  // Center map on average of points or default to a farm region
  const defaultCenter: [number, number] = [38.2975, -122.2869]; // Napa Valley

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => (
          <Marker 
            key={point.id} 
            position={[point.lat, point.lng]} 
            icon={getIcon(point.severity)}
          >
            <Popup>
              <div className="p-2 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Outbreak Found</p>
                <h4 className="font-bold text-slate-900">{point.disease}</h4>
                <div className="flex items-center gap-2">
                   <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                    point.severity === 'high' ? 'bg-red-100 text-red-600' :
                    point.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {point.severity}
                  </span>
                  <span className="text-[10px] text-slate-400">{point.date}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl pointer-events-none">
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Severity Legend</h5>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs font-medium text-slate-600">Critical Outbreak</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs font-medium text-slate-600">Warning Zone</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-medium text-slate-600">Healthy / Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseMap;
