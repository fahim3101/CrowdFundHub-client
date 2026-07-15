import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

// Same route for both roles: supporters see credit purchases,
// creators see withdrawal payouts. The data and columns differ, the page doesn't.
const PaymentHistory = () => {
  const { user, role } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email || !role) return;
    const endpoint = role === 'creator' ? `/withdrawals/creator/${user.email}` : `/payments/${user.email}`;
    axiosSecure.get(endpoint).then((res) => setRows(res.data)).finally(() => setLoading(false));
  }, [user, role, axiosSecure]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Payment History</h1>
      <p className="mt-1 text-sm text-ink/55">
        {role === 'creator' ? 'Every withdrawal you have requested.' : 'Every credit package you have purchased.'}
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white">
        {rows.length === 0 ? (
          <EmptyState title="No payments yet" />
        ) : role === 'creator' ? (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Credits</th>
                <th className="px-5 py-3">Amount ($)</th>
                <th className="px-5 py-3">Payment system</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-b border-mist last:border-0">
                  <td className="px-5 py-3 text-ink/50">{new Date(r.withdraw_date).toLocaleDateString()}</td>
                  <td className="figures px-5 py-3">{r.withdrawal_credit}</td>
                  <td className="figures px-5 py-3">${r.withdrawal_amount}</td>
                  <td className="px-5 py-3 text-ink/60 capitalize">{r.payment_system}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Credits</th>
                <th className="px-5 py-3">Amount ($)</th>
                <th className="px-5 py-3">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-b border-mist last:border-0">
                  <td className="px-5 py-3 text-ink/50">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="figures px-5 py-3">{r.credits}</td>
                  <td className="figures px-5 py-3">${r.price}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink/50">{r.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
