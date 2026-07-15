import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Coins, X } from 'lucide-react';
import CheckoutForm from '../../components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const packages = [
  { credits: 100, price: 10 },
  { credits: 300, price: 25 },
  { credits: 800, price: 60 },
  { credits: 1500, price: 110 },
];

const PurchaseCredit = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Purchase Credit</h1>
      <p className="mt-1 text-sm text-ink/55">Buy credits to contribute toward campaigns you want to support.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg) => (
          <button
            key={pkg.credits}
            onClick={() => setSelected(pkg)}
            className="group flex flex-col items-center rounded-2xl border border-mist bg-white p-6 text-center transition hover:-translate-y-1 hover:border-gold hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pine/10 text-pine">
              <Coins size={22} />
            </span>
            <p className="figures mt-4 text-2xl font-semibold text-ink">{pkg.credits}</p>
            <p className="text-xs uppercase tracking-wide text-ink/50">credits</p>
            <p className="mt-3 text-lg font-semibold text-gold-dark">${pkg.price}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">
                {selected.credits} credits — ${selected.price}
              </h2>
              <button onClick={() => setSelected(null)} className="text-ink/40 hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <div className="mt-5">
              <Elements stripe={stripePromise}>
                <CheckoutForm selectedPackage={selected} onSuccess={() => setSelected(null)} />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseCredit;
