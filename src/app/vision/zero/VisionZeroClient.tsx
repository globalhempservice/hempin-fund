'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SlideFrame from '@/components/SlideFrame';

export default function VisionZeroClient() {
  return (
    <SlideFrame title="Hemp’in — Vision Zero">
      <div className="relative h-full w-full overflow-hidden grid place-items-center">
        {/* Animated background gradients — behind & non-interactive */}
        <motion.div
          className="absolute inset-0 -z-10 pointer-events-none"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(16,185,129,.15), transparent 60%), radial-gradient(circle at 80% 70%, rgba(236,72,153,.15), transparent 60%), linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))',
            backgroundSize: '200% 200%',
          }}
        />

        {/* Centerpiece — above everything */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative z-10 text-center"
        >
          <motion.div
            className="absolute -inset-10 blur-3xl bg-gradient-to-r from-emerald-400/20 via-cyan-400/20 to-rose-400/20 rounded-full pointer-events-none -z-10"
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <h1 className="text-4xl md:text-6xl font-semibold">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-rose-300 bg-clip-text text-transparent">
              Hemp’in
            </span>
          </h1>
          <p className="text-sm md:text-base mt-3 opacity-80">
            The Living OS for a Regenerative World
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8 z-20">
            <Link
              href="/vision/one"
              className="px-4 py-2 rounded-full text-sm font-medium border border-white/20 bg-white/10 hover:bg-white/20 transition"
            >
              Begin Presentation →
            </Link>
            <a
              href="https://hempin.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:border-white/20 opacity-80 hover:opacity-100 transition"
            >
              Visit hempin.org ↗
            </a>
          </div>
        </motion.div>

        {/* Floating orbs — behind & non-interactive */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-300/40 pointer-events-none -z-10"
            initial={{
              x: Math.random() * 1200 - 600,
              y: Math.random() * 800 - 400,
              opacity: 0.4 + Math.random() * 0.6,
              scale: 0.6 + Math.random() * 0.4,
            }}
            animate={{
              y: ['+=20', '-=20'],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </SlideFrame>
  );
}