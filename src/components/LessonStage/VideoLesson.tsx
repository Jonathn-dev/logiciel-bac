import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { LessonData } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Bookmark,
  FileText,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface VideoLessonProps {
  lesson: LessonData;
  onAddNoteAtTimestamp: (timestampStr: string, concept: string) => void;
  onSelectConceptForAI: (concept: string) => void;
}

export const VideoLesson: React.FC<VideoLessonProps> = ({
  lesson,
  onAddNoteAtTimestamp,
  onSelectConceptForAI,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(14 * 60 + 20);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'markers' | 'transcript'>('markers');
  const [transcriptSearch, setTranscriptSearch] = useState('');

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const jumpToSeconds = (seconds: number) => {
    setCurrentTime(seconds);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      if (!isPlaying) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const filteredTranscript = lesson.videoData.transcript.filter((t) =>
    t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
    t.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Video Viewport & Controls */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-black shadow-2xl">
        <video
          ref={videoRef}
          src={lesson.videoData.videoUrl}
          poster={lesson.videoData.poster}
          className="h-[360px] md:h-[480px] w-full object-cover"
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              if (videoRef.current.duration) {
                setDuration(videoRef.current.duration);
              }
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Video Overlay Play Button when Paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-all hover:bg-black/30"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-2xl shadow-amber-500/50"
            >
              <Play className="h-9 w-9 translate-x-0.5 fill-current" />
            </motion.button>
          </div>
        )}

        {/* Custom Video Controls Bar */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col gap-2">
          {/* Progress Slider */}
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-amber-400 h-1.5 bg-stone-700/60 rounded-lg cursor-pointer appearance-none"
            />
            {/* Visual Markers on the timeline */}
            {lesson.videoData.markers.map((marker, idx) => {
              const leftPercent = (marker.timeSeconds / (duration || 100)) * 100;
              return (
                <div
                  key={idx}
                  onClick={() => jumpToSeconds(marker.timeSeconds)}
                  style={{ left: `${leftPercent}%` }}
                  title={`${marker.label} (${formatSeconds(marker.timeSeconds)})`}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-1 rounded-sm bg-amber-400 shadow-sm shadow-amber-400 cursor-pointer hover:scale-150 transition-transform"
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-200">
            <div className="flex items-center gap-3">
              <button
                id="btn-vid-toggle"
                onClick={togglePlay}
                className="rounded-lg p-2 hover:bg-stone-800 transition-colors"
                aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>

              <button
                id="btn-vid-rewind"
                onClick={() => jumpToSeconds(Math.max(0, currentTime - 10))}
                className="rounded-lg p-2 hover:bg-stone-800 transition-colors text-stone-400 hover:text-stone-200"
                title="تراجع 10 ثوانٍ"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <div className="font-mono text-stone-300">
                <span>{formatSeconds(currentTime)}</span>
                <span className="text-stone-500 mx-1">/</span>
                <span className="text-stone-400">{formatSeconds(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Speed Switcher */}
              <div className="flex items-center gap-1 rounded-lg bg-stone-900/80 p-1 border border-stone-800">
                {[0.75, 1, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changeSpeed(rate)}
                    className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                      playbackRate === rate
                        ? 'bg-amber-400 text-stone-950 font-black'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <button
                id="btn-vid-mute"
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (videoRef.current) videoRef.current.muted = !isMuted;
                }}
                className="rounded-lg p-2 hover:bg-stone-800 text-stone-300"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              <button
                id="btn-vid-note-trigger"
                onClick={() =>
                  onAddNoteAtTimestamp(
                    formatSeconds(currentTime),
                    lesson.videoData.markers.find(
                      (m) => Math.abs(m.timeSeconds - currentTime) < 30
                    )?.concept || 'ملاحظة درس فيديو'
                  )
                }
                className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>دون ملاحظة عند {formatSeconds(currentTime)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters / Markers & Synchronized Transcript Tabs */}
      <div className="rounded-3xl border border-stone-800 bg-[#09101d] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              id="tab-markers"
              onClick={() => setActiveTab('markers')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'markers'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>محطات ووقفات الدرس ({lesson.videoData.markers.length})</span>
            </button>

            <button
              id="tab-transcript"
              onClick={() => setActiveTab('transcript')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'transcript'
                  ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>التفريغ النصي الذكي ({lesson.videoData.transcript.length})</span>
            </button>
          </div>

          {activeTab === 'transcript' && (
            <input
              type="text"
              placeholder="ابحث في نص الدرس..."
              value={transcriptSearch}
              onChange={(e) => setTranscriptSearch(e.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-400 focus:outline-none w-48"
            />
          )}
        </div>

        {activeTab === 'markers' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {lesson.videoData.markers.map((marker, idx) => {
              const isCurrent = Math.abs(currentTime - marker.timeSeconds) < 20;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                    isCurrent
                      ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                      : 'border-stone-800 bg-stone-900/40 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      id={`btn-jump-marker-${idx}`}
                      onClick={() => jumpToSeconds(marker.timeSeconds)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl font-mono text-xs font-bold transition-transform hover:scale-105 ${
                        isCurrent
                          ? 'bg-amber-400 text-stone-950 font-black'
                          : 'bg-stone-800 text-amber-300'
                      }`}
                    >
                      {formatSeconds(marker.timeSeconds)}
                    </button>
                    <div>
                      <h4 className="text-sm font-bold text-stone-100">{marker.label}</h4>
                      <p className="text-xs text-stone-400">مفهوم مرجعي: {marker.concept}</p>
                    </div>
                  </div>

                  <button
                    id={`btn-ask-concept-${idx}`}
                    onClick={() => onSelectConceptForAI(marker.concept)}
                    className="flex items-center gap-1 rounded-lg border border-stone-700 px-2.5 py-1 text-[11px] font-semibold text-stone-300 hover:border-amber-500/50 hover:text-amber-300"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>توسيع</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
            {filteredTranscript.map((line, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-xl border border-stone-800/60 bg-stone-900/30 p-3 hover:bg-stone-900/60 transition-colors"
              >
                <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/20">
                  {line.timestamp}
                </span>
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-stone-400 block mb-0.5">
                    {line.speaker}
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed">{line.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
