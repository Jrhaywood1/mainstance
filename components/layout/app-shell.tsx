"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ClipboardList, FileText, LayoutDashboard, Settings, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type Role } from "@/lib/types";

const navItems: Array<{ href: string; label: string; icon: typeof LayoutDashboard; roles?: Role[] }> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/requests", label: "Requests", icon: FileText },
  { href: "/work-orders", label: "Work Orders", icon: ClipboardList, roles: ["technician", "manager", "admin"] },
  { href: "/reports", label: "Reports", icon: Building2, roles: ["manager", "admin"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["admin"] }
];

export function AppShell({
  children,
  user
}: {
  children: React.ReactNode;
  user: { full_name: string; role: Role; email: string };
}) {
  const pathname = usePathname();

  const visibleNavItems = navItems.filter((item) => !item.roles || item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-border/80 bg-card/80 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold">Mainstance</div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Ops Control</div>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
                    active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-xl border border-border/70 bg-background/60 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Signed in as</div>
            <div className="mt-3 text-sm font-medium">{user.full_name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <Badge className="mt-4 w-fit" variant="info">
              {user.role}
            </Badge>
          </div>
        </aside>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
