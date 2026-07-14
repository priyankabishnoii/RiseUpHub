import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://riseuphub.com"),
  title: {
    default: "RiseUpHub — AI Career Roadmap Builder",
    template: "%s | RiseUpHub",
  },
  description:
    "AI-powered career roadmaps and study plans for students, professionals, and lifelong learners. Crack JEE, NEET, UPSC, CAT, SSC, Banking, IELTS, GRE and 200+ more paths. Free to start.",
  keywords: [
    "career roadmap", "study plan", "AI roadmap", "JEE preparation",
    "UPSC roadmap", "CAT preparation", "NEET study plan", "SSC CGL roadmap",
    "free study plan India", "AI career guide", "exam preparation roadmap",
    "IELTS preparation", "GRE roadmap", "banking exam preparation",
    "Python learning roadmap", "data science roadmap", "RiseUpHub",
  ],
  authors: [{ name: "RiseUpHub", url: "https://riseuphub.com" }],
  creator: "RiseUpHub",
  publisher: "RiseUpHub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://riseuphub.com",
    siteName: "RiseUpHub",
    title: "RiseUpHub — AI Career Roadmap Builder",
    description:
      "Get your personalized career roadmap in 30 seconds. Free AI-powered study plans for 200+ exams and career paths.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RiseUpHub — AI Career Roadmap Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RiseUpHub — AI Career Roadmap Builder",
    description:
      "Free AI-powered roadmaps for JEE, UPSC, CAT, NEET, SSC, Banking, IELTS and 200+ more. Personalized in 30 seconds.",
    images: ["/og-image.png"],
    creator: "@riseuphub",
  },
  alternates: {
    canonical: "https://riseuphub.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for speed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Schema.org structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "RiseUpHub",
              "url": "https://riseuphub.com",
              "description": "AI-powered career roadmaps and study plans for students and professionals",
              "applicationCategory": "EducationApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR",
                "description": "Free to start, ₹50 for premium downloads",
              },
              "creator": {
                "@type": "Organization",
                "name": "RiseUpHub",
                "url": "https://riseuphub.com",
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}