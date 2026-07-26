import Link from 'next/link';
import { categories } from '@/data/products';

const catColors: Record<string, string> = {
  'Red': 'bg-red-50 border-red-100 text-red-700 hover:ring-red-400',
  'Pink': 'bg-pink-50 border-pink-100 text-pink-700 hover:ring-pink-400',
  'Blue': 'bg-blue-50 border-blue-100 text-blue-700 hover:ring-blue-400',
  'Yellow': 'bg-yellow-50 border-yellow-100 text-yellow-700 hover:ring-yellow-400',
  'Purple': 'bg-purple-50 border-purple-100 text-purple-700 hover:ring-purple-400',
  'Green': 'bg-green-50 border-green-100 text-green-700 hover:ring-green-400',
  'White': 'bg-slate-100 border-slate-200 text-slate-800 hover:ring-slate-400',
  'Multicolor': 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:ring-indigo-400',
  'Bundles': 'bg-slate-50 border-slate-200 text-slate-700 hover:ring-slate-400',
  'Individuals': 'bg-slate-50 border-slate-200 text-slate-700 hover:ring-slate-400'
};

const dotColors: Record<string, string> = {
  'Red': 'bg-red-500',
  'Pink': 'bg-pink-500',
  'Blue': 'bg-blue-500',
  'Yellow': 'bg-yellow-400',
  'Purple': 'bg-purple-500',
  'Green': 'bg-green-500',
  'White': 'bg-white border border-slate-300',
  'Multicolor': 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500',
};

export function Sidebar({ activeCategory = '' }: { activeCategory?: string }) {
  const colorCats = categories.filter(c => !['Bundles', 'Individuals'].includes(c));
  const packCats = categories.filter(c => ['Bundles', 'Individuals'].includes(c));

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 h-full min-h-[500px]">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Shop by Color</h3>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {colorCats.map(cat => {
            const isActive = activeCategory === cat;
            const style = catColors[cat] || 'bg-slate-50 border-slate-100 text-slate-700';
            const dot = dotColors[cat] || 'bg-slate-400';
            return (
              <Link key={cat} href={`/category/${cat}`}>
                <div className={`flex items-center gap-2 p-2 rounded-lg border text-sm font-semibold cursor-pointer transition-all ${style} ${isActive ? 'ring-2 ring-opacity-50' : ''}`}>
                  <div className={`w-3 h-3 rounded-full ${dot}`}></div> {cat}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Packs & Bundles</h3>
        <div className="flex flex-col gap-2">
          {packCats.map(cat => (
            <Link key={cat} href={`/category/${cat}`}>
              <div className={`p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold hover:border-slate-300 transition-colors ${activeCategory === cat ? 'ring-2 ring-slate-400' : ''}`}>
                {cat}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4 bg-indigo-50 rounded-xl border border-indigo-100">
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter mb-1">API Status</p>
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-700">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> AliExpress Sync Active
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-700 mt-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> PayPal Wallet Ready
        </div>
      </div>
    </aside>
  );
}
