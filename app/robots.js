export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/generate", "/login"],
        disallow: ["/dashboard", "/admin", "/api", "/roadmap"],
      },
    ],
    sitemap: "https://riseuphub.com/sitemap.xml",
  };
}