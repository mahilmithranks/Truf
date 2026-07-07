import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import MaintenancePage from '@/components/MaintenancePage';

// ─── Toggle this to take the site offline / online ───────────────────────────
const MAINTENANCE_MODE = true;
// ─────────────────────────────────────────────────────────────────────────────

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'TurfBook - Under Maintenance',
  description: 'We are currently under maintenance. We will be back soon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (MAINTENANCE_MODE) {
    return (
      <html lang="en">
        <body className={`${poppins.variable} font-sans bg-black text-white`}>
          <MaintenancePage />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans bg-black text-white`}>
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

