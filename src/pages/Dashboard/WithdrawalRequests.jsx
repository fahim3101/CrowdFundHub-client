import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const WithdrawalRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWithdrawals = () => {
    setLoading(true);
    axiosSecure
      .get('/withdrawals/pending')
      .then((res) => setWithdrawals(res.data))
      .catch(() => toast.error('Could not load withdrawals'))
      .finally(() => setLoading(false));
  };

  useEffect(loadWithdrawals, [axiosSecure]);

  const handlePay = async (id) => {
    if (!window.confirm('Mark this withdrawal as paid? This cannot be undone.')) return;
    try {
      await axiosSecure.patch(`/withdrawals/approve/${id}`);
      toast.success('Marked as paid');
      loadWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not process payment');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Withdrawal Requests</h1>
      <p className="mt-1 text-sm text-ink/55">Creator payout requests waiting on the platform.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white">
        {withdrawals.length === 0 ? (
          <EmptyState title="No pending withdrawal requests" />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Creator</th>
                <th className="px-5 py-3">Credits</th>
                <th className="px-5 py-3">Amount ($)</th>
                <th className="px-5 py-3">Payment system</th>
                <th className="px-5 py-3">Account</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id} className="border-b border-mist last:border-0">
                  <td className="px-5 py-3">
                    <p>{w.creator_name}</p>
                    <p className="text-xs text-ink/40">{w.creator_email}</p>
                  </td>
                  <td className="figures px-5 py-3">{w.withdrawal_credit}</td>
                  <td className="figures px-5 py-3">${w.withdrawal_amount}</td>
                  <td className="px-5 py-3 capitalize text-ink/60">{w.payment_system}</td>
                  <td className="px-5 py-3 text-ink/60">{w.account_number}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handlePay(w._id)}
                      className="rounded-full bg-pine px-3 py-1.5 text-xs font-medium text-paper hover:bg-pine-dark"
                    >
                      Payment Success
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WithdrawalRequests;
