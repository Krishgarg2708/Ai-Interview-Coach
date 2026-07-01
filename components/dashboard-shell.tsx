'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/navbar';
import {
  LayoutDashboard,
  Mic,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Trophy,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/interview/setup', label: 'New Interview', icon: Mic },
  { href: '/performance', label: 'Performance', icon: BarChart3 },
  { href: '/resume', label: 'Resume', icon: FileText },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden w-64 shrink-0 border-r border-glass-border glass md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-glass-border px-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="font-display text-base font-bold tracking-tight">
                InterCoach<span className="text-primary"> AI</span>
              </span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-glass-border p-4">
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-chart-1 to-chart-4 text-sm font-semibold text-white">
                {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {profile?.full_name ?? 'User'}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {Math.round(profile?.avg_score ?? 0)} avg score
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start text-muted-foreground"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="glass sticky top-0 z-30 flex h-16 items-center justify-between border-b border-glass-border px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-base font-bold">
              InterCoach<span className="text-primary"> AI</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
        <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export { links as dashboardLinks };
