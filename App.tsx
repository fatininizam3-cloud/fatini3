
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { geminiService } from './services/geminiService';
import { Message, DashboardData } from './types';
import { ChartRenderer } from './components/ChartRenderer';

const DEFAULT_CSV = `objectid,kategori,komponen,zon,kod_negeri,negeri,rancangan_tempatan
1,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTJ Pasir Putih
2,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTMD Ketereh
3,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTJ Tumpat
... (data dipendekkan untuk kebersihan kod) ...
357,Mitigasi Tidak Berstruktur (MTB),"Tanah Mendap, Lubang Benam / Runtuhan Batu (MTB)",Zon Selatan,4,MELAKA,RTMP Jasin`;

const parseCSV = (csv: string) => {
  const lines = csv.split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj: any, header, i) => {
      obj[header.trim()] = values[i]?.trim();
      return obj;
    }, {});
  }).filter(r => r.objectid);
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeData] = useState<DashboardData | null>({
    name: 'Integrated_System_Data.csv',
    content: DEFAULT_CSV,
    type: 'csv',
    uploadedAt: new Date()
  });

  const parsedRecords = useMemo(() => activeData ? parseCSV(activeData.content) : [], [activeData]);

  const fullContent = useMemo(() => {
    if (parsedRecords.length === 0) return "";
    const headers = Object.keys(parsedRecords[0]).join(',');
    const body = parsedRecords.map(r => Object.values(r).join(',')).join('\n');
    return headers + '\n' + body;
  }, [parsedRecords]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await geminiService.analyzeData(inputText, fullContent, messages);
      const chartRegex = /```json_chart\s*([\s\S]*?)\s*```/;
      const match = response.match(chartRegex);
      let cleanText = response;
      let chartData = undefined;

      if (match) {
        try {
          chartData = JSON.parse(match[1]);
          cleanText = response.replace(chartRegex, '').trim();
        } catch (e) {
          console.error("Chart Parse Error:", e);
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanText,
        timestamp: new Date(),
        chartData
      }]);
    } catch (error) {
      console.error("Analysis Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "MAAF, SISTEM MENGALAMI RALAT. PASTIKAN API KEY ANDA SAH DAN TIADA MASALAH RANGKAIAN.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-emerald-50 font-sans overflow-hidden">
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/20 p-4 z-20 sticky top-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none">InsightAgent Pro</h1>
              <p className="text-[8px] text-emerald-500/50 font-bold uppercase tracking-widest mt-1">Data Analyst & Code Fixer</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={clearChat} className="px-3 py-1.5 bg-slate-900 border border-emerald-900/30 text-[10px] font-black uppercase text-emerald-500/60 hover:text-emerald-400 rounded-lg transition-all">
               Clear Session
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900/50 custom-scrollbar flex flex-col items-center">
        <div className="max-w-4xl w-full flex-1 flex flex-col gap-6 pb-32">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 animate-in fade-in duration-700">
               <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-4">Neural Core Active</h2>
               <p className="text-emerald-500/40 text-xs font-bold uppercase tracking-widest max-w-md">
                 Sila masukkan data untuk dianalisis atau tampal log ralat Vercel anda untuk bantuan pembaikan kod segera.
               </p>
               <div className="mt-10 flex flex-wrap justify-center gap-2">
                  {[
                    "Analisis risiko mengikut negeri",
                    "Kenapa build Vercel saya gagal?",
                    "Bandingkan zon Timur dan Utara",
                    "Betulkan coding ralat import"
                  ].map(q => (
                    <button key={q} onClick={() => setInputText(q)} className="px-4 py-2 rounded-full bg-slate-950 border border-emerald-900/20 text-[9px] font-bold uppercase tracking-widest text-emerald-500/50 hover:border-emerald-500/50 transition-all">
                      {q}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] px-5 py-4 rounded-2xl ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-950 border border-emerald-900/30 text-emerald-50 rounded-tl-none shadow-xl'}`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{m.content}</div>
                {m.chartData && (
                  <div className="mt-6 pt-6 border-t border-emerald-500/10">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-4">{m.chartData.title}</h4>
                    <div className="h-64 w-full"><ChartRenderer chart={m.chartData} /></div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 items-center bg-slate-950/50 px-4 py-2 rounded-full w-fit border border-emerald-900/20">
               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
               <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/50">Processing Neural Link...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder="Tanya tentang data atau ralat coding..." 
              className="w-full pl-6 pr-32 py-4 bg-slate-900/90 border border-emerald-900/40 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-emerald-50 text-sm outline-none backdrop-blur-md" 
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isLoading} 
              className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              {isLoading ? 'Wait' : 'Process'}
            </button>
          </form>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #064e3b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
