import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Timer, Play, Pause, RotateCcw, Bell, Clock, AlarmClock } from 'lucide-react';

const PRESETS = [
  { label: '30 min', seconds: 30 * 60, desc: 'DOT 30-min break', color: 'from-orange-500 to-rose-500' },
  { label: '10 hr', seconds: 10 * 60 * 60, desc: 'DOT 10-hr off-duty', color: 'from-violet-500 to-purple-600' },
  { label: '15 min', seconds: 15 * 60, desc: 'Quick break', color: 'from-cyan-500 to-teal-500' },
  { label: '1 hr', seconds: 60 * 60, desc: 'Meal break', color: 'from-emerald-500 to-green-600' },
  { label: '8 hr', seconds: 8 * 60 * 60, desc: 'Sleeper berth', color: 'from-blue-500 to-indigo-600' },
  { label: '34 hr', seconds: 34 * 60 * 60, desc: '34-hr reset', color: 'from-rose-500 to-pink-600' },
];

type Mode = 'timer' | 'clock';

export default function BreakTimer() {
  const [mode, setMode] = useState<Mode>('timer');
  const [totalSeconds, setTotalSeconds] = useState(30 * 60);
  const [remaining, setRemaining] = useState(30 * 60);
  const [running, setRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Clock mode
  useEffect(() => {
    if (mode !== 'clock') return;
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, [mode]);

  // Timer
  const tick = useCallback(() => {
    setRemaining(prev => {
      if (prev <= 1) {
        setRunning(false);
        setAlarmTriggered(true);
        // Try to play notification sound
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          gain.gain.value = 0.3;
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        } catch {}
        return 0;
      }
      return prev - 1;
    });
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, tick]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  const selectPreset = (seconds: number) => {
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setRunning(false);
    setAlarmTriggered(false);
  };

  const setCustom = () => {
    if (!customMinutes) return;
    const s = parseInt(customMinutes) * 60;
    selectPreset(s);
    setCustomMinutes('');
  };

  const reset = () => {
    setRemaining(totalSeconds);
    setRunning(false);
    setAlarmTriggered(false);
  };

  const circumference = 2 * Math.PI * 90;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/"><button className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all touch-target"><ArrowLeft className="size-5" /></button></Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">HOS Break Timer</h1>
          <p className="text-[11px] text-white/30">DOT-compliant presets</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
        <button onClick={() => setMode('timer')} className={`flex-1 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all touch-target ${mode === 'timer' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/25' : 'text-white/40'}`}>
          <Timer className="size-3.5" /> Timer
        </button>
        <button onClick={() => setMode('clock')} className={`flex-1 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all touch-target ${mode === 'clock' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/25' : 'text-white/40'}`}>
          <Clock className="size-3.5" /> Clock
        </button>
      </div>

      {mode === 'clock' ? (
        <div className="glass-card p-8 text-center">
          <p className="text-5xl font-black text-white tabular-nums">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-sm text-white/30 mt-2">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      ) : (
        <>
          {/* Timer Display */}
          <div className="glass-card p-6 flex flex-col items-center">
            {alarmTriggered && (
              <div className="w-full p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-sm font-bold text-center mb-4 flex items-center justify-center gap-2 animate-pulse">
                <Bell className="size-4" /> Break Complete!
              </div>
            )}

            <div className="relative size-52 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle
                  cx="100" cy="100" r="90" fill="none"
                  stroke={alarmTriggered ? '#10b981' : running ? '#f97316' : '#06b6d4'}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-white tabular-nums">{formatTime(remaining)}</p>
                <p className="text-[10px] text-white/30 mt-1">
                  {alarmTriggered ? 'DONE' : running ? 'RUNNING' : 'PAUSED'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                className="size-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all touch-target"
              >
                <RotateCcw className="size-5" />
              </button>
              <button
                onClick={() => { setRunning(!running); setAlarmTriggered(false); }}
                className={`size-16 rounded-2xl flex items-center justify-center shadow-lg transition-all touch-target ${
                  running
                    ? 'bg-gradient-to-br from-orange-500 to-rose-500 shadow-orange-500/20'
                    : 'bg-gradient-to-br from-cyan-500 to-teal-500 shadow-cyan-500/20'
                }`}
              >
                {running ? <Pause className="size-7 text-white" /> : <Play className="size-7 text-white ml-0.5" />}
              </button>
              <button
                onClick={() => selectPreset(totalSeconds)}
                className="size-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all touch-target"
              >
                <AlarmClock className="size-5" />
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map(preset => (
              <button
                key={preset.label}
                onClick={() => selectPreset(preset.seconds)}
                className={`p-3 rounded-xl text-center transition-all touch-target ${
                  totalSeconds === preset.seconds
                    ? `bg-gradient-to-br ${preset.color} shadow-lg text-white`
                    : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <p className="text-sm font-bold">{preset.label}</p>
                <p className="text-[9px] opacity-60">{preset.desc}</p>
              </button>
            ))}
          </div>

          {/* Custom */}
          <div className="glass-card p-3 flex items-center gap-2">
            <input
              type="number"
              placeholder="Custom (min)"
              value={customMinutes}
              onChange={e => setCustomMinutes(e.target.value)}
              className="flex-1 h-11 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/30"
            />
            <button onClick={setCustom} className="px-4 h-11 rounded-lg bg-orange-500/15 border border-orange-500/25 text-orange-300 text-xs font-medium hover:bg-orange-500/25 transition-colors touch-target">
              Set
            </button>
          </div>
        </>
      )}
    </div>
  );
}
