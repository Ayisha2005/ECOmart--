import React from 'react';
import { IndianRupee, Sparkles, Check, Edit3 } from 'lucide-react';

export const AISuggestedPrice = ({
  suggestedMin = 5000,
  suggestedMax = 7500,
  recommended = 6200,
  currentPrice,
  onAcceptSuggested,
  onCustomChange
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-xl p-4 text-white shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-lime-400" />
          <h4 className="font-extrabold text-sm text-emerald-300 uppercase tracking-wider">AI Market Price Analytics</h4>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
          India Recycling Index
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <p className="text-xs text-slate-400 font-semibold">Estimated Market Range</p>
          <p className="text-sm font-bold text-slate-200 mt-0.5">
            ₹{suggestedMin.toLocaleString('en-IN')} - ₹{suggestedMax.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-400 font-extrabold mt-1 flex items-center gap-1">
            Recommended: ₹{recommended.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          <button
            type="button"
            onClick={() => onAcceptSuggested && onAcceptSuggested(recommended)}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept Suggested ₹{recommended.toLocaleString('en-IN')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISuggestedPrice;
