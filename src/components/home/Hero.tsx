'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogoSymbol } from '@/components/brand/Logo';

interface HeroCounter {
  value: string;
  label: string;
}

interface HeroProps {
  counters: HeroCounter[];
}

/**
 * Hero éditorial premium.
 * - Typo Fraunces généreuse pour le titre
 * - Logo constellation animé en pulsation discrète
 * - 4 compteurs de réassurance dynamiques
 */
export function Hero({ counters }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Colonne gauche — texte */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="label-mark">
                Conseil · Solutions · Formations en IA
              </span>

              <h1 className="mt-6 font-serif text-5xl md:text-6xl lg:text-7xl font-normal leading-tight-extra tracking-tighter-2 text-sepia">
                De l'idée à <em className="italic text-or-fonce">l'impact.</em>
              </h1>

              <p className="mt-8 max-w-xl font-sans text-lg md:text-xl leading-relaxed text-pierre">
                Qwestinum conçoit et déploie des solutions d'intelligence artificielle qui transforment réellement les organisations — sans hype, sans jargon, avec des résultats mesurables.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/#contact" className="btn-primary">
                  Diagnostic IA gratuit
                </Link>
                <Link href="/cas-usage" className="btn-secondary">
                  Voir nos cas d'usage
                </Link>
              </div>
            </motion.div>

            {/* Compteurs */}
            <motion.div
              className="mt-14 pt-10 border-t border-perle grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            >
              {counters.map((counter) => (
                <div key={counter.label}>
                  <div className="font-serif text-3xl md:text-4xl font-medium tracking-tight-1 text-sepia">
                    {counter.value}
                  </div>
                  <div className="mt-2 font-sans text-xs text-pierre uppercase tracking-wide-1">
                    {counter.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Colonne droite — constellation animée */}
          <motion.div
            className="lg:col-span-5 hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 1, 0, -1, 0] }}
                transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
              >
                <LogoSymbol className="w-80 h-80 xl:w-96 xl:h-96" />
              </motion.div>

              {/* Halo doré très discret derrière */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 blur-3xl opacity-30"
                style={{
                  background:
                    'radial-gradient(circle at center, #F4D35E 0%, transparent 65%)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}