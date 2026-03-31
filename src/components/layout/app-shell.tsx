import Link from "next/link";
import { logoutAction } from "@/server/actions/auth";
import { NavLink } from "@/components/layout/nav-link";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/categories", label: "Categorías" },
  { href: "/calculator", label: "Rentabilidad" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-52 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] sm:block">
        <div className="px-4 py-6">
          <Link href="/" className="block font-semibold tracking-tight text-[var(--text)]">
            Mercado IQ
          </Link>
          <p className="mt-1 text-xs leading-snug text-[var(--muted)]">
            Segunda mano · productos voluminosos
          </p>
        </div>
        <nav className="flex flex-col gap-0.5 px-2 pb-4" aria-label="Principal">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <form
          action={logoutAction}
          className="border-t border-[var(--border)] px-2 py-3"
        >
          <button
            type="submit"
            className="w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--muted)] transition-colors hover:bg-[var(--hover)] hover:text-[var(--text)]"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface)]/95 px-3 py-3 backdrop-blur-sm sm:hidden">
          <Link href="/" className="shrink-0 font-semibold">
            Mercado IQ
          </Link>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-2 gap-y-1">
            <nav className="flex flex-wrap justify-end gap-x-2 gap-y-0.5 text-[11px]" aria-label="Principal">
              {nav.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <form action={logoutAction} className="shrink-0">
              <button
                type="submit"
                className="rounded px-1.5 py-0.5 text-[11px] text-[var(--muted)] hover:text-[var(--text)]"
              >
                Salir
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
