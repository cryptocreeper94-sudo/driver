import { useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft, CloudSun, Cloud, CloudRain, Sun, Wind, Droplets,
  Thermometer, MapPin, Snowflake, CloudLightning, Search, Loader2
} from 'lucide-react';

interface WeatherData {
  location: string;
  current: { temp: number; condition: string; humidity: number; windSpeed: number; };
  forecast: { date: string; high: number; low: number; condition: string; }[];
}

const getIcon = (condition: string) => {
  const l = condition.toLowerCase();
  if (l.includes('thunder')) return CloudLightning;
  if (l.includes('snow')) return Snowflake;
  if (l.includes('rain') || l.includes('drizzle')) return CloudRain;
  if (l.includes('cloud') || l.includes('overcast')) return Cloud;
  if (l.includes('partly')) return CloudSun;
  return Sun;
};

const getRoadCondition = (condition: string) => {
  const l = condition.toLowerCase();
  if (l.includes('snow') || l.includes('ice')) return { text: 'Hazardous', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  if (l.includes('rain') || l.includes('shower')) return { text: 'Wet Roads', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
  if (l.includes('fog')) return { text: 'Low Visibility', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
  return { text: 'Clear & Dry', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
};

// Simple weather fetch using wttr.in (free, no API key)
async function fetchWeather(zip: string): Promise<WeatherData> {
  const res = await fetch(`https://wttr.in/${zip}?format=j1`);
  if (!res.ok) throw new Error('Weather fetch failed');
  const data = await res.json();
  const current = data.current_condition?.[0];
  const area = data.nearest_area?.[0];
  return {
    location: `${area?.areaName?.[0]?.value || zip}, ${area?.region?.[0]?.value || ''}`,
    current: {
      temp: parseInt(current?.temp_F || '0'),
      condition: current?.weatherDesc?.[0]?.value || 'Unknown',
      humidity: parseInt(current?.humidity || '0'),
      windSpeed: parseInt(current?.windspeedMiles || '0'),
    },
    forecast: (data.weather || []).slice(0, 7).map((d: any) => ({
      date: d.date,
      high: parseInt(d.maxtempF || '0'),
      low: parseInt(d.mintempF || '0'),
      condition: d.hourly?.[4]?.weatherDesc?.[0]?.value || 'Unknown',
    })),
  };
}

export default function Weather() {
  const [zip, setZip] = useState('37087');
  const [searchZip, setSearchZip] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (z: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(z);
      setWeather(data);
      setZip(z);
    } catch {
      setError('Could not load weather. Check the zip code.');
    }
    setLoading(false);
  };

  // Load on mount
  useState(() => { load(zip); });

  const handleSearch = () => { if (searchZip.length === 5) load(searchZip); };
  const CurrentIcon = weather ? getIcon(weather.current.condition) : CloudSun;
  const road = weather ? getRoadCondition(weather.current.condition) : { text: 'Loading...', color: 'bg-white/10 text-white/40' };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/"><button className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all touch-target"><ArrowLeft className="size-5" /></button></Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Weather & Roads</h1>
          <p className="text-[11px] text-white/30">Current: {zip}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25" />
          <input
            placeholder="Enter zip code"
            value={searchZip}
            onChange={e => setSearchZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full h-11 pl-10 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/30"
          />
        </div>
        <button onClick={handleSearch} className="px-4 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-xs flex items-center gap-1.5 touch-target">
          <Search className="size-3.5" /> Search
        </button>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">{error}</div>}

      {loading && (
        <div className="glass-card p-12 flex items-center justify-center">
          <Loader2 className="size-6 text-cyan-400 animate-spin" />
        </div>
      )}

      {weather && !loading && (
        <>
          {/* Current */}
          <div className="glass-card overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/15 via-cyan-500/10 to-blue-500/15 p-5">
              <div className="flex items-center gap-5">
                <div className="size-16 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20 shrink-0">
                  <CurrentIcon className="size-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">{weather.current.temp}deg</p>
                  <p className="text-sm text-white/50">{weather.current.condition}</p>
                  <p className="text-xs text-white/30 flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3" /> {weather.location}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-white/50">Road Conditions</span>
              <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${road.color}`}>{road.text}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="glass-card p-3 text-center">
              <Thermometer className="size-4 text-orange-400 mx-auto mb-1" />
              <p className="text-[9px] text-white/30">Feels Like</p>
              <p className="text-sm font-bold text-white">{weather.current.temp}degF</p>
            </div>
            <div className="glass-card p-3 text-center">
              <Droplets className="size-4 text-blue-400 mx-auto mb-1" />
              <p className="text-[9px] text-white/30">Humidity</p>
              <p className="text-sm font-bold text-white">{weather.current.humidity}%</p>
            </div>
            <div className="glass-card p-3 text-center">
              <Wind className="size-4 text-gray-400 mx-auto mb-1" />
              <p className="text-[9px] text-white/30">Wind</p>
              <p className="text-sm font-bold text-white">{weather.current.windSpeed} mph</p>
            </div>
          </div>

          {/* Radar */}
          <div className="glass-card overflow-hidden">
            <div className="p-3 pb-2">
              <h3 className="text-xs font-bold text-white">Live Radar</h3>
            </div>
            <div className="relative h-64 bg-black/30">
              <iframe
                src={`https://embed.windy.com/embed2.html?lat=${36.21}&lon=${-86.29}&width=650&height=300&zoom=7&level=surface&overlay=radar&product=radar&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1`}
                className="w-full h-full border-0"
                title="Weather Radar"
                allow="geolocation"
              />
              <div className="absolute bottom-2 right-2">
                <span className="text-[9px] px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/40 border border-white/[0.06]">
                  Powered by Windy
                </span>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-bold text-white mb-3">7-Day Forecast</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {weather.forecast.map((day, i) => {
                const DayIcon = getIcon(day.condition);
                const dayName = i === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div key={i} className={`p-3 rounded-xl text-center min-w-[72px] shrink-0 ${i === 0 ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
                    <p className="text-[10px] font-medium text-white mb-1.5">{dayName}</p>
                    <DayIcon className={`size-5 mx-auto mb-1.5 ${i === 0 ? 'text-cyan-400' : 'text-blue-400'}`} />
                    <p className="text-xs font-bold text-white">{day.high}deg</p>
                    <p className="text-[10px] text-white/40">{day.low}deg</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
