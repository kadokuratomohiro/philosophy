// app/page.tsx
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Client Componentsの動的インポート
const PropositionInput = dynamic(() => import('@/components/Analysis/PropositionInput'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
})

const AnalysisView = dynamic(() => import('@/components/Analysis/LogicStructure'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
})

// メタデータの設定
export const metadata: Metadata = {
  title: 'LogicMind - Logical Analysis Platform',
  description: 'Analyze propositions, explore logical structures, and understand complex arguments with LogicMind.',
  openGraph: {
    title: 'LogicMind - Logical Analysis Platform',
    description: 'Analyze propositions and explore logical structures with AI-powered tools.',
    images: ['/og-image.png'],
  },
}

// メインページコンポーネント
export default async function HomePage() {
  return (
    <main className="min-h-screen w-full px-4 py-8 md:px-8 lg:px-12">
      <section className="max-w-7xl mx-auto space-y-8">
        {/* ヒーローセクション */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
            Explore Logical Thinking
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Analyze propositions and discover logical connections with our advanced tools
          </p>
        </div>

        {/* 入力セクション */}
        <section 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          aria-labelledby="input-section"
        >
          <h2 
            id="input-section" 
            className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
          >
            Enter Your Proposition
          </h2>
          <Suspense fallback={<div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />}>
            <PropositionInput />
          </Suspense>
        </section>

        {/* 分析セクション */}
        <section 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          aria-labelledby="analysis-section"
        >
          <h2 
            id="analysis-section" 
            className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
          >
            Analysis Results
          </h2>
          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />}>
            <AnalysisView />
          </Suspense>
        </section>

        {/* 機能説明セクション */}
        <section className="grid md:grid-cols-3 gap-6">
          {['Logical Analysis', 'Concept Mapping', 'Validity Checking'].map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced tools to help you understand and analyze logical structures.
              </p>
            </div>
          ))}
        </section>
      </section>
    </main>
  )
}