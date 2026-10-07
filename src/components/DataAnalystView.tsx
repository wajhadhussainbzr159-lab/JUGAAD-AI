import React, { useState } from 'react';
import { 
  BarChart3, 
  Upload, 
  FileSpreadsheet, 
  TrendingUp, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { analyzeData } from '../lib/api';
import { MarkdownView } from './MarkdownView';

export const DataAnalystView: React.FC = () => {
  const sampleDatasets = [
    {
      name: 'E-Commerce 2026 Sales & Margins',
      rows: 120,
      columns: ['Product', 'UnitsSold', 'Revenue_USD', 'Cost_USD', 'Margin_Pct'],
      preview: [
        { Product: 'Jugaad AI Pro Plan', UnitsSold: 1420, Revenue_USD: 28400, Cost_USD: 3100, Margin_Pct: '89.1%' },
        { Product: 'Cloud Agent API Pack', UnitsSold: 980, Revenue_USD: 19600, Cost_USD: 2400, Margin_Pct: '87.7%' },
        { Product: 'Dev Workspace Addon', UnitsSold: 640, Revenue_USD: 9600, Cost_USD: 1200, Margin_Pct: '87.5%' },
        { Product: 'Student Academic Pass', UnitsSold: 2100, Revenue_USD: 10500, Cost_USD: 1100, Margin_Pct: '89.5%' }
      ]
    },
    {
      name: 'SaaS Startup Burn Rate & Runway',
      rows: 64,
      columns: ['Month', 'MRR_USD', 'Burn_USD', 'Headcount', 'CAC_USD'],
      preview: [
        { Month: 'Jan 2026', MRR_USD: 12500, Burn_USD: 4200, Headcount: 4, CAC_USD: 24 },
        { Month: 'Feb 2026', MRR_USD: 16800, Burn_USD: 4600, Headcount: 4, CAC_USD: 21 },
        { Month: 'Mar 2026', MRR_USD: 24200, Burn_USD: 5100, Headcount: 5, CAC_USD: 19 },
        { Month: 'Apr 2026', MRR_USD: 33100, Burn_USD: 5800, Headcount: 6, CAC_USD: 17 }
      ]
    }
  ];

  const [selectedDataset, setSelectedDataset] = useState(sampleDatasets[0]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('Analyze margins, pinpoint top growth drivers, and suggest low-cost optimization.');

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await analyzeData(
        JSON.stringify(selectedDataset.preview, null, 2),
        selectedDataset.name,
        userQuery
      );
      setAnalysisResult(res.analysis);
    } catch (err: any) {
      console.error('Data analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n').filter(l => l.trim().length > 0);
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1, 6).map(line => {
          const vals = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
          return obj;
        });

        const custom = {
          name: file.name,
          rows: lines.length - 1,
          columns: headers,
          preview: rows
        };
        setSelectedDataset(custom);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>DATA ANALYST & METRICS STUDIO</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-100">
          Intelligent Spreadsheet & CSV Analysis
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Upload datasets, visualize key metrics, detect anomalies, and uncover high-ROI actionable Jugaad business insights.
        </p>
      </div>

      {/* Dataset Selector / Upload Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0f1420] border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Datasets:</span>
            {sampleDatasets.map((ds, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDataset(ds)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedDataset.name === ds.name
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {ds.name}
              </button>
            ))}
          </div>

          {/* File Upload Button */}
          <label className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-xs text-slate-300 hover:text-rose-300 transition">
            <Upload className="w-3.5 h-3.5 text-rose-400" />
            <span>Upload CSV File</span>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleCustomFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Data Table Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-rose-400" />
              <span>{selectedDataset.name}</span>
            </span>
            <span>{selectedDataset.columns.length} Columns • {selectedDataset.rows} Rows</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/90 text-rose-300 font-semibold border-b border-slate-700">
                <tr>
                  {selectedDataset.columns.map((c, i) => (
                    <th key={i} className="p-2.5 px-3">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {selectedDataset.preview.map((row: any, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/30 transition">
                    {selectedDataset.columns.map((col, cIdx) => (
                      <td key={cIdx} className="p-2.5 px-3 text-slate-300 font-mono">
                        {String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple Interactive SVG Metric Chart */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-slate-200">Visual Growth Breakdown</span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Positive Margin Velocity
            </span>
          </div>

          {/* Render responsive SVG Bar representation */}
          <div className="h-28 flex items-end justify-between gap-3 pt-4 px-2">
            {[45, 68, 85, 98, 72].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full bg-gradient-to-t from-rose-600 to-amber-500 rounded-t-lg transition-all duration-500 hover:brightness-125"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] font-mono text-slate-500">Q{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Query Input & Action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask anything about this dataset (e.g. Which product performed best?)"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60"
          />
          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/20 disabled:opacity-40 transition"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Analyzing...' : 'Generate Insights'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Output Card */}
      {analysisResult && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1420] border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-rose-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Data Analyst Executive Summary & Strategic Insights</span>
          </div>
          <MarkdownView content={analysisResult} />
        </div>
      )}
    </div>
  );
};
