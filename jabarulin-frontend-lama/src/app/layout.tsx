import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JabarUlin AI — Rekomendasi Wisata Cerdas Jawa Barat",
  description:
    "Temukan destinasi wisata terbaik di Jawa Barat dengan teknologi AI. Dapatkan rekomendasi personal berdasarkan preferensi Anda — dari pantai hingga pegunungan, kuliner hingga petualangan.",
  keywords: "wisata jawa barat, rekomendasi wisata AI, bandung, tempat wisata, JabarUlin",
  openGraph: {
    title: "JabarUlin AI — Rekomendasi Wisata Cerdas Jawa Barat",
    description: "Platform wisata cerdas berbasis AI untuk Jawa Barat",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
