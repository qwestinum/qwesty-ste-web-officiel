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
        <header className="border-b border-hairline bg-cream">
          <div className="container-page py-14 md:py-20">
            <Link
              href="/formations"
              className="mb-8 inline-flex items-center gap-2 font-sans text-[15px] font-bold text-ink-muted transition-colors hover:text-ink"
            >
              <span aria-hidden="true">←</span> Toutes les formations
            </Link>

            <div className="flex flex-wrap gap-3 mb-6">
              {formation.level_label && (
                <span className="tag bg-halo text-ink">
                  {formation.level_label}
                </span>
              )}
              {formation.duration_label && (
                <span className="tag border border-hairline text-ink-muted">
                  {formation.duration_label}
                </span>
              )}
              {formation.is_flagship && (
                <span className="tag bg-sun text-ink">
                  Programme flagship
                </span>
              )}
            </div>

            <h1 className="max-w-4xl font-sans text-4xl font-bold leading-display tracking-tight text-ink md:text-5xl lg:text-6xl">
              {formation.title}
            </h1>

            {formation.audience && (
              <p className="mt-6 max-w-3xl font-sans text-base md:text-lg italic text-ink-muted">
                Pour : {formation.audience}
              </p>
            )}

            {formation.excerpt && (
              <p className="mt-5 max-w-3xl font-sans text-lg md:text-xl leading-relaxed text-ink">
                {formation.excerpt}
              </p>
            )}
          </div>
        </header>

        <section className="section-padding bg-white">
          <div className="container-page max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Description longue */}
            <div className="lg:col-span-2">
              {formation.description && (
                <div className="mb-12">
                  <span className="eyebrow">Description</span>
                  <p className="mt-4 font-sans text-base md:text-lg leading-relaxed text-ink">
                    {formation.description}
                  </p>
                </div>
              )}

              {programme.length > 0 && (
                <div>
                  <span className="eyebrow">Au programme</span>
                  <ul className="mt-6 space-y-3">
                    {programme.map((item, i) => (
                      <li key={i} className="flex gap-4 font-sans text-base leading-relaxed text-ink">
                        <span className="mt-2.5 block size-1.5 shrink-0 rounded-full bg-sun" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar infos */}
            <aside className="lg:col-span-1">
              <div className="card-warm p-6">
                <h3 className="font-sans text-lg font-bold tracking-tight text-ink">
                  Informations pratiques
                </h3>
                <dl className="mt-5 space-y-4 text-sm">
                  {formation.duration_label && (
                    <div>
                      <dt className="eyebrow mb-1 block">Durée</dt>
                      <dd className="font-sans text-ink">{formation.duration_label}</dd>
                    </div>
                  )}
                  {formation.formats && formation.formats.length > 0 && (
                    <div>
                      <dt className="eyebrow mb-1 block">Formats</dt>
                      <dd className="font-sans text-ink">{formation.formats.join(' · ')}</dd>
                    </div>
                  )}
                  {formation.price_label && (
                    <div>
                      <dt className="eyebrow mb-1 block">Tarif</dt>
                      <dd className="font-sans text-ink">{formation.price_label}</dd>
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
