import "./globals.css";

export const metadata = {
  title: "RiseUpHub — AI Career Roadmap Builder",
  description:
    "AI-powered career roadmaps and study plans for students, professionals, and lifelong learners. Crack JEE, UPSC, CAT, NEET, SSC, IELTS and 200+ more paths.",
  keywords:
    "career roadmap, study plan, JEE preparation, UPSC roadmap, CAT preparation, AI study plan India, SSC CGL roadmap, NEET preparation, IELTS roadmap",
  authors: [{ name: "RiseUpHub" }],
  openGraph: {
    title: "RiseUpHub — AI Career Roadmap Builder",
    description:
      "Your personalized roadmap to crack any exam or career goal. Free to start.",
    url: "https://riseuphub.com",
    siteName: "RiseUpHub",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RiseUpHub — AI Career Roadmap Builder",
    description: "AI-powered roadmaps for 200+ career paths. Free to start.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}