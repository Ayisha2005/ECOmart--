import React, { useState, useRef } from 'react';
import { Cpu, Upload, Sparkles, CheckCircle2, RefreshCw, AlertCircle, Eye, Scale, Layers, Box, Sliders, Camera, Zap, ShieldCheck } from 'lucide-react';

const SAMPLE_AI_PRESETS = [
  {
    id: 'plastic-1',
    name: "PET Plastic Bottles Batch",
    category: "plastic",
    categoryLabel: "Plastic",
    weight: 250,
    unitCount: 520,
    volumeM3: 1.4,
    purity: 96,
    confidence: 97,
    condition: "Cleaned & Compressed Bales",
    suggestedPriceMin: 5500,
    suggestedPriceMax: 6800,
    recommendedPrice: 6200,
    pricePerKg: 24.8,
    breakdown: "PET Type-1 Polymer • 96% Clean Plastic, 4% Caps & Labels",
    img: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 'paper-1',
    name: "Corrugated Cardboard Boxes",
    category: "paper",
    categoryLabel: "Paper",
    weight: 400,
    unitCount: 180,
    volumeM3: 2.1,
    purity: 94,
    confidence: 94,
    condition: "Dry & Compressed Bales",
    suggestedPriceMin: 2800,
    suggestedPriceMax: 3500,
    recommendedPrice: 3100,
    pricePerKg: 7.75,
    breakdown: "Kraft Cardboard Fibre • 94% Dry Paper, 6% Moisture/Staples",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 'ewaste-1',
    name: "E-Waste Motherboards & Circuit Boards",
    category: "ewaste",
    categoryLabel: "E-Waste",
    weight: 85,
    unitCount: 110,
    volumeM3: 0.6,
    purity: 98,
    confidence: 98,
    condition: "Industrial Telecom Scrap",
    suggestedPriceMin: 22000,
    suggestedPriceMax: 26500,
    recommendedPrice: 24500,
    pricePerKg: 288.2,
    breakdown: "Gold & Copper Plated PCB • High-grade IC components",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 'metal-1',
    name: "Crushed Aluminum Cans",
    category: "metal",
    categoryLabel: "Metal",
    weight: 180,
    unitCount: 950,
    volumeM3: 0.9,
    purity: 92,
    confidence: 95,
    condition: "Sorted UBC Scrap",
    suggestedPriceMin: 16000,
    suggestedPriceMax: 19500,
    recommendedPrice: 17800,
    pricePerKg: 98.8,
    breakdown: "Alloy 3004 Aluminum • 92% Metal, 8% Paint Coatings",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80"
  }
];

