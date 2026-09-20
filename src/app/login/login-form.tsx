"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        {state?.errors?.email && (
          <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        {state?.errors?.password && (
          <p className="mt-1 text-xs text-red-600">{state.errors.password[0]}</p>
        )}
      </div>
      {state?.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-orange-400 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-orange-500 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
