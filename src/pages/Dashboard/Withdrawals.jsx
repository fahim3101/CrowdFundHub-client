import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import LoadingSpinner from '../../components/LoadingSpinner';

const CREDITS_PER_DOLLAR = 20;
const MIN_CREDITS = 200;

const Withdrawals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [totalRaised, setTotalRaised] = useState(0);
  const [pendingSum, setPendingSum] = useState(0);
  const [credits, setCredits] = useState('');
  const [paymentSystem, setPaymentSystem] = useState('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    Promise.all([
      axiosSecure.get(`/campaigns/creator/${user.email}`),
      axiosSecure.get(`/withdrawals/creator/${user.email}`),
    ])
      .then(([campRes, withRes]) => {
        const raised = campRes.data
          .filter((c) => c.status === 'approved')
          .reduce((sum, c) => sum + (c.amount_raised || 0), 0);
        setTotalRaised(raised);
        const pending = withRes.data
          .filter((w) => w.status === 'pending')
          .reduce((sum, w) => sum + (w.withdrawal_credit || 0), 0);
        setPendingSum(pending);
      })
      .catch(() => toast.error('Could not load withdrawal info'))
      .finally(() => setLoading(false));
  }, [user, axiosSecure]);

  const available = totalRaised - pendingSum;
  const dollarAmount = credits ? (Number(credits) / CREDITS_PER_DOLLAR).toFixed(2) : '0.00';
  const canWithdraw = available >= MIN_CREDITS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = Number(credits);
    if (!Number.isInteger(val) || val < MIN_CREDITS) {
      return toast.error(`Minimum withdrawal is ${MIN_CREDITS} credits`);
    }
    if (val > available) {
      return toast.error(`Insufficient available credit. Available: ${available}`);
    }
    if (!accountNumber.trim()) return toast.error('Account number is required');
    if (accountNumber.trim().length < 6) return toast.error('Account number looks too short');
    if (!window.confirm(`Request withdrawal of ${val} credits (≈ $${(val / CREDITS_PER_DOLLAR).toFixed(2)}) via ${paymentSystem}? This cannot be undone.`)) return;
    setSubmitting(true);
    try {
      await axiosSecure.post('/withdrawals', {
        creator_email: user.email,
        creator_name: user.displayName || user.email?.split('@')[0] || 'Creator',
        withdrawal_credit: val,
        payment_system: paymentSystem,
        account_number: accountNumber.trim(),
      });
      toast.success('Withdrawal request submitted');
      setCredits('');
      setAccountNumber('');
      setPendingSum((s) => s + val);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-ink">Withdrawals</h1>
      <p className="mt-1 text-sm text-ink/55">20 credits = $1. Minimum withdrawal is 200 credits ($10).</p>

      <div className="mt-6 rounded-2xl border border-mist bg-white p-6">
        <p className="text-sm text-ink/50">Total raised across your approved campaigns</p>
        <p className="figures mt-1 text-3xl font-semibold text-pine">{totalRaised} credits</p>
        <p className="figures mt-1 text-sm text-ink/50">
          Pending: {pendingSum} · Available: {available} (≈ ${((available || 0) / CREDITS_PER_DOLLAR).toFixed(2)})
        </p>
      </div>

      {!canWithdraw ? (
        <p className="mt-6 rounded-xl bg-mist px-4 py-3 text-center text-sm text-ink/60">
          You need at least {MIN_CREDITS} credits raised before you can request a withdrawal.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="wd-credits" className="text-sm font-medium text-ink/80">Credits to withdraw</label>
            <input
              id="wd-credits"
              type="number"
              required
              min={MIN_CREDITS}
              max={available}
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              aria-label="Credits to withdraw"
              className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none"
            />
          </div>

          <div>
            <label htmlFor="wd-usd" className="text-sm font-medium text-ink/80">Withdraw amount ($)</label>
            <input
              id="wd-usd"
              disabled
              value={dollarAmount}
              className="figures mt-1 w-full rounded-lg border border-mist bg-mist px-4 py-2.5 text-sm text-ink/60"
            />
          </div>

          <div>
            <label htmlFor="wd-system" className="text-sm font-medium text-ink/80">Payment system</label>
            <select
              id="wd-system"
              value={paymentSystem}
              onChange={(e) => setPaymentSystem(e.target.value)}
              className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none"
            >
              <option value="bkash">Bkash</option>
              <option value="rocket">Rocket</option>
              <option value="nagad">Nagad</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>

          <div>
            <label htmlFor="wd-account" className="text-sm font-medium text-ink/80">Account number</label>
            <input
              id="wd-account"
              required
              minLength={6}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none"
            />
          </div>

          {Number(credits) > available ? (
            <p role="alert" className="text-center text-sm text-brick">Insufficient available credit (pending: {pendingSum})</p>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="focus-ring rounded-full bg-pine px-6 py-3 text-sm font-semibold text-paper transition hover:bg-pine-dark disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Withdraw'}
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default Withdrawals;
