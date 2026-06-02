import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solea Yoga Studio | Premium Practice in Khashuri, Borjomi & Akhaltsikhe",
  description: "Experience premium, nature-aligned yoga practices at Solea Studio. Join our welcoming branches in Khashuri, Borjomi, and Akhaltsikhe. Sign up today to start your mindfulness journey.",
  keywords: ["Yoga", "Yoga Georgia", "Khashuri", "Borjomi", "Akhaltsikhe", "Mindfulness", "Solea Studio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

