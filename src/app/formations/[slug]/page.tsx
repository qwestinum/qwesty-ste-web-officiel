import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { getAllFormationSlugs, getFormationBySlug } from '@/lib/queries/formations';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllFormationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const formation = await getFormationBySlug(params.slug);
  if (!formation) return { title: 'Formation introuvable' };
  return {
    title: formation.title,
    description: formation.excerpt ?? undefined,
  };
}

export default async function FormationDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const formation = await getFormationBySlug(params.slug);
  if (!formation) notFound();

  // Cast via unknown pour Json -> string[] (TypeScript strict)
  const programme = Array.isArray(formation.programme)
    ? (formation.programme as unknown as string[]).filter(
        (s) => typeof s === 'string'
      )
    : [];

  return (
    <>
      <Header />
      <main>
        <header className="border-b border-perle">
          <div className="container-page py-14 md:py-20">
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wide-2 text-pierre hover:text-sepia transition-colors mb-8"
            >
              <span aria-hidden="true">←</span> Toutes les formations
            </Link>

            <div className="flex flex-wrap gap-3 mb-6">
              {formation.level_label && (
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm bg-or-pale/40 text-or-fonce">
                  {formation.level_label}
                </span>
              )}
              {formation.duration_label && (
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm border border-perle text-pierre">
                  {formation.duration_label}
                </span>
              )}
              {formation.is_flagship && (
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm bg-or text-sepia">
                  Programme flagship
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight-extra tracking-tighter-2 text-sepia max-w-4xl">
              {formation.title}
            </h1>

            {formation.audience && (
              <p className="mt-6 max-w-3xl font-sans text-base md:text-lg italic text-pierre">
                Pour : {formation.audience}
              </p>
            )}

            {formation.excerpt && (
              <p className="mt-5 max-w-3xl font-sans text-lg md:text-xl leading-relaxed text-sepia">
                {formation.excerpt}
              </p>
            )}
          </div>
        </header>

        <section className="py-16 md:py-20">
          <div className="container-page max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Description longue */}
            <div className="lg:col-span-2">
              {formation.description && (
                <div className="mb-12">
                  <span className="label-mark">Description</span>
                  <p className="mt-4 font-sans text-base md:text-lg leading-relaxed text-sepia">
                    {formation.description}
                  </p>
                </div>
              )}

              {programme.length > 0 && (
                <div>
                  <span className="label-mark">Au programme</span>
                  <ul className="mt-6 space-y-3">
                    {programme.map((item, i) => (
                      <li key={i} className="flex gap-4 font-sans text-base leading-relaxed text-sepia">
                        <span className="block w-1.5 h-1.5 rounded-full bg-or mt-2.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar infos */}
            <aside className="lg:col-span-1">
              <div className="bg-perle/30 border border-perle rounded-md p-6">
                <h3 className="font-serif text-lg font-medium text-sepia tracking-tight-1">
                  Informations pratiques
                </h3>
                <dl className="mt-5 space-y-4 text-sm">
                  {formation.duration_label && (
                    <div>
                      <dt className="label-mark mb-1">Durée</dt>
                      <dd className="font-sans text-sepia">{formation.duration_label}</dd>
                    </div>
                  )}
                  {formation.formats && formation.formats.length > 0 && (
                    <div>
                      <dt className="label-mark mb-1">Formats</dt>
                      <dd className="font-sans text-sepia">{formation.formats.join(' · ')}</dd>
                    </div>
                  )}
                  {formation.price_label && (
                    <div>
                      <dt className="label-mark mb-1">Tarif</dt>
                      <dd className="font-sans text-sepia">{formation.price_label}</dd>
                    </div>
                  )}
                </dl>
                <Link href="/#contact" className="btn-primary w-full mt-6">
                  Demander cette formation
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <CtaBanner
          text="Vous voulez adapter cette formation à votre équipe ?"
          ctaLabel="Demande sur mesure"
        />
      </main>
      <Footer />
    </>
  );
}
