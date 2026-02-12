
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AgriDetectService } from '../services/geminiService';
import { DetectionResult } from '../types';

const DiseaseDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Request location when component mounts or image is selected
  useEffect(() => {
    if (selectedImage && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          console.warn("Location access denied or unavailable", err);
        }
      );
    }
  }, [selectedImage, userLocation]);

  const validateAndProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file (JPG, PNG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  }, []);

  const runDetection = async () => {
    if (!selectedImage) return;

    setIsDetecting(true);
    setError(null);
    try {
      const service = new AgriDetectService();
      const detectionResult = await service.detectDisease(selectedImage);
      if (detectionResult) {
        // Append geographic data to the result
        setResult({
          ...detectionResult,
          latitude: userLocation?.lat,
          longitude: userLocation?.lng
        });
      } else {
        throw new Error("The AI model was unable to generate a diagnosis. Please try a clearer photo.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsDetecting(false);
    }
  };

  const severityStyles = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Crop Diagnostic Lab</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Our advanced CNN model analyzes leaf patterns to identify diseases and provide immediate treatment protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative aspect-[4/5] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300
              ${selectedImage ? 'border-emerald-500 bg-white ring-4 ring-emerald-50' : 'bg-slate-50'}
              ${isDragging ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-slate-300 hover:border-emerald-400'}
            `}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Plant Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-6">
                   <button 
                    onClick={() => { setSelectedImage(null); setResult(null); }}
                    className="w-full bg-white/20 backdrop-blur-md text-white py-3 rounded-xl font-bold border border-white/30 hover:bg-white/40 transition-colors"
                  >
                    Replace Image
                  </button>
                </div>
                <button 
                  onClick={() => { setSelectedImage(null); setResult(null); }}
                  className="absolute top-4 right-4 bg-white shadow-xl p-2 rounded-full hover:bg-slate-100 transition-transform active:scale-90"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <div 
                className="p-10 text-center cursor-pointer group w-full h-full flex flex-col items-center justify-center" 
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-white shadow-xl text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-800">Drop leaf photo here</h4>
                <p className="text-slate-400 mt-2 text-sm max-w-[200px] mx-auto">Or click to browse your local farm database</p>
                <div className="mt-8 px-4 py-2 bg-slate-200/50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  JPG, PNG • MAX 10MB
                </div>
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

          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${userLocation ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Geo-Tag Status</p>
              <p className="text-sm font-bold text-slate-900">
                {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Requesting Coordinates...'}
              </p>
            </div>
          </div>

          <button
            onClick={runDetection}
            disabled={!selectedImage || isDetecting}
            className={`
              w-full py-5 rounded-2xl font-bold text-lg text-white transition-all transform active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
              ${!selectedImage || isDetecting ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'}
            `}
          >
            {isDetecting ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing Neural Engine...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0a11.959 11.959 0 01-1.127 5.733 11.959 11.959 0 01-3.33 4.192 11.959 11.959 0 01-4.192 3.33 11.959 11.959 0 01-5.733 1.127 11.959 11.959 0 01-5.733-1.127 11.959 11.959 0 01-4.192-3.33 11.959 11.959 0 01-3.33-4.192 11.959 11.959 0 01-1.127-5.733 11.955 11.955 0 018.618-3.04c2.628 0 5.087.844 7.088 2.28" />
                </svg>
                Launch Analysis
              </>
            )}
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 h-full">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-8 lg:p-10 h-full flex flex-col relative overflow-hidden">
            {isDetecting && (
              <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm p-10 space-y-8 animate-pulse">
                <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
                <div className="h-32 bg-slate-100 rounded-3xl"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                </div>
                <div className="h-40 bg-slate-100 rounded-3xl"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-3xl flex items-start gap-4 animate-shake">
                <div className="bg-red-100 p-2 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Analysis Interrupted</h4>
                  <p className="text-sm opacity-90 leading-relaxed mt-1">{error}</p>
                  <button onClick={() => setError(null)} className="mt-4 text-sm font-bold underline hover:no-underline">Dismiss and try again</button>
                </div>
              </div>
            )}

            {!result && !isDetecting && !error && (
              <div className="flex flex-col items-center justify-center flex-1 text-slate-400 py-20">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-400">Lab Reports Empty</h3>
                <p className="text-center mt-2 max-w-[280px]">Upload a crop sample to populate neural analysis and treatment data.</p>
              </div>
            )}

            {result && !isDetecting && (
              <div className="space-y-8 animate-slideUp flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Detected Pathogen</p>
                    <h3 className="text-3xl font-black text-slate-900 leading-none">{result.diseaseName}</h3>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl border text-sm font-black uppercase tracking-wider ${severityStyles[result.severity]}`}>
                    {result.severity} Severity
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-900">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Clinical Summary</h4>
                  <p className="text-slate-700 leading-relaxed relative z-10">{result.description}</p>
                  {result.latitude && (
                    <p className="text-[10px] mt-4 font-mono text-emerald-600 bg-white inline-block px-2 py-1 rounded-md border border-emerald-100">
                      GEO-TAG: {result.latitude.toFixed(6)}, {result.longitude?.toFixed(6)}
                    </p>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-slate-100 flex-1"></div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Treatment Protocol</h4>
                    <div className="h-px bg-slate-100 flex-1"></div>
                  </div>
                  
                  <div className="grid gap-3">
                    {result.treatment.map((step, i) => (
                      <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          {i + 1}
                        </div>
                        <p className="text-sm text-slate-600 font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-auto border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0a11.959 11.959 0 01-1.127 5.733 11.959 11.959 0 01-3.33 4.192 11.959 11.959 0 01-4.192 3.33 11.959 11.959 0 01-5.733 1.127 11.959 11.959 0 01-5.733-1.127 11.959 11.959 0 01-4.192-3.33 11.959 11.959 0 01-3.33-4.192 11.959 11.959 0 01-1.127-5.733 11.955 11.955 0 018.618-3.04c2.628 0 5.087.844 7.088 2.28" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">AI Confidence</p>
                      <p className="text-lg font-black text-slate-900">{(result.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Share</button>
                    <button className="flex-1 sm:flex-none px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">Archive Report</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetector;
