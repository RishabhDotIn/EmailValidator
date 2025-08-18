import type { Metadata } from 'next';
import './globals.css';
import AuthInit from '@/components/AuthInit';

export const metadata: Metadata = {
  title: 'Email Validator Dashboard',
  description: 'Multi-tenant email validation SaaS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="min-h-screen flex flex-col">
          <AuthInit />
          <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
            <div className="container-limit py-3 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-sm">EV</span>
                <span className="font-semibold tracking-tight">Email Validator</span>
              </a>
              <nav className="text-sm text-slate-600 flex items-center gap-4">
                <a href="/tenants" className="hover:text-slate-900">Dashboard</a>
                <a href="/login" className="btn-ghost px-3 py-1.5">Sign in</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <div className="container-limit py-8">
              {children}
            </div>
          </main>
          <footer className="border-t text-xs text-slate-500">
            <div className="container-limit py-4">© {new Date().getFullYear()} Email Validator</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
