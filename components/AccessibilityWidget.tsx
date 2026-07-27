'use client';

import { useState, useEffect } from 'react';
import { Accessibility, Plus, Minus, RotateCcw } from 'lucide-react';

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * fontScale}px`;
  }, [fontScale]);

  useEffect(() => {
    document.body.classList.toggle('a11y-high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.toggle('a11y-underline-links', underlineLinks);
  }, [underlineLinks]);

  const reset = () => {
    setFontScale(1);
    setHighContrast(false);
    setUnderlineLinks(false);
  };

  return (
    <>
      <style>{`
        body.a11y-high-contrast {
          filter: invert(1) hue-rotate(180deg);
        }
        body.a11y-high-contrast img,
        body.a11y-high-contrast video {
          filter: invert(1) hue-rotate(180deg);
        }
        body.a11y-underline-links a {
          text-decoration: underline !important;
        }
      `}</style>

      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Accessibility options"
        aria-expanded={open}
        className="fixed bottom-8 left-8 z-50 w-12 h-12 rounded-full bg-slate-800/40 hover:bg-slate-800/70 text-white flex items-center justify-center shadow-lg backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Accessibility settings"
          className="fixed bottom-24 left-8 z-50 w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-4 flex flex-col gap-4"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Text Size</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontScale(prev => Math.max(0.85, Number((prev - 0.1).toFixed(2))))}
                aria-label="Decrease text size"
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-slate-600 w-12 text-center">{Math.round(fontScale * 100)}%</span>
              <button
                onClick={() => setFontScale(prev => Math.min(1.4, Number((prev + 0.1).toFixed(2))))}
                aria-label="Increase text size"
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <label className="flex items-center justify-between text-sm font-semibold text-slate-600 cursor-pointer">
            High Contrast
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="w-5 h-5 accent-pink-500"
            />
          </label>

          <label className="flex items-center justify-between text-sm font-semibold text-slate-600 cursor-pointer">
            Underline Links
            <input
              type="checkbox"
              checked={underlineLinks}
              onChange={(e) => setUnderlineLinks(e.target.checked)}
              className="w-5 h-5 accent-pink-500"
            />
          </label>

          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 mt-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      )}
    </>
  );
}