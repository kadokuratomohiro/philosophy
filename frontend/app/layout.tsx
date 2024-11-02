// /root/babel_generated/20241103_0039_20241103_0034_logiclens_official_nextjs_fastapi/frontend/app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'

// Components
import { Navigation } from '@/components/Navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Layout } from '@/components/Layout'

// Contexts and Providers
import { ThemeProvider } from '@/contexts/ThemeContext'

// Styles
import '@/styles/globals.css'

// Security
import { SecurityHeaders } from '@/lib/security/headers'
import { CryptoProvider } from '@/lib/security/crypto'

// i18n
import { I18nProvider } from '@/lib/i18n'

// NLP
import { NLPProvider } from '@/lib/nlp'

const inter = Inter({ subsets: ['latin'] })

// メタデータの定義
export const metadata: Metadata = {
  title: 'LogicLens - Philosophical Analysis Tool',
  description: 'Advanced tool for philosophical analysis and logical reasoning',
  keywords: 'philosophy, logic, analysis, reasoning, thought experiments',
  authors: [{ name: 'LogicLens Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  themeColor: '#ffffff',
  manifest: '/manifest.json',
}

// セキュリティヘッダーの設定
export async function generateHeaders() {
  return SecurityHeaders
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const headersList = headers()
  const userLocale = headersList.get('accept-language')?.split(',')[0] || 'en'

  return (
    <html lang={userLocale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Content-Security-Policy" content={SecurityHeaders['Content-Security-Policy']} />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
      </head>
      <body className={inter.className}>
        <CryptoProvider>
          <ThemeProvider>
            <I18nProvider locale={userLocale}>
              <NLPProvider>
                <Layout>
                  <header className="fixed w-full top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <Navigation />
                    <div className="absolute right-4 top-4">
                      <ThemeToggle />
                    </div>
                  </header>
                  
                  <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-32">
                    <Suspense fallback={<div>Loading...</div>}>
                      {children}
                    </Suspense>
                  </main>
                  
                  <footer className="py-6 md:px-8 md:py-0">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by LogicLens Team. The source code is available on{' '}
                        <a href="https://github.com/logiclens" className="font-medium underline underline-offset-4">
                          GitHub
                        </a>
                        .
                      </p>
                    </div>
                  </footer>
                </Layout>
              </NLPProvider>
            </I18nProvider>
          </ThemeProvider>
        </CryptoProvider>
        <Analytics />
      </body>
    </html>
  )
}

// IndexedDBのセキュリティ設定
if (typeof window !== 'undefined') {
  const secureIndexedDB = {
    name: process.env.DATABASE_NAME,
    version: 1,
    encryption: true,
    encryptionKey: process.env.ENCRYPTION_KEY,
  }
  
  indexedDB.open(secureIndexedDB.name, secureIndexedDB.version)
}