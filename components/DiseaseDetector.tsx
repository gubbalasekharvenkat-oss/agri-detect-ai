
import React, { useState, useRef } from 'react';
import { AgriDetectService } from '../services/geminiService';
import { DetectionResult } from '../types';

const DiseaseDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runDetection = async () => {
    if (!selectedImage) return;

    setIsDetecting(true);
    setError(null);
    try {
      const service = new AgriDetectService();
      const detectionResult = await service.detectDisease(selectedImage);
      if (detectionResult) {
        setResult(detectionResult);
      } else {
        throw new Error("No analysis received from AI engine.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze image.");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">AI Plant Diagnosis</h2>
        <p className="text-slate-500 mt-2">Upload a photo of your crop to detect diseases instantly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div 
            className={`
              relative aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all
              ${selectedImage ? 'border-emerald-500 bg-white' : 'border-slate-300 bg-slate-100 hover:border-emerald-400'}
            `}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Plant Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="p-8 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-700">Click or drag image to upload</p>
                <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG (Max 10MB)</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <button
            onClick={runDetection}
            disabled={!selectedImage || isDetecting}
            className={`
              w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-95
              ${!selectedImage || isDetecting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20'}
            `}
          >
            {isDetecting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI Processing...
              </span>
            ) : 'Analyze Plant Health'}
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 min-h-[400px]">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {!result && !isDetecting && !error && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0a11.959 11.959 0 01-1.127 5.733 11.959 11.959 0 01-3.33 4.192 11.959 11.959 0 01-4.192 3.33 11.959 11.959 0 01-5.733 1.127 11.959 11.959 0 01-5.733-1.127 11.959 11.959 0 01-4.192-3.33 11.959 11.959 0 01-3.33-4.192 11.959 11.959 0 01-1.127-5.733 11.955 11.955 0 018.618-3.04c2.628 0 5.087.844 7.088 2.28" />
              </svg>
              AI results will appear here after analysis
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-slideUp">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{result.diseaseName}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  result.severity === 'high' ? 'bg-red-100 text-red-700' :
                  result.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {result.severity} Risk
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-sm text-slate-600 leading-relaxed">{result.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recommended Treatment
                </h4>
                <ul className="space-y-2">
                  {result.treatment.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">AI Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                <button className="text-emerald-600 hover:text-emerald-700 text-xs font-bold uppercase tracking-wider">Save Report</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetector;
