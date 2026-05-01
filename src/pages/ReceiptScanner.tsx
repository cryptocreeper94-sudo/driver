import { useState, useRef } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft, Camera, Upload, ScanLine, Loader2, RotateCcw,
  Check, Store, Calendar, DollarSign, Receipt, FileText
} from 'lucide-react';

interface ReceiptData {
  merchant: string;
  date: string;
  items: { name: string; price: number }[];
  tax: number;
  total: number;
}

export default function ReceiptScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<ReceiptData | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedReceipts, setSavedReceipts] = useState<(ReceiptData & { id: number; imageUrl: string })[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const scanReceipt = async () => {
    if (!image) return;
    setScanning(true);
    setError(null);

    try {
      // Client-side OCR with Tesseract.js
      const Tesseract = await import('tesseract.js');
      const { data } = await Tesseract.recognize(image, 'eng');
      const text = data.text;

      // Parse OCR text into structured receipt data
      const lines = text.split('\n').filter((l: string) => l.trim());
      const merchant = lines[0] || 'Unknown Merchant';

      // Try to find a date
      const dateMatch = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/);
      const date = dateMatch ? dateMatch[0] : new Date().toLocaleDateString();

      // Try to find dollar amounts
      const priceRegex = /\$?\d+\.\d{2}/g;
      const prices = (text.match(priceRegex) || []).map((p: string) => parseFloat(p.replace('$', '')));

      // Last price is usually total, second-to-last is tax
      const total = prices.length > 0 ? prices[prices.length - 1] : 0;
      const tax = prices.length > 1 ? prices[prices.length - 2] : 0;

      // Middle prices are items
      const itemPrices = prices.slice(0, Math.max(0, prices.length - 2));
      const items = itemPrices.map((p: number, i: number) => ({
        name: `Item ${i + 1}`,
        price: p,
      }));

      setResult({ merchant: merchant.trim(), date, items, tax, total });
    } catch {
      setError('Could not read the receipt. Try a clearer photo.');
    }
    setScanning(false);
  };

  const saveReceipt = () => {
    if (!result || !image) return;
    setSavedReceipts((prev) => [
      { ...result, id: Date.now(), imageUrl: image },
      ...prev,
    ]);
    setImage(null);
    setResult(null);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

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
          <h1 className="text-lg font-bold text-white">Receipt Scanner</h1>
          <p className="text-[11px] text-white/30">AI-powered OCR * Tesseract.js</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleUpload}
      />

      {/* Upload Area */}
      {!image && (
        <div className="glass-card p-6 text-center space-y-4">
          <div className="size-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto">
            <ScanLine className="size-8 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Scan any receipt</h3>
            <p className="text-[11px] text-white/30">
              Take a photo or upload an image  -  our AI will extract merchant, items, totals & tax
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity touch-target"
            >
              <Camera className="size-4" />
              Take Photo
            </button>
            <button
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.removeAttribute('capture');
                  inputRef.current.click();
                  inputRef.current.setAttribute('capture', 'environment');
                }
              }}
              className="flex-1 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/60 font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/[0.08] transition-all touch-target"
            >
              <Upload className="size-4" />
              Upload
            </button>
          </div>
        </div>
      )}

      {/* Image Preview + Scan */}
      {image && !result && (
        <div className="glass-card p-4 space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-white/[0.08]">
            <img src={image} alt="Receipt" className="w-full object-contain max-h-[350px] bg-black/20" />
            <button
              onClick={reset}
              className="absolute top-2 right-2 size-8 rounded-lg bg-black/60 backdrop-blur-sm text-white/60 hover:text-white flex items-center justify-center transition-colors"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
              {error}
              <button onClick={scanReceipt} className="ml-2 underline hover:no-underline">Try Again</button>
            </div>
          )}

          {!error && (
            <button
              onClick={scanReceipt}
              disabled={scanning}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 touch-target"
            >
              {scanning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <ScanLine className="size-4" />
                  Scan Receipt
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="glass-card overflow-hidden">
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Check className="size-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-300">Receipt Scanned</p>
              <p className="text-[10px] text-white/30">Extracted via on-device AI</p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-white/30 flex items-center gap-1"><Store className="size-3" /> Merchant</p>
                <p className="text-xs font-medium text-white mt-1">{result.merchant}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-white/30 flex items-center gap-1"><Calendar className="size-3" /> Date</p>
                <p className="text-xs font-medium text-white mt-1">{result.date}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-white/30 flex items-center gap-1"><Receipt className="size-3" /> Tax</p>
                <p className="text-xs font-medium text-white mt-1">${result.tax.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <p className="text-[10px] text-emerald-300/50 flex items-center gap-1"><DollarSign className="size-3" /> Total</p>
                <p className="text-sm font-bold text-emerald-300 mt-1">${result.total.toFixed(2)}</p>
              </div>
            </div>

            {result.items.length > 0 && (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <p className="text-[10px] text-white/30 mb-2">Items Found</p>
                {result.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-white/[0.03] last:border-0">
                    <span className="text-white/50">{item.name}</span>
                    <span className="text-white/70 font-medium">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={saveReceipt}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity touch-target"
              >
                <FileText className="size-3.5" />
                Save to Expenses
              </button>
              <button
                onClick={reset}
                className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/50 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/[0.08] transition-all touch-target"
              >
                <ScanLine className="size-3.5" />
                Scan Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Receipts */}
      {savedReceipts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Saved Receipts</h3>
          {savedReceipts.map((r) => (
            <div key={r.id} className="glass-card p-3 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                <Receipt className="size-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{r.merchant}</p>
                <p className="text-[10px] text-white/30">{r.date}</p>
              </div>
              <p className="text-sm font-bold text-emerald-300">${r.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
