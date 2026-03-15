export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_25%)]" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/70 bg-card/95 p-8 shadow-panel backdrop-blur">
        {children}
      </div>
    </div>
  );
}
