import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AgriDetectService } from '../services/geminiService';
import { VoiceService } from '../services/voiceService';
import { offlineStore, PendingDetection } from '../services/offlineStore';
import { DetectionResult } from '../types';

const DiseaseDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncs, setPendingSyncs] = useState<PendingDetection[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleConnectivity = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleConnectivity);
    window.addEventListener('offline', handleConnectivity);
    refreshPending();
    return () => {
      window.removeEventListener('online', handleConnectivity);
      window.removeEventListener('offline', handleConnectivity);
      VoiceService.getInstance().stop();
    };
  }, []);

  const refreshPending = async () => {
    const pending = await offlineStore.getAllPending();
    setPendingSyncs(pending);
  };

  useEffect(() => {
    if (selectedImage && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Location unavailable", err)
      );
    }
  }, [selectedImage, userLocation]);

  const validateAndProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file.");
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
      VoiceService.getInstance().stop();
    };
    reader.readAsDataURL(file);
  };

  // Fix: Added missing handleImageUpload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      VoiceService.getInstance().stop();
      setIsSpeaking(false);
    } else if (result) {
      const name = language === 'en' ? result.diseaseName : result.regionalName;
      const desc = language === 'en' ? result.description : result.regionalDescription;
      const treatment = language === 'en' 
        ? `Treatment: ${result.treatment.join(', ')}` 
        : `Tratamiento: ${result.regionalTreatment?.join(', ')}`;
      setIsSpeaking(true);
      VoiceService.getInstance().speak(`${name}. ${desc}. ${treatment}`, language, () => setIsSpeaking(false));
    }
  };

  const runDetection = async () => {
    if (!selectedImage) return;

    if (!isOnline) {
      // Handle Offline Queueing
      try {
        const id = Math.random().toString(36).substring(7);
        await offlineStore.addPending({
          id,
          image: selectedImage,
          timestamp: Date.now(),
          latitude: userLocation?.lat,
          longitude: userLocation?.lng
        });
        setError("Network offline. Diagnosis has been queued for sync.");
        setSelectedImage(null);
        refreshPending();
      } catch (err) {
        setError("Failed to queue detection offline.");
      }
      return;
    }

    setIsDetecting(true);
    setError(null);
    VoiceService.getInstance().stop();
    setIsSpeaking(false);
    
    try {
      const service = new AgriDetectService();
      const detectionResult = await service.detectDisease(selectedImage);
      if (detectionResult) {
        setResult({ ...detectionResult, latitude: userLocation?.lat, longitude: userLocation?.lng });
      } else {
        throw new Error("Diagnosis engine returned empty result.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsDetecting(false);
    }
  };

  const syncAllPending = async () => {
    if (!isOnline || pendingSyncs.length === 0) return;
    setIsDetecting(true);
    const service = new AgriDetectService();
    
    for (const pending of pendingSyncs) {
      try {
        const res = await service.detectDisease(pending.image);
        if (res) {
          // In a real app, we'd save this to a backend history. 
          // For now, we clear them and show the last one.
          setResult({ ...res, latitude: pending.latitude, longitude: pending.longitude });
          await offlineStore.removePending(pending.id);
        }
      } catch (e) {
        console.error("Failed to sync", pending.id);
      }
    }
    refreshPending();
    setIsDetecting(false);
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
          Production-grade neural analysis for crop pathogens. Resilient to field connectivity issues.
        </p>
      </div>

      {pendingSyncs.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 animate-slideUp">
          <div className="flex items-center gap-4 text-amber-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-xl">⏳</div>
            <div>
              <h4 className="font-bold">Pending Offline Reports</h4>
              <p className="text-sm opacity-80">{pendingSyncs.length} diagnostics waiting for network restoration.</p>
            </div>
          </div>
          <button 
            disabled={!isOnline || isDetecting}
            onClick={syncAllPending}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              isOnline ? 'bg-amber-500 text-white shadow-lg hover:bg-amber-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isDetecting ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-6">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if(file) validateAndProcessFile(file); }}
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
                <h4 className="text-xl font-bold text-slate-800">Field Diagnosis</h4>
                <p className="text-slate-400 mt-2 text-sm max-w-[200px] mx-auto">Upload or Capture Leaf Photo</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${language === 'en' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${language === 'es' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
              >
                ES
              </button>
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-widest ${isOnline ? 'text-emerald-500' : 'text-amber-500'}`}>
              {isOnline ? 'Network: Online' : 'Network: Offline'}
            </div>
          </div>

          <button
            onClick={runDetection}
            disabled={!selectedImage || isDetecting}
            className={`
              w-full py-5 rounded-2xl font-bold text-lg text-white transition-all transform active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
              ${!selectedImage || isDetecting ? 'bg-slate-300 shadow-none' : isOnline ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'}
            `}
          >
            {isDetecting ? "Processing..." : isOnline ? "Cloud Diagnosis" : "Analyze & Queue"}
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 h-full">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-8 lg:p-10 h-full flex flex-col relative overflow-hidden min-h-[500px]">
            {isDetecting && (
              <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-slate-600">Syncing with remote neural cores...</p>
              </div>
            )}

            {error && (
              <div className="bg-blue-50 border border-blue-100 text-blue-700 p-6 rounded-3xl flex items-start gap-4 mb-6">
                <div className="bg-blue-100 p-2 rounded-xl text-xl">ℹ️</div>
                <div>
                  <h4 className="font-bold">System Status</h4>
                  <p className="text-sm opacity-90 leading-relaxed mt-1">{error}</p>
                </div>
              </div>
            )}

            {result && !isDetecting && (
              <div className="space-y-8 animate-slideUp flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Validated Diagnostic</p>
                    <h3 className="text-3xl font-black text-slate-900 leading-none">
                      {language === 'en' ? result.diseaseName : result.regionalName}
                    </h3>
                  </div>
                  <button 
                    onClick={toggleVoice}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                      isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] relative">
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${severityStyles[result.severity]}`}>
                    {result.severity} Severity
                  </span>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Analysis Result</h4>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {language === 'en' ? result.description : result.regionalDescription}
                  </p>
                </div>

                <div className="flex-1 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Protocol Steps</h4>
                  <div className="grid gap-2">
                    {(language === 'en' ? result.treatment : result.regionalTreatment || []).map((step, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 text-sm text-slate-600">
                        <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">{i+1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Neural Confidence</p>
                    <p className="text-lg font-black text-slate-900">{(result.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                    Export Details
                  </button>
                </div>
              </div>
            )}

            {!result && !isDetecting && (
              <div className="flex flex-col items-center justify-center flex-1 text-slate-400 opacity-40">
                <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="font-bold text-center">Diagnostics Laboratory<br/><span className="text-xs font-normal">Upload crop sample to begin analysis.</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetector;