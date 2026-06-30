import "./globals.css";

export const metadata = {
  title: "RiseUPHub — AI Career Roadmaps & Study Plans",
  description: "AI-powered career roadmaps, study plans, UPSC prep, and language learning paths tailored to your goals, skills, and schedule.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}