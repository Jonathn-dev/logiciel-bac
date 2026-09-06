import React, { useState } from 'react';
import { Map, Layers, Eye, EyeOff, Info, Check, Sparkles, MapPin, ZoomIn } from 'lucide-react';
import { BAC_MAP_LAYERS } from '../../../data/bacCurriculum';
import { MapMarker } from '../../../types';
import { MapPreset, MapPinQuestion } from '../../../data/bacCartographyData';

export interface BacProfessionalMapProps {
  preset?: MapPreset;
  activeLayers?: string[];
  onToggleLayer?: (layerId: string) => void;
  activePinQuestion?: MapPinQuestion;
  isBlankMapMode?: boolean;
  onToggleBlankMapMode?: () => void;
}

export const BacProfessionalMap: React.FC<BacProfessionalMapProps> = ({
  preset,
  activeLayers,
  onToggleLayer,
  activePinQuestion,
  isBlankMapMode: propIsBlankMapMode,
  onToggleBlankMapMode,
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>(BAC_MAP_LAYERS[0].id);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(BAC_MAP_LAYERS[0].markers[0]);
  const [internalBlankMapMode, setInternalBlankMapMode] = useState<boolean>(false);
  const [revealedMarkerIds, setRevealedMarkerIds] = useState<string[]>([]);

  const isBlankMapMode = propIsBlankMapMode !== undefined ? propIsBlankMapMode : internalBlankMapMode;
  const toggleBlankMap = onToggleBlankMapMode || (() => setInternalBlankMapMode(!internalBlankMapMode));

  const currentLayer = BAC_MAP_LAYERS.find((l) => l.id === selectedLayerId) || BAC_MAP_LAYERS[0];

  const handleToggleReveal = (markerId: string) => {
    if (revealedMarkerIds.includes(markerId)) {
      setRevealedMarkerIds(revealedMarkerIds.filter((id) => id !== markerId));
    } else {
      setRevealedMarkerIds([...revealedMarkerIds, markerId]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="atlas-glass rounded-3xl p-5 sm:p-6 border border-amber-400/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <Map className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              أطلس الخرائط التفاعلية وتوقيع المواقع لبكالوريا الجزائر
            </h2>
          </div>
          <p className="text-xs text-[#a2a6d0] mt-1">
            خرائط صماء تفاعلية لتوقيع الولايات الست، الدول الأعضاء في الأحلاف، منظمة أوبك، وممرات التجارة
          </p>
        </div>

        {/* Map Mode Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => toggleBlankMap()}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
              isBlankMapMode
                ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'bg-[#121743] hover:bg-[#1a215b] text-[#dfe0ff] border-white/10'
            }`}
          >
            {isBlankMapMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isBlankMapMode ? 'وضع الخريطة الصماء (اختبار التوقيع)' : 'وضع المراجعة الشاملة'}</span>
          </button>
        </div>
      </div>

      {/* Layer Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {BAC_MAP_LAYERS.map((layer) => {
          const isSelected = selectedLayerId === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => {
                setSelectedLayerId(layer.id);
                setSelectedMarker(layer.markers[0] || null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                  : 'bg-[#0b1035] hover:bg-[#121743] text-[#a2a6d0] border-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{layer.name}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Map Visual Stage & Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 atlas-glass rounded-3xl p-4 sm:p-6 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[420px] bg-[#050824]">
          
          {/* Map Header Overlay */}
          <div className="absolute top-4 right-4 z-10 bg-[#080d30]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLayer.name}</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full max-w-[650px] aspect-[4/3] rounded-2xl border border-white/10 bg-[#070b2e] flex items-center justify-center p-4">
            
            {/* Ambient Grid Lines for Map Aesthetic */}
            <div className="absolute inset-0 bg-[radial-gradient(#1c2666_1px,transparent_1px)] [background-size:16px_16px] opacity-40 rounded-2xl" />

            {/* Stylized Algeria/World Map Silhouette */}
            <svg viewBox="0 0 500 400" className="w-full h-full text-indigo-900/40 fill-current stroke-white/20 stroke-1">
              <path d="M 50 120 Q 150 50 300 80 T 450 140 Q 420 280 320 350 T 120 330 Z" className="fill-[#0c1445]/80 hover:fill-[#121c5c]/80 transition-colors" />
              {/* Regional sub-paths */}
              <circle cx="250" cy="180" r="140" className="stroke-amber-400/10 fill-none stroke-dashed" />
            </svg>

            {/* Interactive Pins */}
            {currentLayer.markers.map((marker) => {
              const isSelected = selectedMarker?.id === marker.id;
              const isRevealed = revealedMarkerIds.includes(marker.id) || !isBlankMapMode;

              return (
                <div
                  key={marker.id}
                  style={{
                    position: 'absolute',
                    left: `${marker.xPercent}%`,
                    top: `${marker.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="z-20 group"
                >
                  <button
                    onClick={() => {
                      setSelectedMarker(marker);
                      if (isBlankMapMode) {
                        handleToggleReveal(marker.id);
                      }
                    }}
                    className={`relative p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-black scale-125 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
                        : 'bg-[#12194a] text-amber-300 border border-amber-400/40 hover:scale-110 hover:bg-amber-400 hover:text-black'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    
                    {/* Ripple ring for active marker */}
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
                    )}
                  </button>

                  {/* Marker Tooltip / Label */}
                  <div className={`absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shadow-xl border pointer-events-none transition-all ${
                    isRevealed
                      ? 'bg-[#080d33] text-white border-amber-400/30 opacity-100'
                      : 'bg-black/90 text-amber-300 border-dashed border-amber-400/40 opacity-90'
                  }`}>
                    {isRevealed ? marker.label : '❓ انقر للكشف'}
                  </div>
                </div>
              );
            })}

          </div>

          <p className="text-[11px] text-[#a2a6d0] mt-3">
            💡 اضغط على أي نقطة على الخريطة لعرض تفاصيلها المنهجية المعتمدة في البكالوريا
          </p>
        </div>

        {/* Selected Location Info Card */}
        <div className="lg:col-span-4 space-y-4">
          {selectedMarker ? (
            <div className="atlas-glass rounded-3xl p-5 sm:p-6 border border-amber-400/30 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {selectedMarker.category}
                </span>
                <span className="text-xs font-mono text-[#a2a6d0]">
                  إحداثيات التوقيع: X:{selectedMarker.xPercent}% Y:{selectedMarker.yPercent}%
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {selectedMarker.label}
                </h3>
                <p className="text-xs text-amber-300 font-medium mt-1 leading-relaxed">
                  {selectedMarker.description}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080c2b] border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#dfe0ff]">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>السياق التاريخي / الجغرافي للبكالوريا:</span>
                </div>
                <p className="text-xs text-[#a2a6d0] leading-relaxed">
                  {selectedMarker.historicalContext}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-400/20 text-[11px] text-amber-200">
                ⭐ <span className="font-bold">نصيحة توقيع:</span> تأكد من كتابة العنوان والمفتاح ومقياس الرسم عند توقيع هذا الموقع على الخريطة الصماء في ورقة الامتحان.
              </div>

            </div>
          ) : (
            <div className="atlas-glass rounded-3xl p-8 text-center text-[#a2a6d0] space-y-2 border border-white/5">
              <MapPin className="w-8 h-8 text-amber-400/40 mx-auto" />
              <p className="text-xs">اختر موقعاً من الخريطة لعرض تفاصيله</p>
            </div>
          )}

          {/* Quick List of Layer Markers */}
          <div className="atlas-glass-card rounded-2xl p-4 border border-white/10 space-y-2">
            <h4 className="text-xs font-bold text-white mb-2">المواقع المطلوب توقيعها في هذه الخريطة:</h4>
            <div className="space-y-1.5">
              {currentLayer.markers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMarker(m)}
                  className={`w-full text-right p-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    selectedMarker?.id === m.id
                      ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                      : 'hover:bg-[#121743] text-[#a2a6d0]'
                  }`}
                >
                  <span className="truncate">{m.label}</span>
                  <MapPin className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
