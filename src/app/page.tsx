import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { PartnersBand } from '@/components/home/PartnersBand';
import { Services } from '@/components/home/Services';
import { Approach } from '@/components/home/Approach';
import { Proof } from '@/components/home/Proof';
import { Guarantees } from '@/components/home/Guarantees';
import { ResourcesTeaser } from '@/components/home/ResourcesTeaser';
import { ContactCta } from '@/components/home/ContactCta';
import {
  getActivePartners,
  getHeroCounters,
  getHomeKpis,
  getLatestArticles,
} from '@/lib/queries/home';

// On revalide la page toutes les 5 minutes — bon compromis perf / fraîcheur
export const revalidate = 300;

export default async function HomePage() {
  // Toutes les queries Supabase en parallèle (Promise.all)
  const [counters, partners, kpis, articles] = await Promise.all([
    getHeroCounters(),
    getActivePartners(),
    getHomeKpis(),
    getLatestArticles(3),
  ]);

  return (
    <>
      <Header />

      <main>
        <Hero counters={counters} />
        <PartnersBand partners={partners} />
        <Services />
        <Approach />
        <Proof kpis={kpis} />
        <Guarantees />
        <ResourcesTeaser articles={articles} />
        <ContactCta />
      </main>

      <Footer />
    </>
  );
}
