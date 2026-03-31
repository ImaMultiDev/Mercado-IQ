"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`rounded-md px-2 py-1.5 text-sm transition-colors ${
        active
          ? "bg-[var(--accent-dim)] font-medium text-[var(--accent)]"
          : "text-[var(--text)] hover:bg-[var(--hover)]"
      }`}
    >
      {children}
    </Link>
  );
}