export const AIWasteScanner = ({ onApplyAiResult }) => {
  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_AI_PRESETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [customImageName, setCustomImageName] = useState('');
  const [editedWeight, setEditedWeight] = useState(null);
  const [applied, setApplied] = useState(false);
  const fileInputRef = useRef(null);

  const scanSteps = [
    "Scanning Specimen Contour & Material Matrix...",
    "Calculating Volume (m³), Unit Density & Weight...",
    "Assessing Purity Grade & Contamination %...",
    "Cross-referencing India Recycling Market Rates..."
  ];

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomImage(imageUrl);
      setCustomImageName(file.name);
      setScanResult(null);
      setApplied(false);
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setScanStep(0);
    setScanResult(null);
    setApplied(false);

    let stepCounter = 0;
    const interval = setInterval(() => {
      stepCounter++;
      if (stepCounter < scanSteps.length) {
        setScanStep(stepCounter);
      } else {
        clearInterval(interval);
        setIsScanning(false);

        // Derive result based on custom image or selected preset
        const base = selectedPreset;
        const currentWeight = editedWeight !== null ? editedWeight : base.weight;
        const recPrice = Math.round(currentWeight * base.pricePerKg);

        const result = {
          ...base,
          name: customImage ? `Custom Scrap: ${customImageName.replace(/\.[^/.]+$/, "")}` : base.name,
          weight: currentWeight,
          recommendedPrice: recPrice,
          suggestedPriceMin: Math.round(recPrice * 0.9),
          suggestedPriceMax: Math.round(recPrice * 1.15),
          image: customImage || base.img,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setScanResult(result);
        if (onApplyAiResult) {
          onApplyAiResult(result);
          setApplied(true);
        }
      }
    }, 500);
  };

  const handleWeightAdjust = (delta) => {
    if (!scanResult) return;
    const newWeight = Math.max(10, scanResult.weight + delta);
    const newPrice = Math.round(newWeight * scanResult.pricePerKg);
    const updated = {
      ...scanResult,
      weight: newWeight,
      unitCount: Math.round((newWeight / scanResult.weight) * scanResult.unitCount),
      volumeM3: Number(((newWeight / scanResult.weight) * scanResult.volumeM3).toFixed(2)),
      recommendedPrice: newPrice,
      suggestedPriceMin: Math.round(newPrice * 0.9),
      suggestedPriceMax: Math.round(newPrice * 1.15)
    };
    setEditedWeight(newWeight);
    setScanResult(updated);
    if (onApplyAiResult) {
      onApplyAiResult(updated);
    }
  };

  const handleApplyToForm = () => {
    if (scanResult && onApplyAiResult) {
      onApplyAiResult(scanResult);
      setApplied(true);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40 shadow-inner">
            <Box className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-white tracking-wide">Create Scrap Listing</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Enter your product details manually and upload a photo of your scrap material.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Manual Product Listing</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preset / Custom Image Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                1. Select Specimen or Upload Photo
              </label>
              {customImage && (
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Custom Image Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_AI_PRESETS.map((preset) => {
                const isSelected = !customImage && selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setCustomImage(null);
                      setCustomImageName('');
                      setSelectedPreset(preset);
                      setEditedWeight(null);
                      setScanResult(null);
                      setApplied(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-950/50 text-emerald-300 ring-2 ring-emerald-500/30 shadow-lg'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <img src={preset.img} alt={preset.name} className="w-11 h-11 rounded-lg object-cover border border-slate-700 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold truncate text-white">{preset.categoryLabel}</p>
                      <p className="text-[10px] text-slate-400 truncate">{preset.name}</p>
                      <span className="text-[10px] font-bold text-emerald-400">~{preset.weight} kg</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Image Thumbnail */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-36 bg-slate-950 group">
            <img
              src={customImage || selectedPreset.img}
              alt="Specimen preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
              <span className="bg-slate-900/90 text-slate-200 px-2.5 py-1 rounded-lg font-bold backdrop-blur-xs border border-slate-700 text-[11px] truncate">
                {customImage ? `📷 ${customImageName}` : selectedPreset.name}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
                {selectedPreset.categoryLabel}
              </span>
            </div>
          </div>

          {/* Run Scan Button */}
          <button
            type="button"
            onClick={handleStartScan}
            disabled={isScanning}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                <span>Analyzing Specimen with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Run AI Vision Scanner & Quantity Predictor</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis & Quantity Output Card */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between relative min-h-[320px]">
          {/* Scanning Overlay Animation */}
          {isScanning && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center z-20 gap-4 p-6 rounded-2xl">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                <Zap className="w-7 h-7 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="text-center space-y-1 max-w-xs">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-wider animate-pulse">
                  {scanSteps[scanStep]}
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {scanResult ? (
            <div className="space-y-4">
              {/* Header Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 tracking-wide">
                    AI Vision Analysis Complete
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400">
                    Confidence: <strong className="text-emerald-400">{scanResult.confidence}%</strong>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{scanResult.timestamp}</span>
                </div>
              </div>

              {/* Main Quantity Banner */}
              <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Predicted Weight (Quantity)</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-white">{scanResult.weight}</span>
                    <span className="text-lg font-bold text-emerald-400">KG</span>
                    <span className="text-xs text-slate-400">({(scanResult.weight / 1000).toFixed(2)} Metric Tons)</span>
                  </div>
                </div>

                {/* Interactive Quantity Adjuster */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Fine-Tune Weight</span>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleWeightAdjust(-10)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      -10kg
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWeightAdjust(10)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      +10kg
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-extrabold mb-1">
                    <Box className="w-3 h-3 text-emerald-400" />
                    <span>Est. Units</span>
                  </div>
                  <p className="font-extrabold text-white text-sm">~{scanResult.unitCount} items</p>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-extrabold mb-1">
                    <Layers className="w-3 h-3 text-teal-400" />
                    <span>Volume</span>
                  </div>
                  <p className="font-extrabold text-white text-sm">{scanResult.volumeM3} m³</p>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-extrabold mb-1">
                    <ShieldCheck className="w-3 h-3 text-lime-400" />
                    <span>Purity Grade</span>
                  </div>
                  <p className="font-extrabold text-emerald-400 text-sm">{scanResult.purity}% Pure</p>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-extrabold mb-1">
                    <Sliders className="w-3 h-3 text-emerald-400" />
                    <span>Market Rate</span>
                  </div>
                  <p className="font-extrabold text-lime-400 text-sm">₹{scanResult.pricePerKg}/kg</p>
                </div>
              </div>

              {/* Material Breakdown & Pricing */}
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Material & Condition Profile</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">{scanResult.breakdown}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Predicted Total Price</p>
                  <p className="text-base font-black text-lime-400">₹{scanResult.recommendedPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Apply / Auto-fill button bar */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Values automatically synced to listing form below</span>
                </p>

                <button
                  type="button"
                  onClick={handleApplyToForm}
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                    applied
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{applied ? 'Applied to Form' : 'Auto-Fill Form'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 min-h-[260px]">
              <div className="p-4 bg-slate-900 rounded-full border border-slate-800 mb-3">
                <Eye className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-sm font-bold text-slate-300">No Scan Results Yet</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Select a sample waste specimen or upload your photo, then click <strong>"Run AI Vision Scanner"</strong> to analyze quantity and weight.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWasteScanner;

