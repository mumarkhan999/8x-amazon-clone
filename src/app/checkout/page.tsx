import { requireUser } from "@/lib/dal";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 border-b border-zinc-200 pb-2 text-2xl font-semibold">
        Checkout
      </h1>
      <CheckoutForm
        defaultName={user.name ?? ""}
      />
    </div>
  );
}
