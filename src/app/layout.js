import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "RoadWorks GIS",
  description: "Road Project Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg-body)] text-[var(--text-primary)] transition-colors duration-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
