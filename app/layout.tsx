import './css/style.css'
import Head from 'next/head';
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  metadataBase: 'https://corvostecnologia.com.br/',
  title: 'Corvos Tecnologia ',
  description: ` Transforme sua presença online com soluções de Desenvolvimento Web, Mobile, Marketing Digital e Gerenciamento de Conteúdo de alto impacto, garantindo uma experiência única para seus usuários. `,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Corvos Tecnologia',
    description:'Transforme sua presença online com soluções de Desenvolvimento Web, Mobile, Marketing Digital e Gerenciamento de Conteúdo de alto impacto, garantindo uma experiência única para seus usuários.',
    url: 'https://corvostecnologia.com.br/',
    siteName: 'Corvos Tecnologia',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 600,
        alt: 'Logo Corvos Tecnologia',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: any) {
  const ogImageUrl = `${metadata.metadataBase}/opengraph-image.jpg`;
  const twitterImageUrl = `${metadata.metadataBase}/twitter-image.jpg`;

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Descrição alternativa da imagem" />
        {/* Opcional: Para Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={twitterImageUrl} />
        <meta name="twitter:image:alt" content="Descrição alternativa da imagem" />
        {/* Favicons e Ícones */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" sizes="16x16" href="/favicon-16x16.png" type="image/png" />
        <link rel="icon" sizes="32x32" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </Head>  
      <html lang="en" className="scroll-smooth">
        <body className={`${inter.variable} font-inter antialiased bg-slate-900 text-slate-100 tracking-tight`}>
          <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip relative">
            {children}
          </div>
        </body>
      </html>
    </>
  )
}
