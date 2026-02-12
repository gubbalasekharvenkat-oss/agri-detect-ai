
import React from 'react';

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">AgriDetect<span className="text-emerald-600 italic">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-slate-600 font-medium hover:text-emerald-600 transition-colors">Sign In</button>
          <button onClick={onGetStarted} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Next-Gen Agricultural Intelligence
          </div>
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight">
            Protect Your Crops with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">AI Precision</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
            AgriDetect AI identifies crop diseases, analyzes soil health, and provides actionable treatment plans in seconds using production-grade computer vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onGetStarted} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/30 text-center">
              Start Free Diagnosis
            </button>
            <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-emerald-600 hover:text-emerald-600 transition-all text-center">
              Watch Demo
            </button>
          </div>
          <div className="flex items-center gap-8 pt-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">98%</p>
              <p className="text-sm text-slate-500">Accuracy Rate</p>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <p className="text-2xl font-bold text-slate-900">50k+</p>
              <p className="text-sm text-slate-500">Crops Analyzed</p>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <p className="text-2xl font-bold text-slate-900">24/7</p>
              <p className="text-sm text-slate-500">Field Support</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-100 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" 
            alt="Farming Innovation" 
            className="relative rounded-3xl shadow-2xl border-4 border-white"
          />
          <div className="absolute bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 animate-bounce-slow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Tomato Health: Excellent</p>
                <p className="text-xs text-slate-500">Detected 2 mins ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Enterprise Features for Modern Farmers</h2>
            <p className="text-slate-600">Our integrated platform combines computer vision with real-time sensor analytics to provide a 360° view of your farm's health.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Disease Detection", icon: "🔍", desc: "Identify over 50+ plant diseases instantly with 98% confidence." },
              { title: "Soil Analytics", icon: "🌱", desc: "Monitor NPK levels and moisture content through IoT integration." },
              { title: "Weather Logic", icon: "⛈️", desc: "Predict localized weather patterns to optimize irrigation schedules." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-emerald-500 transition-all hover:shadow-xl group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Landing;
