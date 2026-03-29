import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft, MapPin, Navigation, Search, Fuel, UtensilsCrossed,
  ShowerHead, Dumbbell, Film, Hotel, ShoppingCart, Coffee,
  ExternalLink, Locate, Loader2
} from 'lucide-react';

const CATEGORIES = [
  { id: 'gas', label: 'Gas Stations', icon: Fuel, query: 'gas station', color: 'from-amber-500 to-orange-500' },
  { id: 'truck-stop', label: 'Truck Stops', icon: Navigation, query: 'truck stop', color: 'from-blue-500 to-cyan-500' },
  { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, query: 'restaurant', color: 'from-rose-500 to-pink-500' },
  { id: 'fast-food', label: 'Fast Food', icon: Coffee, query: 'fast food', color: 'from-orange-500 to-red-500' },
  { id: 'grocery', label: 'Grocery', icon: ShoppingCart, query: 'grocery store', color: 'from-emerald-500 to-green-500' },
  { id: 'gyms', label: 'Gyms', icon: Dumbbell, query: 'gym fitness', color: 'from-violet-500 to-purple-500' },
  { id: 'movies', label: 'Movies', icon: Film, query: 'movie theater', color: 'from-fuchsia-500 to-pink-500' },
  { id: 'hotels', label: 'Hotels', icon: Hotel, query: 'hotel motel', color: 'from-sky-500 to-blue-500' },
];

interface Location {
  lat: number;
  lng: number;
  display: string;
}

export default function GPSFinder() {
  const [activeCategory, setActiveCategory] = useState('gas');
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState<Location | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            display: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          });
          setLocating(false);
        },
        () => {
          setLocation({ lat: 36.21, lng: -86.29, display: 'Nashville, TN (default)' });
          setLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocation({ lat: 36.21, lng: -86.29, display: 'Nashville, TN (default)' });
      setLocating(false);
    }
  };

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory)!;
  const googleMapsUrl = location
    ? `https://www.google.com/maps/search/${encodeURIComponent(searchQuery || activeCat.query)}/@${location.lat},${location.lng},${radius < 5 ? 14 : radius < 15 ? 12 : 10}z`
    : '#';

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/">
          <button className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all touch-target">
            <ArrowLeft className="size-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-white">GPS Finder</h1>
          <p className="text-[11px] text-white/30">Find services near you</p>
        </div>
      </div>

      {/* Location Bar */}
      <div className="glass-card p-3 flex items-center gap-3">
        <div className="size-9 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
          {locating ? (
            <Loader2 className="size-4 text-cyan-400 animate-spin" />
          ) : (
            <MapPin className="size-4 text-cyan-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-white/30">Current Location</p>
          <p className="text-xs font-medium text-white truncate">
            {location?.display || 'Detecting...'}
          </p>
        </div>
        <button
          onClick={getLocation}
          className="px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-medium hover:bg-cyan-500/20 transition-colors touch-target flex items-center gap-1"
        >
          <Locate className="size-3" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25" />
        <input
          type="text"
          placeholder="Search for a specific place..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/30 focus:bg-white/[0.06] transition-all"
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-4 gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              className={`p-3 rounded-xl text-center transition-all touch-target ${
                isActive
                  ? `bg-gradient-to-br ${cat.color} shadow-lg text-white`
                  : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon className={`size-5 mx-auto mb-1 ${isActive ? 'text-white' : ''}`} />
              <span className="text-[9px] font-medium block leading-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Radius Slider */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50">Search Radius</span>
          <span className="text-sm font-bold text-cyan-400">{radius} miles</span>
        </div>
        <input
          type="range"
          min={1}
          max={25}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/30"
        />
        <div className="flex justify-between text-[9px] text-white/20 mt-1">
          <span>1 mi</span>
          <span>10 mi</span>
          <span>25 mi</span>
        </div>
      </div>

      {/* Open in Maps Button */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r ${activeCat.color} text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity touch-target`}
      >
        <Navigation className="size-4" />
        Find {activeCat.label} Near Me
        <ExternalLink className="size-3 ml-1 opacity-60" />
      </a>

      <p className="text-center text-[10px] text-white/15">
        Opens Google Maps with directions to the nearest results
      </p>
    </div>
  );
}
