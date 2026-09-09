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
  const [loadError, setLoadError] = useState('');

  const loadData = () => {
    if (!user?.email || !role) return;
    // Admins have no personal purchases — show empty state instead of a 403.
    if (role === 'admin') {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    const endpoint = role === 'creator' ? `/withdrawals/creator/${user.email}` : `/payments/${user.email}`;
    axiosSecure
      .get(endpoint)
      .then((res) => setRows(res.data))
      .catch(() => setLoadError('Could not load payment history.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [user, role, axiosSecure]);

  if (loading) return <LoadingSpinner />;
  if (loadError)
    return (
      <div className="py-16 text-center">
        <p className="text-ink/60">{loadError}</p>
        <button
          onClick={loadData}
          className="mt-4 rounded-full bg-pine px-6 py-2.5 text-sm font-semibold text-paper hover:bg-pine-dark"
        >
          Retry
        </button>
      </div>
    );

  if (role === 'admin')
    return (
      <div>
        <h1 className="text-2xl font-semibold text-ink">Payment History</h1>
        <p className="mt-1 text-sm text-ink/55">Platform-wide totals live on the Admin overview.</p>
        <div className="mt-6">
          <EmptyState title="No personal payments" body="Admins don't purchase credits — see Admin overview for platform totals." />
        </div>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Payment History</h1>
      <p className="mt-1 text-sm text-ink/55">
        {role === 'creator' ? 'Every withdrawal you have requested.' : 'Every credit package you have purchased.'}
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white">
        {rows.length === 0 ? (
          <EmptyState title={role === 'creator' ? 'No withdrawals yet' : 'No payments yet'} body={role === 'creator' ? 'Your withdrawal requests will show up here.' : 'Purchased credit packages will show up here.'} />
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
