'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import SlideFrame from '@/components/SlideFrame';
import Link from 'next/link';

export default function VisionThreeClient() {
  const [mode, setMode] = useState<'LIFE' | 'WORK'>('LIFE');
  const toggleMode = () => setMode(mode === 'LIFE' ? 'WORK' : 'LIFE');

  const leftItems = ['Knowledge', 'Fund', 'Market', 'Places'];
  const rightItems = ['Knowledge', 'Fund', 'Market', 'Places'];

  return (
    <SlideFrame title="Hemp’in — Vision (3/3)">
      <div className="h-full w-full p-10 grid grid-rows-[auto_1fr_auto]">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/vision/two" className="text-sm opacity-80 hover:opacity-100 transition">
            ← Back
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            The Ultimate Hemp’in Experience
          </h1>
          <div className="text-sm opacity-80">Next →</div>
        </header>

        {/* Body */}
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-8 mt-8">
          {/* Left panel */}
          <motion.div
            key="left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-4 text-right pr-6"
          >
            <h2 className="text-lg font-semibold">
              When in <span className="text-emerald-400">Life</span>
            </h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Explore, learn, and connect through community stories, wellness products, and local places.
            </p>
            <ul className="space-y-2">
              {leftItems.map((label) => (
                <li key={label} className="text-sm opacity-90">
                  + {label}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Center mockup */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-[320px] h-[600px] rounded-[36px] border border-white/10 bg-gradient-to-b from-black/60 to-black/30 backdrop-blur-md shadow-[0_0_40px_rgba(56,189,248,0.2)] overflow-hidden flex flex-col justify-between items-center"
          >
            <div className="mt-4 w-24 h-2 rounded-full bg-white/10" />

            <div className="flex-1 grid grid-cols-2 gap-10 items-center justify-center">
              {mode === 'LIFE' && (
                <div className="flex flex-col items-center justify-center space-y-6">
                  {leftItems.map((label, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="h-10 w-10 rounded-full border border-emerald-400/40 bg-emerald-400/10 grid place-items-center text-[11px] opacity-90 shadow-[0_0_20px_rgba(16,185,129,.25)]"
                    >
                      {label[0]}
                    </motion.div>
                  ))}
                </div>
              )}
              {mode === 'WORK' && (
                <div className="flex flex-col items-center justify-center space-y-6">
                  {rightItems.map((label, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="h-10 w-10 rounded-full border border-cyan-400/40 bg-cyan-400/10 grid place-items-center text-[11px] opacity-90 shadow-[0_0_20px_rgba(56,189,248,.25)]"
                    >
                      {label[0]}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="pb-5 grid grid-cols-5 gap-3 place-items-center">
              <BottomIcon label="Profile" />
              <BottomIcon label="Inbox" />
              <motion.button
                onClick={toggleMode}
                whileTap={{ scale: 0.9 }}
                className={`px-4 py-1 rounded-full text-xs font-medium border transition-all duration-500 ${
                  mode === 'LIFE'
                    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                    : 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                }`}
              >
                {mode === 'LIFE' ? 'LIFE → WORK' : 'WORK → LIFE'}
              </motion.button>
              <BottomIcon label="Wallet" />
              <BottomIcon label="?" />
            </div>
          </motion.div>

          {/* Right panel */}
          <motion.div
            key="right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-4 pl-6"
          >
            <h2 className="text-lg font-semibold">
              When in <span className="text-cyan-400">Work</span>
            </h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Manage, publish, and fund hemp projects. Access research, marketplace data, and verified profiles.
            </p>
            <ul className="space-y-2">
              {rightItems.map((label) => (
                <li key={label} className="text-sm opacity-90">
                  {label} +
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between pt-4">
          <div className="text-xs opacity-80">
            hempin.org • life/work switch • unified intelligence
          </div>
          <div className="text-xs opacity-70">Slide 3 / 3</div>
        </footer>
      </div>
    </SlideFrame>
  );
}

/* Components */
function BottomIcon({ label }: { label: string }) {
  return (
    <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 grid place-items-center text-[10px] opacity-80 hover:opacity-100 transition">
      {label[0]}
    </div>
  );
}