'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeroCounter {
  value: string;
  label: string;
}

interface HeroProps {
  counters: HeroCounter[];
}

/**
 * Hero éditorial — voix Revue.
 * Manchette tabulaire en haut, titre pleine largeur Fraunces, chapeau 2 colonnes
 * signé Imad Belfaqir. Compteurs déplacés dans une bande "État des lieux"
 * séparée du titre, façon ours de revue.
 */
export function Hero({ counters }: HeroProps) {
  // Date courante en français — affichée dans la manchette
  const now = new Date();
  const dateLabel = now
    .toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();

  return (
    <section className="relative">
      <div className="container-page">

        {/* Manchette — bande tabulaire en haut */}
        <div className="pt-8 md:pt-10 pb-3">
          <div
            className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-pierre"
            style={{ fontFamily: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }}
          >
            <span className="text-sepia font-semibold">QWESTINUM — Édition n° 04</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Dossier · Process First</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Mis à jour le {dateLabel}</span>
          </div>
        </div>

        {/* Filet sépia 30% qui ouvre la une */}
        <div
          aria-hidden="true"
          className="h-px w-full"
          style={{ backgroundColor: 'rgba(42, 39, 36, 0.30)' }}
        />

        {/* Bloc principal — titre éditorial */}
        <div className="pt-10 md:pt-16 pb-12 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Numéro de section façon roman */}
            <div
              className="mb-6 md:mb-8 font-serif italic text-pierre opacity-60"
              style={{ fontSize: '15px', letterSpacing: '0.05em' }}
            >
              I — Manifeste
            </div>

            {/* Titre éditorial pleine largeur, deux phrases en cascade */}
            <h1 className="font-serif font-normal text-sepia">
              <span className="block text-[44px] md:text-[80px] lg:text-[104px] xl:text-[120px] leading-[0.92] tracking-[-0.025em]">
                L&apos;intelligence
              </span>
              <span className="block mt-1 md:mt-2 text-[44px] md:text-[80px] lg:text-[104px] xl:text-[120px] leading-[0.92] tracking-[-0.025em]">
                artificielle suit
              </span>
              <span className="block mt-1 md:mt-2 text-[44px] md:text-[80px] lg:text-[104px] xl:text-[120px] leading-[0.92] tracking-[-0.025em]">
                <em className="italic text-or-fonce">le processus,</em>
              </span>
              <span className="block mt-1 md:mt-2 text-[44px] md:text-[80px] lg:text-[104px] xl:text-[120px] leading-[0.92] tracking-[-0.025em]">
                jamais l&apos;inverse.
              </span>
            </h1>
          </motion.div>

          {/* Chapeau — 2 colonnes éditoriales avec signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start"
          >
            {/* Drop-cap + chapeau */}
            <div className="md:col-span-8 md:col-start-2">
              <p className="font-serif text-sepia leading-[1.55] text-[18px] md:text-[20px]">
                <span
                  className="float-left mr-3 mt-1 font-serif font-medium text-or-fonce"
                  style={{
                    fontSize: '5.2em',
                    lineHeight: '0.85',
                    paddingTop: '0.05em',
                  }}
                >
                  C
                </span>
                hronique d&apos;une discipline d&apos;ingénierie appliquée à
                l&apos;IA. Nous accompagnons les organisations qui veulent
                industrialiser leurs usages sans renoncer à la rigueur de leurs
                opérations — en partant du processus, jamais de la technologie.
              </p>

              {/* Signature italique */}
              <div className="mt-8 flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="block h-px w-8"
                  style={{ backgroundColor: 'rgba(42, 39, 36, 0.45)' }}
                />
                <span className="font-serif italic text-pierre text-[14px] md:text-[15px]">
                  Imad Belfaqir, fondateur
                </span>
              </div>
            </div>

            {/* Colonne droite — appel à action éditorial */}
            <div className="md:col-span-3 md:col-start-10 md:pt-2">
              <div className="space-y-3 md:space-y-4">
                <Link
                  href="/contact#diagnostic"
                  className="group block font-serif italic text-sepia hover:text-or-fonce transition-colors text-[18px] md:text-[19px] leading-snug"
                  style={{ textUnderlineOffset: '0.2em' }}
                >
                  <span className="underline decoration-1 decoration-or-fonce/40 group-hover:decoration-or-fonce">
                    Diagnostic
                  </span>
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </Link>

                <Link
                  href="/cas-usage"
                  className="group block font-sans text-pierre hover:text-sepia transition-colors text-[12px] uppercase tracking-[0.2em] font-medium"
                >
                  <span className="border-b border-pierre/40 group-hover:border-sepia pb-0.5">
                    Lire les cas d&apos;étude
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filet sépia 30% qui ferme le titre */}
        <div
          aria-hidden="true"
          className="h-px w-full"
          style={{ backgroundColor: 'rgba(42, 39, 36, 0.30)' }}
        />

        {/* État des lieux — bande tabulaire séparée */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="py-8 md:py-10"
        >
          <div
            className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-pierre"
            style={{ fontFamily: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }}
          >
            État des lieux ·                                      <span className="text-sepia">{dateLabel}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
            {counters.map((counter, idx) => (
              <div key={counter.label} className="border-l border-sepia/20 pl-4">
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-pierre mb-2"
                  style={{ fontFamily: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-sepia leading-none tracking-tight">
                  {counter.value}
                </div>
                <div className="mt-3 font-sans text-[11px] text-pierre uppercase tracking-[0.12em] leading-snug">
                  {counter.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filet de fermeture */}
        <div
          aria-hidden="true"
          className="h-px w-full"
          style={{ backgroundColor: 'rgba(42, 39, 36, 0.30)' }}
        />
      </div>
    </section>
  );
}
