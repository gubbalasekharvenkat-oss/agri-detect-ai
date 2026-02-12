
import React from 'react';

const detections = [
  { id: 1, crop: "Tomato", disease: "Late Blight", date: "2024-03-24", severity: "high", confidence: 98.4 },
  { id: 2, crop: "Potato", disease: "Early Blight", date: "2024-03-22", severity: "medium", confidence: 92.1 },
  { id: 3, crop: "Corn", disease: "Common Rust", date: "2024-03-20", severity: "medium", confidence: 89.7 },
  { id: 4, crop: "Apple", disease: "Healthy", date: "2024-03-18", severity: "low", confidence: 99.9 },
  { id: 5, crop: "Wheat", disease: "Leaf Rust", date: "2024-03-15", severity: "high", confidence: 94.5 },
];

const History: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Detection History</h2>
          <p className="text-slate-500">Track and review your past crop analysis reports.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Filter</button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Export PDF</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Crop Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Detected Disease</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Confidence</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Severity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {detections.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-lg">🌱</div>
                      <span className="font-medium text-slate-900">{item.crop}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.disease}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{item.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${item.confidence}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500">{item.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.severity === 'high' ? 'bg-red-100 text-red-600' :
                      item.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-emerald-600 font-bold text-sm hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
