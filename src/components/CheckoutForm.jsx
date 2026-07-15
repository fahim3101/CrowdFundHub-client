import { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';

const cardStyle = {
  style: {
    base: {
      fontSize: '15px',
      color: '#10231C',
      fontFamily: 'Inter, sans-serif',
      '::placeholder': { color: '#10231C66' },
    },
    invalid: { color: '#C1533B' },
  },
};

const CheckoutForm = ({ selectedPackage, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user, refreshCredits } = useAuth();

  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedPackage) return;
    axiosSecure
      .post('/create-payment-intent', { price: selectedPackage.price })
      .then((res) => setClientSecret(res.data.clientSecret));
  }, [selectedPackage, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError('');

    const card = elements.getElement(CardElement);
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: { name: user.displayName, email: user.email },
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      await axiosSecure.post('/payments', {
        email: user.email,
        price: selectedPackage.price,
        credits: selectedPackage.credits,
        transactionId: paymentIntent.id,
      });
      await refreshCredits();
      toast.success(`${selectedPackage.credits} credits added to your account!`);
      onSuccess();
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-lg border border-mist bg-white p-4">
        <CardElement options={cardStyle} />
      </div>
      {error && <p className="text-sm text-brick">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60"
      >
        {processing ? 'Processing…' : `Pay $${selectedPackage.price}`}
      </button>
      <p className="text-center text-xs text-ink/40">
        Test mode — use card number 4242 4242 4242 4242, any future date, any CVC.
      </p>
    </form>
  );
};

export default CheckoutForm;
