import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Plus, Trash2, Download, DollarSign, Fuel, Car, UtensilsCrossed, Wrench, ParkingCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'fuel', label: 'Fuel', icon: Fuel, color: 'text-amber-400 bg-amber-500/15' },
  { id: 'parking', label: 'Parking', icon: ParkingCircle, color: 'text-blue-400 bg-blue-500/15' },
  { id: 'tolls', label: 'Tolls', icon: Car, color: 'text-violet-400 bg-violet-500/15' },
  { id: 'meals', label: 'Meals', icon: UtensilsCrossed, color: 'text-rose-400 bg-rose-500/15' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-emerald-400 bg-emerald-500/15' },
];

interface Expense { id: number; date: string; category: string; description: string; amount: number; }

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: '2026-01-24', category: 'fuel', description: 'Shell - Diesel 85 gal', amount: 342.15 },
    { id: 2, date: '2026-01-23', category: 'meals', description: 'Cracker Barrel - Dinner', amount: 18.50 },
    { id: 3, date: '2026-01-22', category: 'maintenance', description: 'Oil change + filter', amount: 89.99 },
    { id: 4, date: '2026-01-22', category: 'tolls', description: 'I-40 Toll', amount: 4.50 },
    { id: 5, date: '2026-01-21', category: 'parking', description: 'Overnight parking - Pilot', amount: 15.00 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'fuel', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const filtered = filterCat ? expenses.filter(e => e.category === filterCat) : expenses;
  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const catTotals = CATEGORIES.map(c => ({
    ...c,
    total: expenses.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0),
  }));

  const addExpense = () => {
    if (!form.amount || !form.description) return;
    setExpenses(prev => [{ id: Date.now(), date: form.date, category: form.category, description: form.description, amount: parseFloat(form.amount) }, ...prev]);
    setForm({ category: 'fuel', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const del = (id: number) => setExpenses(prev => prev.filter(e => e.id !== id));

  const exportCSV = () => {
    const header = 'Date,Category,Description,Amount\n';
    const rows = filtered.map(e => `${e.date},${e.category},${e.description},$${e.amount.toFixed(2)}`).join('\n');
    const blob = new Blob([header + rows + `\n\nTotal,,,${total.toFixed(2)}`], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/"><button className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all touch-target"><ArrowLeft className="size-5" /></button></Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Expense Tracker</h1>
          <p className="text-[11px] text-white/30">Track & export for tax time</p>
        </div>
        <button onClick={exportCSV} className="px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/40 text-[10px] font-medium hover:text-white hover:bg-white/[0.08] transition-all touch-target flex items-center gap-1">
          <Download className="size-3" /> CSV
        </button>
      </div>

      {/* Total */}
      <div className="glass-card p-5 text-center bg-emerald-500/5 border-emerald-500/15">
        <p className="text-[10px] text-emerald-300/50 uppercase tracking-wider mb-1">
          {filterCat ? CATEGORIES.find(c => c.id === filterCat)?.label : 'All'} Expenses
        </p>
        <p className="text-3xl font-black text-emerald-300">${total.toFixed(2)}</p>
        <p className="text-[10px] text-white/20 mt-1">{filtered.length} entries</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button onClick={() => setFilterCat(null)} className={`px-3 py-2 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all touch-target ${!filterCat ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25' : 'bg-white/[0.03] text-white/40 border border-white/[0.06]'}`}>
          All
        </button>
        {catTotals.map(c => {
          const Icon = c.icon;
          return (
            <button key={c.id} onClick={() => setFilterCat(filterCat === c.id ? null : c.id)}
              className={`px-3 py-2 rounded-lg text-[10px] font-medium whitespace-nowrap flex items-center gap-1.5 transition-all touch-target ${filterCat === c.id ? `${c.color} border border-current/25` : 'bg-white/[0.03] text-white/40 border border-white/[0.06]'}`}>
              <Icon className="size-3" /> {c.label} <span className="opacity-60">${c.total.toFixed(0)}</span>
            </button>
          );
        })}
      </div>

      {/* Add */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity touch-target">
          <Plus className="size-4" /> Add Expense
        </button>
      ) : (
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-sm font-bold text-white">New Expense</h3>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              return (
                <button key={c.id} onClick={() => setForm(p => ({...p, category: c.id}))}
                  className={`px-3 py-2 rounded-lg text-[10px] font-medium whitespace-nowrap flex items-center gap-1.5 touch-target ${form.category === c.id ? `${c.color} border border-current/25` : 'bg-white/[0.03] text-white/40 border border-white/[0.06]'}`}>
                  <Icon className="size-3" /> {c.label}
                </button>
              );
            })}
          </div>
          <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} className="w-full h-11 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-emerald-500/30" />
          <input placeholder="Description" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="w-full h-11 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30" />
          <input type="number" step="0.01" placeholder="Amount ($)" value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))} className="w-full h-11 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30" />
          <div className="flex gap-2">
            <button onClick={addExpense} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs touch-target">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/50 text-xs touch-target">Cancel</button>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="space-y-2">
        {filtered.map(exp => {
          const cat = CATEGORIES.find(c => c.id === exp.category)!;
          const Icon = cat.icon;
          return (
            <div key={exp.id} className="glass-card p-3 flex items-center gap-3">
              <div className={`size-10 rounded-lg ${cat.color} flex items-center justify-center shrink-0`}>
                <Icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{exp.description}</p>
                <p className="text-[10px] text-white/30">{exp.date} • {cat.label}</p>
              </div>
              <p className="text-sm font-bold text-white shrink-0">${exp.amount.toFixed(2)}</p>
              <button onClick={() => del(exp.id)} className="size-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
