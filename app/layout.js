import "./globals.css";

export const metadata = {
  title: "RiseUpHub — AI Career Roadmap Builder",
  description:
    "AI-powered career roadmaps and study plans for every Indian student. Crack JEE, UPSC, CAT, NEET, SSC, Banking, and 200+ more paths.",
  keywords:
    "career roadmap, study plan, JEE preparation, UPSC roadmap, CAT preparation, AI study plan, free roadmap India",
  openGraph: {
    title: "RiseUpHub — AI Career Roadmap Builder",
    description: "Your personalized roadmap to crack any exam or career goal.",
    url: "https://riseuphub.com",
    siteName: "RiseUpHub",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}