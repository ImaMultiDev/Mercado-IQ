import Link from "next/link";
import { logoutAction } from "@/server/actions/auth";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/categories", label: "Categorías" },
  { href: "/calculator", label: "Rentabilidad" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-48 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] sm:block">
        <div className="px-4 py-5">
          <Link href="/" className="block font-semibold tracking-tight text-[var(--text)]">
            Mercado IQ
          </Link>
          <p className="mt-0.5 text-xs text-[var(--muted)]">Segunda mano · volumen</p>
        </div>
        <nav className="flex flex-col gap-0.5 px-2 pb-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="border-t border-[var(--border)] px-2 py-3">
          <button
            type="submit"
            className="w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:hidden">
          <Link href="/" className="font-semibold">
            Mercado IQ
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex gap-2 text-xs">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="text-[var(--muted)]">
                  {item.label}
                </Link>
              ))}
            </nav>
            <form action={logoutAction}>
              <button type="submit" className="text-xs text-[var(--muted)]">
                Salir
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
