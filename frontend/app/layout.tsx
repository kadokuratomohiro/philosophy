import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { Sidebar } from '@/components/Layout/Sidebar'

// Googleフォントの設定
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// メタデータの設定
export const metadata: Metadata = {
  title: {
    template: '%s | LogicMind',
    default: 'LogicMind - Logical Analysis Platform',
  },
  description: 'Advanced platform for logical analysis, concept mapping, and thought experiments',
  keywords: 'logic, analysis, philosophy, concept mapping, thought experiments',
  authors: [{ name: 'LogicMind Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://logicmind.com',
    siteName: 'LogicMind',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LogicMind Platform',
      },
    ],
  },
}

// ルートレイアウトの型定義
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            {/* スキップナビゲーションリンク（アクセシビリティ対応） */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4"
            >
              Skip to main content
            </a>

            {/* ヘッダー */}
            <Header />

            {/* メインコンテンツエリア */}
            <div className="flex-1 flex">
              <Sidebar />
              <main
                id="main-content"
                className="flex-1 p-4 md:p-6 lg:p-8"
                role="main"
              >
                {children}
              </main>
            </div>

            {/* フッター */}
            <Footer />
          </div>

          {/* アクセシビリティ対応のライブリージョン */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            role="status"
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

// フォントとスクリプトの最適化
export const fontOptimization = {
  optimizeFonts: true,
  preload: true,
}

// ランタイム設定
export const runtime = 'edge'

// 動的レンダリング設定
export const dynamic = 'force-dynamic'