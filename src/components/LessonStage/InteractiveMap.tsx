import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonData, MapRegionLayer } from '../../types';
import {
  Map,
  Compass,
  Layers,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Shield,
  FileCheck,
} from 'lucide-react';

interface InteractiveMapProps {
  lesson: LessonData;
  onSelectConceptForAI: (concept: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  lesson,
  onSelectConceptForAI,
}) => {
  const mapData = lesson.mapData;
  const [selectedRegion, setSelectedRegion] = useState<MapRegionLayer | null>(
    mapData.regions[0] || null
  );
  const [activeFilters, setActiveFilters] = useState<string[]>(
    mapData.regions.map((r) => r.id)
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredRegion, setHoveredRegion] = useState<MapRegionLayer | null>(null);

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.8, Math.max(0.8, prev + delta)));
  };

  const isAlgerianRevolution = lesson.id === 'lesson-algerian-revolution';
  const isColdWar = lesson.id === 'lesson-cold-war';
  const isUsa = lesson.id === 'lesson-usa-power';

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Map Control & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#59dad1]/25 bg-[#09101d] p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#59dad1]/20 text-[#59dad1] border border-[#59dad1]/30">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#59dad1]/15 text-[#59dad1] border border-[#59dad1]/30 font-mono">
                BAC Official Atlas
              </span>
            </div>
            <h3 className="text-base font-extrabold text-stone-100">{mapData.mapTitle}</h3>
            <p className="text-xs text-stone-400 max-w-xl">{mapData.mapDescription}</p>
          </div>
        </div>

        {/* Territory Layer Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold text-stone-400">
            <Layers className="h-3.5 w-3.5 text-[#59dad1]" />
            الطبقات:
          </span>
          {mapData.regions.map((region) => {
            const isActive = activeFilters.includes(region.id);
            return (
              <button
                key={region.id}
                id={`btn-filter-${region.id}`}
                onClick={() => toggleFilter(region.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'border text-stone-950 shadow-md'
                    : 'border border-stone-800 bg-stone-900/60 text-stone-500 opacity-60'
                }`}
                style={{
                  backgroundColor: isActive ? region.color : undefined,
                  borderColor: region.color,
                }}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: isActive ? '#09101d' : region.color }}
                />
                <span>{region.name.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Map Canvas & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Map Viewport (8 cols) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl border border-stone-800 bg-[#060c18] p-6 shadow-2xl min-h-[480px] flex items-center justify-center">
          {/* Zoom controls */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 rounded-xl border border-stone-800 bg-stone-900/80 p-1.5 backdrop-blur-md">
            <button
              id="btn-map-zoomin"
              onClick={() => handleZoom(0.2)}
              className="rounded-lg p-1.5 text-stone-300 hover:bg-stone-800 hover:text-white cursor-pointer"
              title="تكبير"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              id="btn-map-zoomout"
              onClick={() => handleZoom(-0.2)}
              className="rounded-lg p-1.5 text-stone-300 hover:bg-stone-800 hover:text-white cursor-pointer"
              title="تصغير"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              id="btn-map-reset"
              onClick={() => setZoomLevel(1)}
              className="rounded-lg p-1.5 text-stone-300 hover:bg-stone-800 hover:text-white cursor-pointer"
              title="إعادة الضبط"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* North Compass */}
          <div className="absolute top-4 right-4 z-20 flex flex-col items-center bg-stone-900/80 border border-stone-800 rounded-xl p-2 backdrop-blur-md pointer-events-none">
            <svg viewBox="0 0 30 30" className="w-6 h-6">
              <polygon points="15,2 19,15 15,12 11,15" fill="#f43f5e" />
              <polygon points="15,28 19,15 15,12 11,15" fill="#94a3b8" />
            </svg>
            <span className="text-[9px] font-bold text-white font-mono">N</span>
          </div>

          {/* SVG Map Canvas */}
          <motion.div
            style={{ scale: zoomLevel }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-xl aspect-[4/3] transition-transform"
          >
            <svg
              viewBox="0 0 600 450"
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
            >
              <defs>
                <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0b1736" />
                  <stop offset="100%" stopColor="#04081c" />
                </radialGradient>
                <filter id="lessonGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background boundary */}
              <rect width="600" height="450" fill="url(#oceanGrad)" rx="16" />

              {/* Geographic Grid Lines */}
              <line x1="150" y1="0" x2="150" y2="450" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
              <line x1="300" y1="0" x2="300" y2="450" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
              <line x1="450" y1="0" x2="450" y2="450" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
              <line x1="0" y1="300" x2="600" y2="300" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

              {/* ---------------------------------------------------- */}
              {/* ALGERIAN REVOLUTION: THE 6 HISTORICAL WILAYAS MAP    */}
              {/* ---------------------------------------------------- */}
              {isAlgerianRevolution && (
                <g>
                  {/* Mediterranean Coastline Header */}
                  <path
                    d="M 120,60 C 200,50 300,45 420,55 C 480,50 540,65 570,60"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <text x="320" y="40" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    البحر الأبيض المتوسط
                  </text>

                  {/* Electrified Lines: Challe & Morice */}
                  <path
                    d="M 480,65 L 485,150 L 515,240 L 540,320"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeDasharray="5 3"
                    fill="none"
                    filter="url(#lessonGlow)"
                  />
                  <text x="525" y="160" fill="#fca5a5" fontSize="8" fontWeight="bold" transform="rotate(80 525 160)">
                    ⚡ خط موريس وشال (الحدود الشرقية)
                  </text>

                  <path
                    d="M 140,65 L 130,160 L 110,240 L 125,300"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeDasharray="5 3"
                    fill="none"
                    filter="url(#lessonGlow)"
                  />
                  <text x="95" y="180" fill="#fca5a5" fontSize="8" fontWeight="bold" transform="rotate(-80 95 180)">
                    ⚡ خط شال الغربي (الحدود المغربية)
                  </text>

                  {/* 1. Wilaya 1: Aurès-Nemencha */}
                  {activeFilters.includes('reg-wilaya-1') && (
                    <g
                      className="cursor-pointer transition-opacity hover:opacity-90"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-1') || null)
                      }
                      onMouseEnter={() =>
                        setHoveredRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-1') || null)
                      }
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      <path
                        d="M 400,120 L 485,115 L 500,210 L 440,240 L 390,220 Z"
                        fill="rgba(244, 63, 94, 0.28)"
                        stroke="#f43f5e"
                        strokeWidth={selectedRegion?.id === 'reg-wilaya-1' ? '3' : '1.5'}
                        filter="url(#lessonGlow)"
                      />
                      <text x="445" y="165" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">
                        الولاية I: الأوراس
                      </text>
                      <circle cx="445" cy="180" r="4" fill="#f43f5e" />
                      <text x="445" y="195" fill="#e2e8f0" fontSize="8" textAnchor="middle">باتنة / خنشلة</text>
                    </g>
                  )}

                  {/* 2. Wilaya 2: North Constantine */}
                  {activeFilters.includes('reg-wilaya-2') && (
                    <g
                      className="cursor-pointer transition-opacity hover:opacity-90"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-2') || null)
                      }
                      onMouseEnter={() =>
                        setHoveredRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-2') || null)
                      }
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      <path
                        d="M 380,55 L 480,65 L 485,115 L 400,120 Z"
                        fill="rgba(89, 218, 209, 0.28)"
                        stroke="#59dad1"
                        strokeWidth={selectedRegion?.id === 'reg-wilaya-2' ? '3' : '1.5'}
                      />
                      <text x="435" y="85" fill="#59dad1" fontSize="11" fontWeight="bold" textAnchor="middle">
                        الولاية II: الشمال القسنطيني
                      </text>
                      <circle cx="430" cy="100" r="4.5" fill="#ef4444" />
                      <text x="430" y="112" fill="#fca5a5" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                        هجمات 20 أوت 1955 ⚔️
                      </text>
                    </g>
                  )}

                  {/* 3. Wilaya 3: Kabylie */}
                  {activeFilters.includes('reg-wilaya-3') && (
                    <g
                      className="cursor-pointer transition-opacity hover:opacity-90"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-3') || null)
                      }
                      onMouseEnter={() =>
                        setHoveredRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-3') || null)
                      }
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      <path
                        d="M 300,50 L 380,55 L 400,140 L 310,145 Z"
                        fill="rgba(74, 222, 128, 0.28)"
                        stroke="#4ade80"
                        strokeWidth={selectedRegion?.id === 'reg-wilaya-3' ? '3' : '1.5'}
                      />
                      <text x="345" y="85" fill="#4ade80" fontSize="11" fontWeight="bold" textAnchor="middle">
                        الولاية III: القبائل
                      </text>
                      <circle cx="345" cy="105" r="4.5" fill="#10b981" />
                      <text x="345" y="120" fill="#a7f3d0" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                        مؤتمر الصومام 1956 📜
                      </text>
                    </g>
                  )}

                  {/* 4. Wilaya 4: Algiers & Central */}
                  {activeFilters.includes('reg-wilaya-4') && (
                    <g
                      className="cursor-pointer transition-opacity hover:opacity-90"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-4') || null)
                      }
                      onMouseEnter={() =>
                        setHoveredRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-4') || null)
                      }
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      <path
                        d="M 220,55 L 300,50 L 310,145 L 230,160 Z"
                        fill="rgba(167, 139, 250, 0.28)"
                        stroke="#a78bfa"
                        strokeWidth={selectedRegion?.id === 'reg-wilaya-4' ? '3' : '1.5'}
                      />
                      <text x="265" y="85" fill="#a78bfa" fontSize="11" fontWeight="bold" textAnchor="middle">
                        الولاية IV: الوسط
                      </text>
                      <circle cx="265" cy="65" r="4" fill="#a78bfa" />
                      <text x="265" y="105" fill="#e2e8f0" fontSize="7.5" textAnchor="middle">الجزائر العاصمة</text>
                    </g>
                  )}

                  {/* 5. Wilaya 5: Oran & West */}
                  {activeFilters.includes('reg-wilaya-5') && (
                    <g
                      className="cursor-pointer transition-opacity hover:opacity-90"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-5') || null)
                      }
                      onMouseEnter={() =>
                        setHoveredRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-5') || null)
                      }
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      <path
                        d="M 140,65 L 220,55 L 230,160 L 140,210 Z"
                        fill="rgba(251, 146, 60, 0.28)"
                        stroke="#fb923c"
                        strokeWidth={selectedRegion?.id === 'reg-wilaya-5' ? '3' : '1.5'}
                      />
                      <text x="180" y="110" fill="#fb923c" fontSize="11" fontWeight="bold" textAnchor="middle">
                        الولاية V: وهران
                      </text>
                      <circle cx="180" cy="75" r="4" fill="#fb923c" />
                      <text x="180" y="135" fill="#e2e8f0" fontSize="7.5" textAnchor="middle">وهران / تلمسان</text>
                    </g>
                  )}

                  {/* 6. Wilaya 6: Sahara */}
                  {activeFilters.includes('reg-wilaya-6') && (
                    <g
                      className="cursor-pointer transition-opacity hover:opacity-90"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-6') || null)
                      }
                      onMouseEnter={() =>
                        setHoveredRegion(mapData.regions.find((r) => r.id === 'reg-wilaya-6') || null)
                      }
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      <path
                        d="M 140,210 L 230,160 L 390,220 L 440,240 L 500,210 L 520,320 L 480,420 L 160,420 Z"
                        fill="rgba(255, 225, 109, 0.15)"
                        stroke="#ffe16d"
                        strokeWidth={selectedRegion?.id === 'reg-wilaya-6' ? '3' : '1.5'}
                      />
                      <text x="320" y="270" fill="#ffe16d" fontSize="13" fontWeight="bold" textAnchor="middle">
                        الولاية VI: الصحراء (مؤتمر الصومام 1956)
                      </text>
                      <circle cx="300" cy="320" r="4" fill="#ffe16d" />
                      <text x="300" y="335" fill="#e2e8f0" fontSize="8" textAnchor="middle">حاسي مسعود (بترول)</text>
                      <circle cx="380" cy="300" r="4" fill="#38bdf8" />
                      <text x="380" y="315" fill="#e2e8f0" fontSize="8" textAnchor="middle">حاسي الرمل (غاز)</text>
                    </g>
                  )}
                </g>
              )}

              {/* ---------------------------------------------------- */}
              {/* COLD WAR & INTERNATIONAL CRISES MAP                  */}
              {/* ---------------------------------------------------- */}
              {isColdWar && (
                <g>
                  {/* Western Bloc */}
                  {activeFilters.includes('reg-nato-bloc') && (
                    <g
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-nato-bloc') || null)
                      }
                    >
                      <path
                        d="M 50,80 L 230,70 L 250,260 L 130,280 L 50,180 Z"
                        fill="rgba(56, 189, 248, 0.25)"
                        stroke="#38bdf8"
                        strokeWidth="2"
                      />
                      <text x="140" y="140" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                        المعسكر الغربي (و.م.أ وحلف الناتو)
                      </text>
                      <text x="140" y="160" fill="#94a3b8" fontSize="9" textAnchor="middle">
                        واشنطن - لندن - باريس - بون
                      </text>
                    </g>
                  )}

                  {/* Eastern Bloc */}
                  {activeFilters.includes('reg-warsaw-bloc') && (
                    <g
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-warsaw-bloc') || null)
                      }
                    >
                      <path
                        d="M 350,60 L 550,60 L 540,280 L 360,260 Z"
                        fill="rgba(244, 63, 94, 0.25)"
                        stroke="#f43f5e"
                        strokeWidth="2"
                      />
                      <text x="450" y="130" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="middle">
                        المعسكر الشرقي (الاتحاد السوفياتي ووارسو)
                      </text>
                      <text x="450" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">
                        موسكو - وارسو - برلين الشرقية
                      </text>
                    </g>
                  )}

                  {/* Iron Curtain Line */}
                  <path
                    d="M 300,50 L 310,180 L 295,290"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                    fill="none"
                    filter="url(#lessonGlow)"
                  />
                  <text x="300" y="35" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                    الستار الحديدي الفاصل (Iron Curtain)
                  </text>

                  {/* Crisis 1: Berlin */}
                  {activeFilters.includes('reg-crisis-berlin') && (
                    <g
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-crisis-berlin') || null)
                      }
                    >
                      <circle cx="310" cy="110" r="10" fill="#ffe16d" stroke="#f59e0b" strokeWidth="2" className="animate-ping" />
                      <circle cx="310" cy="110" r="6" fill="#ffe16d" />
                      <text x="310" y="135" fill="#ffe16d" fontSize="9" fontWeight="bold" textAnchor="middle">
                        أزمة وجدار برلين (1948 / 1961)
                      </text>
                    </g>
                  )}

                  {/* Crisis 2: Cuba */}
                  {activeFilters.includes('reg-crisis-cuba') && (
                    <g
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedRegion(mapData.regions.find((r) => r.id === 'reg-crisis-cuba') || null)
                      }
                    >
                      <circle cx="160" cy="300" r="10" fill="#f43f5e" stroke="#ffe16d" strokeWidth="2" className="animate-ping" />
                      <circle cx="160" cy="300" r="6" fill="#f43f5e" />
                      <text x="160" y="325" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
                        أزمة الصواريخ الكوبية (1962) 🚀
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* ---------------------------------------------------- */}
              {/* USA ECONOMIC BELTS MAP & OTHER MAPS                  */}
              {/* ---------------------------------------------------- */}
              {(isUsa || (!isAlgerianRevolution && !isColdWar)) && (
                <g>
                  {mapData.regions.map((reg, idx) => (
                    <g
                      key={reg.id}
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedRegion(reg)}
                      onMouseEnter={() => setHoveredRegion(reg)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      <circle
                        cx={reg.coordinates.x * 5.5 + 30}
                        cy={reg.coordinates.y * 3.8 + 30}
                        r={selectedRegion?.id === reg.id ? '22' : '16'}
                        fill={reg.fillColor}
                        stroke={reg.color}
                        strokeWidth={selectedRegion?.id === reg.id ? '3' : '1.5'}
                      />
                      <text
                        x={reg.coordinates.x * 5.5 + 30}
                        y={reg.coordinates.y * 3.8 + 35}
                        fill={reg.color}
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {reg.name.split('(')[0]}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </svg>

            {/* Hover Tooltip */}
            {hoveredRegion && (
              <div
                className="pointer-events-none absolute bottom-4 right-4 z-30 rounded-xl border border-stone-700 bg-stone-900/90 p-3 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: hoveredRegion.color }}
                  />
                  <span className="text-xs font-bold text-white">{hoveredRegion.name}</span>
                </div>
                <p className="text-[11px] text-stone-300 mt-1 max-w-xs line-clamp-2">
                  {hoveredRegion.description}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Region Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 rounded-3xl border border-stone-800 bg-[#09101d] p-6 shadow-xl">
          {selectedRegion ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                <div>
                  <span
                    className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: `${selectedRegion.color}20`,
                      color: selectedRegion.color,
                      border: `1px solid ${selectedRegion.color}40`,
                    }}
                  >
                    تفاصيل المنطقة الجغرافية والتاريخية
                  </span>
                  <h4 className="text-lg font-black text-stone-100 mt-1.5">
                    {selectedRegion.name}
                  </h4>
                </div>
                <Shield className="h-6 w-6 text-amber-400" />
              </div>

              <div>
                <h5 className="text-xs font-bold text-amber-400 mb-1">الوضع الإداري والسياسي:</h5>
                <p className="text-xs text-stone-200 leading-relaxed bg-stone-900/80 p-3.5 rounded-xl border border-stone-800">
                  {selectedRegion.description}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-teal-400 mb-1.5 flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5" />
                  السند القانوني والمعاهدة:
                </h5>
                <div className="rounded-xl border border-teal-500/20 bg-teal-950/30 p-3 text-xs font-mono font-semibold text-teal-200">
                  {selectedRegion.treatyRef}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-stone-400 mb-2">أبرز الأعلام والشخصيات المرتبطة:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRegion.keyFigures.map((fig, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-stone-700 bg-stone-800 px-2.5 py-1 text-xs font-semibold text-stone-300"
                    >
                      {fig}
                    </span>
                  ))}
                </div>
              </div>

              <button
                id="btn-ask-ai-region"
                onClick={() =>
                  onSelectConceptForAI(
                    `حلل الأهمية التاريخية والاستراتيجية لـ «${selectedRegion.name}» في ضوء ${selectedRegion.treatyRef}`
                  )
                }
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-3 text-xs font-bold text-stone-950 shadow-md hover:brightness-110 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                تحليل هذه المنطقة بالذكاء الاصطناعي
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-stone-500">
              <Map className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-xs">انقر على أي منطقة في الخريطة لاستعراض بياناتها التاريخية</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
