"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/server/actions/auth";

const inputClass =
  "mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 outline-none ring-[var(--accent)] focus:ring-2";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined as LoginState | undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="text-sm font-medium">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className={inputClass}
          disabled={pending}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
          disabled={pending}
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-[var(--accent)] py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
