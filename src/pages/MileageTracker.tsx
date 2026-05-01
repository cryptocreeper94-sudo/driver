import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Route, Plus, Trash2, Download, Calculator, MapPin, Calendar } from 'lucide-react';

const IRS_RATE = 0.70; // 2025 IRS mileage rate

interface Trip {
  id: number;
  date: string;
  from: string;
  to: string;
  miles: number;
  purpose: string;
}

export default function MileageTracker() {
  const [trips, setTrips] = useState<Trip[]>([
    { id: 1, date: '2026-01-24', from: 'Nashville, TN', to: 'Lebanon, TN', miles: 32.5, purpose: 'Delivery' },
    { id: 2, date: '2026-01-23', from: 'Lebanon, TN', to: 'Mt. Juliet, TN', miles: 18.2, purpose: 'Pickup' },
    { id: 3, date: '2026-01-22', from: 'Nashville, TN', to: 'Smyrna, TN', miles: 24.0, purpose: 'Client meeting' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ from: '', to: '', miles: '', purpose: '', date: new Date().toISOString().split('T')[0] });

  const totalMiles = trips.reduce((s, t) => s + t.miles, 0);
  const totalDeduction = totalMiles * IRS_RATE;

  const addTrip = () => {
    if (!form.miles || !form.from) return;
    setTrips(prev => [{
      id: Date.now(),
      date: form.date,
      from: form.from,
      to: form.to,
      miles: parseFloat(form.miles),
      purpose: form.purpose,
    }, ...prev]);
    setForm({ from: '', to: '', miles: '', purpose: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const deleteTrip = (id: number) => setTrips(prev => prev.filter(t => t.id !== id));

  const exportCSV = () => {
    const header = 'Date,From,To,Miles,Purpose,Deduction\n';
    const rows = trips.map(t => `${t.date},${t.from},${t.to},${t.miles},${t.purpose},$${(t.miles * IRS_RATE).toFixed(2)}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mileage-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/"><button className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all touch-target"><ArrowLeft className="size-5" /></button></Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Mileage Tracker</h1>
          <p className="text-[11px] text-white/30">IRS deduction: ${IRS_RATE}/mile (2025)</p>
        </div>
        <button onClick={exportCSV} className="px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/40 text-[10px] font-medium hover:text-white hover:bg-white/[0.08] transition-all touch-target flex items-center gap-1">
          <Download className="size-3" /> CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Total Miles</p>
          <p className="text-xl font-black text-white mt-1">{totalMiles.toFixed(1)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Trips</p>
          <p className="text-xl font-black text-white mt-1">{trips.length}</p>
        </div>
        <div className="glass-card p-4 text-center bg-emerald-500/5 border-emerald-500/15">
          <p className="text-[10px] text-emerald-300/50 uppercase tracking-wider">Tax Deduction</p>
          <p className="text-xl font-black text-emerald-300 mt-1">${totalDeduction.toFixed(2)}</p>
        </div>
      </div>

      {/* IRS Calculator */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="size-4 text-violet-400" />
          <h3 className="text-xs font-bold text-white">Quick Calculate</h3>
        </div>
        <p className="text-[10px] text-white/30 mb-2">
          {totalMiles.toFixed(1)} miles x ${IRS_RATE}/mile = <span className="text-emerald-300 font-bold">${totalDeduction.toFixed(2)} deduction</span>
        </p>
      </div>

      {/* Add Trip */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity touch-target">
          <Plus className="size-4" /> Log New Trip
        </button>
      ) : (
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-sm font-bold text-white">New Trip</h3>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} className="col-span-2 h-11 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/30" />
            <input placeholder="From" value={form.from} onChange={e => setForm(p => ({...p, from: e.target.value}))} className="h-11 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/30" />
            <input placeholder="To" value={form.to} onChange={e => setForm(p => ({...p, to: e.target.value}))} className="h-11 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/30" />
            <input type="number" step="0.1" placeholder="Miles" value={form.miles} onChange={e => setForm(p => ({...p, miles: e.target.value}))} className="h-11 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/30" />
            <input placeholder="Purpose" value={form.purpose} onChange={e => setForm(p => ({...p, purpose: e.target.value}))} className="h-11 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/30" />
          </div>
          <div className="flex gap-2">
            <button onClick={addTrip} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-xs touch-target">Save Trip</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/50 text-xs touch-target">Cancel</button>
          </div>
        </div>
      )}

      {/* Trip Log */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Trip Log</h3>
        {trips.map(trip => (
          <div key={trip.id} className="glass-card p-3 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <Route className="size-4 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                <MapPin className="size-3 inline mr-1 text-white/30" />{trip.from} -> {trip.to}
              </p>
              <p className="text-[10px] text-white/30 flex items-center gap-2">
                <Calendar className="size-2.5" />{trip.date}
                {trip.purpose && <span>* {trip.purpose}</span>}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-white">{trip.miles} mi</p>
              <p className="text-[10px] text-emerald-400">${(trip.miles * IRS_RATE).toFixed(2)}</p>
            </div>
            <button onClick={() => deleteTrip(trip.id)} className="size-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
