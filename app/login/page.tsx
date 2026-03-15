import Link from "next/link";
import { sendMagicLink, signInWithPassword } from "@/app/login/actions";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <AuthShell>
      <CardHeader className="p-0">
        <CardTitle className="text-2xl">Sign in to Mainstance</CardTitle>
        <CardDescription>
          Email/password and magic-link auth are both supported in the schema and org settings. This scaffold keeps the UI and Supabase handoff ready.
        </CardDescription>
      </CardHeader>

      <form className="mt-8 space-y-4" action={signInWithPassword}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="manager@northstar.demo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="********" />
        </div>
        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </form>
      <form className="mt-3" action={sendMagicLink}>
        <Button className="w-full" type="submit" variant="secondary">
          Send magic link
        </Button>
      </form>

      <div className="mt-6 text-sm text-muted-foreground">
        Demo starts on the manager experience. Continue to <Link className="text-primary" href="/dashboard">dashboard</Link>.
      </div>
    </AuthShell>
  );
}
