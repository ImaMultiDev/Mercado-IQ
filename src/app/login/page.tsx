import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth-token";

export default async function LoginPage() {
  const secret = process.env.AUTH_SECRET;
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  if (token && secret && (await verifySessionToken(token, secret))) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h1 className="text-center text-lg font-semibold tracking-tight">Mercado IQ</h1>
        <p className="mt-1 text-center text-xs text-[var(--muted)]">Acceso privado</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
