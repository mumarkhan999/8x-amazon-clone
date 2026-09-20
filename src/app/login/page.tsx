import Link from "next/link";
import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="mb-6 text-2xl font-bold tracking-tight">
        amazon<span className="text-orange-500">.clone</span>
      </Link>
      <div className="w-full rounded-lg border border-zinc-200 p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
        <LoginForm callbackUrl={callbackUrl ?? "/"} />
        <p className="mt-4 text-sm text-zinc-600">
          New here?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
