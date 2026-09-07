import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles, 
  X,
  MessageCircle,
  Video,
  Shield,
  Bluetooth,
  LayoutDashboard,
  Trophy,
  Flame,
  Star,
  Zap,
  Medal,
  Users2,
  Tag,
  Percent,
  CreditCard,
  Target as TargetIcon
} from 'lucide-react';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function App() {
  const [timeView, setTimeView] = useState('CUSTOM'); // 'WEEK' or 'CUSTOM'
  const [storeFilter, setStoreFilter] = useState('ทุกสาขา');
  const [isSpacePodOpen, setIsSpacePodOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'sm' or 'profile'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [targetRank, setTargetRank] = useState(null);
  
  // SM Modal Form state
  const [recordMonth, setRecordMonth] = useState('September');
  const [recordYear, setRecordYear] = useState('2026');
  const [smCode, setSmCode] = useState('');
  const [smError, setSmError] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const branches = [
    { id: 10, name: "CENTRAL RAMA 2", value: "2,547,387" },
    { id: 11, name: "CENTRAL PINKLAO", value: "2,524,558" },
    { id: 12, name: "CENTRAL EASTVILLE", value: "1,909,698" },
    { id: 13, name: "THE MALL BANGKAE", value: "1,851,585" },
    { id: 14, name: "THE MALL NGAMWONGWAN", value: "1,529,475" },
    { id: 1, name: "ICON SIAM", value: "11,002,874", isTop: true }
  ];

  const podiumData = {
    rank1: { name: "PALANUPAP", sale: "327,359 ฿", bills: "83 BILLS", mix: "12%" },
    rank2: { name: "THANAYUT", sale: "275,234 ฿", bills: "75 BILLS", mix: "10%" },
    rank3: { name: "ANOCHAA", sale: "213,517 ฿", bills: "60 BILLS", mix: "8%" },
  };

  const runnerList = [
    { rank: 4, name: "SIRIPORN", val: "191,435", pct: "60%", bills: "55", mix: "9%" },
    { rank: 5, name: "SUPHAWAT", val: "153,722", pct: "50%", bills: "48", mix: "7%" },
    { rank: 6, name: "NAPASON", val: "153,627", pct: "50%", bills: "45", mix: "7%" },
    { rank: 7, name: "BENCHAMAPORN", val: "146,556", pct: "45%", bills: "42", mix: "6%" },
    { rank: 8, name: "SUJITRA", val: "105,833", pct: "35%", bills: "30", mix: "5%" },
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenSMModal = (rank, name) => {
    setTargetRank(rank);
    setSelectedStaff(name);
    setSmCode('');
    setSmError(false);
    setActiveModal('sm');
  };

  const handleOpenProfileModal = (name, rank) => {
    setSelectedStaff({ name, rank });
    setActiveModal('profile');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedStaff(null);
  };

  const handleSubmitSMCode = () => {
    if (smCode === '1234') {
      handleCloseModal();
      showToast(`SUCCESS! ADDED TO ${targetRank === 1 ? 'WINNER SPACE' : 'RISING STAR'} (${recordMonth} ${recordYear}).`);
    } else {
      setSmError(true);
    }
  };

  const radarData = {
    labels: ['MOTIVATION', 'COMMUNICATION', 'OBSESSION', 'TEAMWORK', 'SERVICE', 'KNOWLEDGE'],
    datasets: [
      {
        label: 'Performance Stats',
        data: [88, 92, 85, 78, 90, 82],
        backgroundColor: 'rgba(212, 255, 0, 0.2)',
        borderColor: '#d4ff00',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#d4ff00',
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { 
          color: '#a1a1aa', 
          font: { size: 9, family: 'Orbitron', weight: 'bold' } 
        },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-slate-800 selection:bg-[#d4ff00] selection:text-black pb-20 relative overflow-x-hidden font-sans">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-space font-bold shadow-2xl z-[200] transition-opacity text-sm text-center">
          {toastMessage}
        </div>
      )}

      {/* Top Navigation Bar */}
      <nav className="px-6 py-4 flex items-center justify-between gap-8 border-b border-gray-200/50 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <Sparkles className="text-zinc-900" size={24} />
          <span className="font-space tracking-widest text-lg">SpaceLANG</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold">
          <div className="flex flex-col cursor-pointer group">
            <span className="text-zinc-900 group-hover:text-zinc-600 transition-colors uppercase tracking-wider">Your Build</span>
            <span className="text-xs text-zinc-500 font-normal">Create your space</span>
            <div className="h-0.5 bg-[#d4ff00] w-1/2 mt-1 rounded-full"></div>
          </div>
          <div className="flex flex-col cursor-pointer group opacity-50">
            <span className="text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              Your Move <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">SOON</span>
            </span>
            <span className="text-xs text-zinc-400 font-normal">Soon</span>
          </div>
          <div className="flex flex-col cursor-pointer group">
            <span className="text-zinc-900 uppercase tracking-wider">Your Source</span>
            <span className="text-xs text-zinc-500 font-normal">Mapping & Accounts</span>
          </div>
        </div>
      </nav>

      {/* Marquee Ticker */}
      <div className="bg-[#18181b] text-white py-2.5 overflow-hidden whitespace-nowrap shadow-md relative z-40 flex items-center border-b border-zinc-800">
        <div className="animate-[slide_30s_linear_infinite] flex gap-8 px-4 items-center w-max">
          {[...branches, ...branches].map((branch, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              {branch.isTop ? (
                <span className="bg-[#d4ff00] text-black w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shadow-[0_0_8px_rgba(212,255,0,0.6)]">🥇</span>
              ) : (
                <span className="bg-zinc-700 text-zinc-300 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">{branch.id}</span>
              )}
              <span className="font-space font-bold tracking-wide">{branch.name}</span>
              <span className="text-zinc-400 font-mono text-xs">฿{branch.value}</span>
              <span className="text-zinc-700 ml-4">—</span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-6 space-y-6">
        
        {}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-2 pr-3 shadow-sm border border-slate-200/80 flex flex-row items-center justify-between gap-3 overflow-x-auto scrollbar-hide">
          
          {/* User Profile Snippet */}
          <div className="flex items-center gap-3 pl-2 shrink-0 pr-4 border-r border-slate-200/60">
            <div className="w-10 h-10 rounded-full bg-zinc-900 text-[#d4ff00] flex items-center justify-center font-black text-lg border-[2px] border-[#d4ff00] shadow-sm">L</div>
            <div className="flex flex-col justify-center">
              <h1 className="text-[13px] font-black text-zinc-900 uppercase tracking-tight leading-none mb-1">The Space Of "LANG"</h1>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">ID: 99420</span>
                <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded">Mix 12%</span>
                <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-100">
                  <Star size={10} className="fill-current" /> Level 5
                </span>
              </div>
            </div>
          </div>

          {/* Filters & Segmented Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-[#f4f7f9] rounded-full px-3 py-1.5 cursor-pointer hover:bg-slate-200 border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Store</span>
              <span className="font-semibold text-xs text-slate-800">{storeFilter}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

            <div className="flex bg-zinc-900 p-0.5 rounded-full items-center shadow-inner">
              <button 
                onClick={() => setTimeView('WEEK')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${timeView === 'WEEK' ? 'bg-[#d4ff00] text-black shadow-sm' : 'bg-transparent text-zinc-400 hover:text-white'}`}
              >
                WEEK
              </button>
              <button 
                onClick={() => setTimeView('CUSTOM')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${timeView === 'CUSTOM' ? 'bg-[#d4ff00] text-black shadow-sm' : 'bg-transparent text-zinc-400 hover:text-white'}`}
              >
                CUSTOM
              </button>
            </div>

            <div className="flex items-center bg-[#f4f7f9] border border-slate-200/50 rounded-full px-3 py-1.5">
              <CalendarIcon size={12} className="text-slate-400 mr-1.5" />
              <span className="text-[11px] font-semibold text-slate-700">01/08 - 10/08/2026</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-200/60 ml-auto">
            <button 
              onClick={() => setIsSpacePodOpen(true)}
              className="bg-zinc-900 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md group"
            >
              <Plus size={14} className="text-[#d4ff00] group-hover:rotate-90 transition-transform" />
              SPACE POD
            </button>
            <button className="bg-slate-50 text-slate-400 px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-slate-200">
              <LayoutDashboard size={12} />
              Meteorology
            </button>
            <button 
              onClick={() => setIsSpacePodOpen(false)}
              className="bg-red-50 hover:bg-red-100 text-red-500 px-2 py-1.5 rounded-full flex items-center justify-center border border-red-100 ml-1 transition-colors"
              title="Close Space Pod"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {}
        {isSpacePodOpen ? (
          <div className="bg-[#101012] rounded-[2.5rem] p-6 md:p-8 min-h-[600px] shadow-2xl border border-zinc-800 relative transition-all duration-500 ease-in-out">
            
            {/* Close Pod Button */}
            <button 
              onClick={() => setIsSpacePodOpen(false)} 
              className="absolute top-6 right-6 w-8 h-8 bg-zinc-900 border border-zinc-700 hover:bg-red-500 hover:border-red-500 text-zinc-400 hover:text-white rounded-full flex items-center justify-center transition-all z-20 group shadow-lg" 
              title="Remove Space POD"
            >
              <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pr-10">
              <h2 className="text-2xl md:text-3xl font-space font-black text-white uppercase tracking-wider flex items-center gap-3">
                <Star className="text-yellow-400 fill-current" size={28} />
                STAFF REWARD <span className="text-zinc-500 font-light">&</span> <span className="text-yellow-400">ACHIEVEMENT</span>
              </h2>
            </div>

            {/* Big Action Buttons */}
            <div className="flex flex-col gap-3 mb-10 border-b border-zinc-800 pb-8 max-w-lg">
              <button className="w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-black rounded-2xl py-3 px-5 flex items-center justify-center gap-3 shadow-lg transform transition-transform hover:scale-[1.01]">
                <Medal size={22} className="text-slate-800" />
                <span className="font-space font-black text-base tracking-wider">WINNER SPACE (🚀)</span>
              </button>
              <button className="w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black rounded-2xl py-3 px-5 flex items-center justify-center gap-3 shadow-lg transform transition-transform hover:scale-[1.01]">
                <Trophy size={22} className="text-yellow-950" />
                <span className="font-space font-black text-base tracking-wider">RISING STAR LIST (⭐)</span>
              </button>
            </div>

            {}
            <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-10 mb-16 pt-12">
              
              {/* Rank 2 */}
              <div className="flex flex-col items-center w-full md:w-56 relative group">
                <div className="flex items-center gap-2 mb-2 z-30">
                  <button 
                    onClick={() => handleOpenSMModal(2, 'THANAYUT')} 
                    className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-600 text-white hover:bg-slate-300 hover:text-black flex items-center justify-center font-bold text-sm shadow-lg transition-transform hover:scale-110" 
                    title="Add to Rising Star"
                  >+</button>
                  <button 
                    onClick={() => handleOpenProfileModal('THANAYUT', 2)} 
                    className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-300 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110" 
                    title="View Profile"
                  >
                    <Users2 size={12} />
                  </button>
                </div>

                <div className="text-slate-300 font-space text-[10px] font-bold tracking-widest mb-0.5">🥈 RANK 02</div>
                <div className="text-white font-space font-black text-base uppercase tracking-wider mb-3 text-center drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] podium-hover-trigger cursor-pointer">THANAYUT</div>

                <div className="w-full h-48 bg-gradient-to-t from-slate-600 via-slate-400 to-slate-300 rounded-t-2xl shadow-[0_-5px_30px_rgba(148,163,184,0.3)] border-t-[3px] border-white/80 p-4 flex flex-col justify-start items-center text-slate-900 z-10 group/podium">
                  <div className="font-space font-black text-sm text-slate-950 tracking-wider mb-2">275,234 ฿</div>
                  <div className="w-full flex flex-col items-center gap-1.5 pt-2 border-t border-slate-700/30 max-h-0 opacity-0 overflow-hidden group-hover/podium:max-h-[140px] group-hover/podium:opacity-100 transition-all duration-400">
                    <div className="text-[10px] font-space font-bold text-slate-900 bg-white/60 px-2 py-0.5 rounded-full w-full text-center shadow-inner">75 BILLS</div>
                    <div className="text-sm font-space font-black text-slate-950 bg-white/90 px-3 py-1.5 rounded-xl w-full text-center shadow-md tracking-wider border border-slate-300">MIX: 10%</div>
                  </div>
                </div>
              </div>

              {/* Rank 1 (MVP) */}
              <div className="flex flex-col items-center w-full md:w-64 relative group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-400/20 blur-3xl rounded-full pointer-events-none z-0"></div>
                
                <div className="flex items-center gap-2 mb-2 z-30">
                  <button 
                    onClick={() => handleOpenSMModal(1, 'PALANUPAP')} 
                    className="w-8 h-8 rounded-full bg-[#d4ff00] text-black hover:bg-white flex items-center justify-center font-black text-base shadow-[0_0_20px_rgba(212,255,0,0.8)] transition-transform hover:scale-110" 
                    title="Add to Winner Space"
                  >+</button>
                  <button 
                    onClick={() => handleOpenProfileModal('PALANUPAP', 1)} 
                    className="w-8 h-8 rounded-full bg-zinc-800 border border-[#d4ff00] text-[#d4ff00] hover:bg-[#d4ff00] hover:text-black flex items-center justify-center shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-transform hover:scale-110" 
                    title="View Profile"
                  >
                    <Users2 size={14} />
                  </button>
                </div>
                
                <div className="text-yellow-400 font-space text-[10px] font-black tracking-widest mb-0.5 flex items-center gap-1 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">🥇 RANK 01 • MVP</div>
                <div className="text-white font-space font-black text-lg uppercase tracking-widest mb-3 text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] podium-hover-trigger cursor-pointer">PALANUPAP</div>

                <div className="w-full h-60 bg-gradient-to-t from-yellow-700 via-yellow-400 to-yellow-200 rounded-t-2xl shadow-[0_-10px_40px_rgba(250,204,21,0.5)] border-t-[4px] border-white p-4 flex flex-col justify-start items-center text-yellow-950 z-10 group/podium">
                  <div className="font-space font-black text-base text-black tracking-wider mb-2">327,359 ฿</div>
                  <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-yellow-800/40 max-h-0 opacity-0 overflow-hidden group-hover/podium:max-h-[140px] group-hover/podium:opacity-100 transition-all duration-400">
                    <div className="text-[11px] font-space font-bold text-yellow-950 bg-white/70 px-3 py-0.5 rounded-full w-full text-center shadow-inner">83 BILLS</div>
                    <div className="text-sm font-space font-black text-black bg-white/95 px-3 py-1.5 rounded-xl w-full text-center shadow-md tracking-wider border border-yellow-300">MIX: 12%</div>
                  </div>
                </div>
              </div>

              {/* Rank 3 */}
              <div className="flex flex-col items-center w-full md:w-56 relative group">
                <div className="flex items-center gap-2 mb-2 z-30">
                  <button 
                    onClick={() => handleOpenSMModal(3, 'ANOCHAA')} 
                    className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-600 text-white hover:bg-amber-500 hover:text-black flex items-center justify-center font-bold text-sm shadow-lg transition-transform hover:scale-110" 
                    title="Add to Rising Star"
                  >+</button>
                  <button 
                    onClick={() => handleOpenProfileModal('ANOCHAA', 3)} 
                    className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-300 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110" 
                    title="View Profile"
                  >
                    <Users2 size={12} />
                  </button>
                </div>

                <div className="text-amber-500 font-space text-[10px] font-bold tracking-widest mb-0.5">🥉 RANK 03</div>
                <div className="text-white font-space font-black text-base uppercase tracking-wider mb-3 text-center drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] podium-hover-trigger cursor-pointer">ANOCHAA</div>

                <div className="w-full h-40 bg-gradient-to-t from-amber-900 via-amber-600 to-amber-500 rounded-t-2xl shadow-[0_-5px_25px_rgba(180,83,9,0.3)] border-t-[3px] border-white/60 p-4 flex flex-col justify-start items-center text-white z-10 group/podium">
                  <div className="font-space font-black text-sm text-white tracking-wider mb-2">213,517 ฿</div>
                  <div className="w-full flex flex-col items-center gap-1.5 pt-2 border-t border-amber-500/40 max-h-0 opacity-0 overflow-hidden group-hover/podium:max-h-[140px] group-hover/podium:opacity-100 transition-all duration-400">
                    <div className="text-[10px] font-space font-bold text-amber-100 bg-black/40 px-2 py-0.5 rounded-full w-full text-center shadow-inner">60 BILLS</div>
                    <div className="text-sm font-space font-black text-amber-200 bg-black/60 px-3 py-1.5 rounded-xl w-full text-center shadow-md tracking-wider border border-amber-400/50">MIX: 8%</div>
                  </div>
                </div>
              </div>

            </div>

            {}
            <div className="space-y-4 max-w-4xl mx-auto">
              {runnerList.map((p, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-zinc-900/40 p-2.5 rounded-xl hover:bg-zinc-800/60 transition-colors border border-transparent hover:border-zinc-700">
                  <div className="w-8 text-center text-zinc-500 font-space font-bold">{p.rank}.</div>
                  <div className="w-32 text-white font-space font-bold text-sm uppercase truncate">{p.name}</div>
                  <div className="flex-1 relative h-6 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-end pr-2" style={{ width: p.pct }}>
                      <span className="text-[12px]">🏃</span>
                    </div>
                  </div>
                  <div className="w-28 text-right text-yellow-400 font-space font-mono font-bold text-sm">{p.val} ฿</div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenProfileModal(p.name, p.rank)} 
                      className="text-zinc-500 hover:text-white p-1 transition-colors" 
                      title="Profile"
                    >
                      <Users2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#1f2123] rounded-[2.5rem] p-10 min-h-[400px] flex flex-col items-center justify-center text-center shadow-xl border border-zinc-700/50 relative overflow-hidden">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-zinc-700">
              <Sparkles size={32} className="text-[#d4ff00]" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">SPACE POD CLOSED</h2>
            <p className="text-zinc-400 max-w-sm mb-6 text-xs leading-relaxed">
              Click the "+ SPACE POD" button on the navigation bar to re-open the Leaderboard module.
            </p>
            <button 
              onClick={() => setIsSpacePodOpen(true)}
              className="bg-[#d4ff00] hover:bg-yellow-400 text-black px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <Plus size={16} /> OPEN SPACE POD
            </button>
          </div>
        )}
      </div>

      {}
      {activeModal === 'sm' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center px-4">
          <div className="bg-[#18181b] border border-zinc-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border-4 ${targetRank === 1 ? 'border-slate-300 bg-slate-100 text-slate-800 shadow-[0_0_20px_rgba(203,213,225,0.4)]' : 'border-yellow-500 bg-yellow-400 text-yellow-900 shadow-[0_0_20px_rgba(250,204,21,0.4)]'}`}>
                {targetRank === 1 ? <Medal size={32} /> : <Trophy size={32} />}
              </div>
              <h3 className="font-space text-lg font-black text-white uppercase tracking-wider mb-1">
                {targetRank === 1 ? 'ADD TO WINNER SPACE' : 'ADD TO RISING STAR'}
              </h3>
              <p className="text-zinc-400 text-xs">Add <span className="font-bold text-white">{selectedStaff}</span> to the list</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-space font-bold text-zinc-400 mb-1">RECORD MONTH</label>
                  <select 
                    value={recordMonth} 
                    onChange={(e) => setRecordMonth(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-space"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-space font-bold text-zinc-400 mb-1">YEAR</label>
                  <select 
                    value={recordYear} 
                    onChange={(e) => setRecordYear(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-space"
                  >
                    {['2026', '2027', '2025'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold text-zinc-400 mb-1">SM CODE (MANAGER PIN)</label>
                <input 
                  type="password" 
                  value={smCode} 
                  onChange={(e) => setSmCode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-space" 
                  placeholder="••••" 
                />
              </div>
              <button 
                onClick={handleSubmitSMCode}
                className="w-full bg-[#d4ff00] hover:bg-yellow-400 text-black font-space font-black uppercase text-xs tracking-wider py-3 rounded-xl transition-colors shadow-lg"
              >
                CONFIRM & SAVE TO SPACE
              </button>
              {smError && <p className="text-red-500 text-xs text-center font-space">Invalid SM Code. Use (1234).</p>}
            </div>
          </div>
        </div>
      )}

      {}
      {activeModal === 'profile' && selectedStaff && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center px-4">
          <div className="bg-[#18181b] border border-zinc-700 rounded-3xl p-8 w-full max-w-3xl shadow-2xl relative flex flex-col md:flex-row gap-8">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X size={24} />
            </button>
            
            <div className="flex-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 pb-8 md:pb-0 md:pr-8 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border-2 border-yellow-400 mb-4 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                <Users2 size={40} className="text-yellow-400" />
              </div>
              <div className="text-yellow-400 font-space font-bold text-sm mb-1 uppercase tracking-widest">
                {selectedStaff.rank === 1 ? '🥇 RANK 01 - MVP' : `RANK ${selectedStaff.rank}`}
              </div>
              <h2 className="text-3xl font-space font-black text-white uppercase tracking-tight mb-4">{selectedStaff.name}</h2>
              
              <div className="w-full bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-3 text-left">
                <div className="flex justify-between items-center text-sm font-space">
                  <span className="text-zinc-500 font-semibold">TOTAL SALE</span>
                  <span className="text-white font-mono font-bold">{(100000 + (selectedStaff.name.length * 15000)).toLocaleString()} ฿</span>
                </div>
                <div className="flex justify-between items-center text-sm font-space">
                  <span className="text-zinc-500 font-semibold">TOTAL BILLS</span>
                  <span className="text-white font-mono font-bold">83</span>
                </div>
                <div className="flex justify-between items-center text-sm font-space">
                  <span className="text-zinc-500 font-semibold">SUCCESS MIX</span>
                  <span className="text-[#d4ff00] font-mono font-bold bg-[#d4ff00]/10 px-2 py-0.5 rounded">12%</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <h3 className="text-white font-space font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <TargetIcon size={16} className="text-yellow-400" />
                PERFORMANCE RADAR
              </h3>
              <div className="w-full max-w-[300px] aspect-square relative">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-100 flex flex-wrap max-w-[120px] gap-3 justify-center z-50">
        <button className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors"><MessageCircle size={16} /></button>
        <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"><Video size={16} /></button>
        <button className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 transition-colors"><Shield size={16} /></button>
        <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><Bluetooth size={16} /></button>
      </div>

    </div>
  );
}
