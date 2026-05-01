import { Link } from 'wouter';
import {
  MapPin, ScanLine, Route, DollarSign, CloudSun, Timer,
  Compass, ChevronRight, Zap, Truck, Shield, Sparkles,
  ArrowRight
} from 'lucide-react';

import heroHighway from '@/assets/images/hero-highway.png';
import cardGps from '@/assets/images/card-gps.png';
import cardScanner from '@/assets/images/card-scanner.png';
import cardMileage from '@/assets/images/card-mileage.png';
import cardExpenses from '@/assets/images/card-expenses.png';
import cardWeather from '@/assets/images/card-weather.png';
import cardTimer from '@/assets/images/card-timer.png';

const TOOLS = [
  {
    href: '/gps',
    label: 'GPS Finder',
    description: 'Find truck stops, gas stations, restaurants & services nearby',
    icon: MapPin,
    image: cardGps,
    gradient: 'from-sky-500 to-blue-600',
    glowColor: 'shadow-sky-500/30',
    badge: '8 Categories',
    featured: true,
  },
  {
    href: '/scanner',
    label: 'Receipt Scanner',
    description: 'Snap a photo  -  AI extracts merchant, items, totals & tax instantly',
    icon: ScanLine,
    image: cardScanner,
    gradient: 'from-cyan-500 to-teal-500',
    glowColor: 'shadow-cyan-500/30',
    badge: 'AI-Powered',
    featured: true,
  },
  {
    href: '/mileage',
    label: 'Mileage Tracker',
    description: 'Log trips with IRS deduction calculator at $0.70/mile',
    icon: Route,
    image: cardMileage,
    gradient: 'from-violet-500 to-purple-600',
    glowColor: 'shadow-violet-500/30',
    badge: 'IRS 2025',
  },
  {
    href: '/expenses',
    label: 'Expense Tracker',
    description: 'Track fuel, parking, tolls, meals & maintenance with CSV export',
    icon: DollarSign,
    image: cardExpenses,
    gradient: 'from-emerald-500 to-teal-600',
    glowColor: 'shadow-emerald-500/30',
    badge: 'Tax Ready',
  },
  {
    href: '/weather',
    label: 'Weather & Roads',
    description: 'Live conditions, 7-day forecast, road alerts & Windy radar',
    icon: CloudSun,
    image: cardWeather,
    gradient: 'from-blue-500 to-cyan-500',
    glowColor: 'shadow-blue-500/30',
  },
  {
    href: '/timer',
    label: 'HOS Break Timer',
    description: '30-min & 10-hr DOT presets, alarms, clock & timer modes',
    icon: Timer,
    image: cardTimer,
    gradient: 'from-orange-500 to-rose-500',
    glowColor: 'shadow-orange-500/30',
    badge: 'DOT',
  },
];

function ToolCard({ tool, index }: { tool: typeof TOOLS[0]; index: number }) {
  const Icon = tool.icon;
  const isFeatured = tool.featured;

  return (
    <Link href={tool.href}>
      <div
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] hover:border-white/[0.18] transition-all duration-500 hover:shadow-xl ${tool.glowColor} hover:-translate-y-1 animate-fade-in ${
          isFeatured ? 'row-span-2 min-h-[320px]' : 'min-h-[180px]'
        }`}
        style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={tool.image}
            alt=""
            className="w-full h-full object-cover brightness-110 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
        </div>

        {/* Content */}
        <div className={`relative flex flex-col h-full justify-end ${isFeatured ? 'p-6' : 'p-4'}`}>
          {/* Badge */}
          {tool.badge && (
            <div className={`absolute ${isFeatured ? 'top-4 right-4' : 'top-3 right-3'}`}>
              <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${tool.gradient} text-white shadow-lg backdrop-blur-sm`}>
                {tool.badge}
              </span>
            </div>
          )}

          {/* Icon */}
          <div className={`${isFeatured ? 'size-12 mb-4' : 'size-9 mb-2'} rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className={`${isFeatured ? 'size-6' : 'size-4'} text-white`} />
          </div>

          <h3 className={`${isFeatured ? 'text-lg' : 'text-sm'} font-bold text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all leading-tight`}>
            {tool.label}
          </h3>
          <p className={`${isFeatured ? 'text-xs mt-1.5' : 'text-[10px] mt-0.5'} text-white/60 leading-snug group-hover:text-white/80 transition-colors drop-shadow-md line-clamp-2`}>
            {tool.description}
          </p>

          <div className={`flex items-center gap-1 text-white/30 group-hover:text-white/70 transition-all duration-300 ${isFeatured ? 'mt-4' : 'mt-2'}`}>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">Open</span>
            <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const featured = TOOLS.filter(t => t.featured);
  const rest = TOOLS.filter(t => !t.featured);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] animate-fade-in">
        <div className="absolute inset-0">
          <img src={heroHighway} alt="" className="w-full h-full object-cover brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-transparent to-transparent" />
        </div>

        {/* Decorative Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-teal-500/[0.04] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative px-6 sm:px-10 py-10 sm:py-16 min-h-[280px] sm:min-h-[340px] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-5">
            <div className="size-11 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 pulse-glow">
              <Compass className="size-6 text-white" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent max-w-[200px]" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.1] mb-4 max-w-lg" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            Free tools for{' '}
            <span className="gradient-text">every driver</span>
          </h1>
          <p className="text-sm sm:text-base text-white/50 max-w-md leading-relaxed" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            GPS finder, AI receipt scanner, mileage tracker, expense manager, weather & HOS timer.
            No signup. No fees. Open and drive.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8">
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <div className="size-5 rounded-md bg-white/[0.06] flex items-center justify-center">
                <Shield className="size-3" />
              </div>
              <span>Trust Layer ecosystem</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <div className="size-5 rounded-md bg-white/[0.06] flex items-center justify-center">
                <Truck className="size-3" />
              </div>
              <span>Commercial & daily drivers</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <div className="size-5 rounded-md bg-white/[0.06] flex items-center justify-center">
                <Zap className="size-3" />
              </div>
              <span>Mobile-first * Works on LTE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
        <Sparkles className="size-4 text-cyan-400" />
        <h2 className="text-sm font-bold text-white/70 uppercase tracking-[0.15em]">Driver Connect</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />
        <span className="text-[10px] text-white/20 font-medium tabular-nums">{TOOLS.length} tools</span>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 auto-rows-fr">
        {featured.map((tool, i) => (
          <ToolCard key={tool.href} tool={tool} index={i} />
        ))}
        {rest.map((tool, i) => (
          <ToolCard key={tool.href} tool={tool} index={i + featured.length} />
        ))}
      </div>

      {/* Happy Eats Cross-Promo */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.06] via-void to-rose-500/[0.04]" />
        <div className="absolute right-0 top-0 w-40 h-40 bg-orange-500/[0.04] rounded-full blur-[60px] pointer-events-none" />
        <div className="relative p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 flex items-center justify-center border border-orange-500/20 shrink-0 shadow-lg shadow-orange-500/10">
            <Truck className="size-6 text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Hungry on the road?</p>
            <p className="text-[11px] text-white/30 leading-relaxed">
              Order food from local vendors in your zone with <span className="text-orange-300/60">Happy Eats</span>  -  our delivery platform built for drivers.
            </p>
          </div>
          <a
            href="https://happyeats.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold hover:opacity-90 transition-opacity shrink-0 touch-target flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
          >
            Order
            <ArrowRight className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
