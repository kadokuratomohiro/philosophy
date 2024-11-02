// frontend/app/page.tsx

import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { getTranslations } from '@/lib/i18n';
import { initializeCompromise } from '@/lib/nlp';
import { initializeSecureStorage } from '@/lib/security';
import Loading from '@/components/Common/Loading';

// Client Components with dynamic imports for better performance
const PropositionInput = dynamic(
  () => import('@/components/Analysis/PropositionInput'),
  { ssr: false }
);

const AnalysisView = dynamic(
  () => import('@/components/Analysis/AnalysisView'),
  { ssr: false }
);

// Metadata for SEO
export const metadata: Metadata = {
  title: 'LogicLens - Philosophical Analysis Tool',
  description: 'Analyze philosophical propositions with advanced logical analysis and concept mapping',
  openGraph: {
    title: 'LogicLens - Philosophical Analysis Tool',
    description: 'Advanced logical analysis platform for philosophical propositions',
    images: ['/images/og-image.png'],
  },
};

// Security headers
export const headers = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Initialize security and NLP features
const initializeApp = async () => {
  await initializeSecureStorage();
  await initializeCompromise();
};

export default async function Home() {
  // Get user's language preference from headers
  const headersList = headers();
  const userLang = headersList.get('accept-language')?.split(',')[0] || 'en';
  
  // Initialize translations
  const t = await getTranslations(userLang);
  
  // Initialize app features
  await initializeApp();

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        {t('home.title')}
      </h1>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            {t('home.input.title')}
          </h2>
          <Suspense fallback={<Loading />}>
            <PropositionInput />
          </Suspense>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            {t('home.analysis.title')}
          </h2>
          <Suspense fallback={<Loading />}>
            <AnalysisView />
          </Suspense>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">
          {t('home.features.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature cards */}
          {features.map((feature) => (
            <div
              key={feature.id}
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-3">
                {t(`home.features.${feature.id}.title`)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t(`home.features.${feature.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// Feature list for the homepage
const features = [
  { id: 'logical-analysis', icon: '🔍' },
  { id: 'concept-mapping', icon: '🗺️' },
  { id: 'thought-experiments', icon: '🧪' },
];

// Error boundary for the page
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="p-4 text-red-600">
      <h2>Error</h2>
      <p>{error.message}</p>
    </div>
  );
}