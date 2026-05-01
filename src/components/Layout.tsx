import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Compass, MapPin, ScanLine, Route, DollarSign, CloudSun, Timer,
  Shield, ExternalLink
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Compass },
  { href: '/gps', label: 'GPS', icon: MapPin },
  { href: '/scanner', label: 'Scan', icon: ScanLine },
  { href: '/mileage', label: 'Miles', icon: Route },
  { href: '/expenses', label: 'Expenses', icon: DollarSign },
  { href: '/weather', label: 'Weather', icon: CloudSun },
  { href: '/timer', label: 'Timer', icon: Timer },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen min-h-dvh bg-void flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-void/80 backdrop-blur-2xl border-b border-white/[0.04] safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="size-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/30 transition-shadow">
                <Compass className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">Driver Connect</h1>
                <p className="text-[10px] text-white/30 leading-tight">Powered by <a href="https://dwtl.io" target="_blank" rel="noopener noreferrer" className="text-cyan-400/60 hover:text-cyan-400 transition-colors">Trust Layer</a></p>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <button className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all touch-target ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}>
                    <Icon className="size-3.5" />
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </div>

          <a
            href="https://dwtl.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/[0.1] transition-all text-[10px]"
          >
            <Shield className="size-3" />
            Trust Layer
            <ExternalLink className="size-2.5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-2xl border-t border-white/[0.06] safe-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button className={`flex flex-col items-center gap-0.5 py-2 px-2 rounded-lg transition-all touch-target ${
                  isActive ? 'text-cyan-400' : 'text-white/30'
                }`}>
                  <Icon className={`size-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : ''}`} />
                  <span className="text-[9px] font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer - Desktop only */}
      <footer className="hidden md:block border-t border-white/[0.04] mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <Shield className="size-3" />
            <span>Driver Connect  -  powered by <a href="https://dwtl.io" target="_blank" rel="noopener noreferrer" className="text-cyan-400/50 hover:text-cyan-400 transition-colors">Trust Layer</a></span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-white/15">
            <a href="https://happyeats.app" target="_blank" rel="noopener noreferrer" className="hover:text-white/30 transition-colors">Order Food -></a>
            <span>(c) {new Date().getFullYear()} DarkWave</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
