import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '燃场 Kindle Field - 让经验被复用，让困境有回响',
    template: '%s | 燃场',
  },
  description:
    '燃场是一个面向35岁以上人群的能力连接与困境解决平台。让经验被复用，让困境有回响，让下半场有伙伴。',
  keywords: [
    '燃场',
    'Kindle Field',
    '35+职场',
    '创业',
    '私董会',
    '能力连接',
    '困境解决',
    '跨界合作',
    'AI培训',
  ],
  authors: [{ name: '燃场团队' }],
  generator: '燃场',
  openGraph: {
    title: '燃场 Kindle Field - 让经验被复用，让困境有回响',
    description:
      '燃场是一个面向35岁以上人群的能力连接与困境解决平台。让经验被复用，让困境有回响，让下半场有伙伴。',
    url: 'https://kindlefield.com',
    siteName: '燃场',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
