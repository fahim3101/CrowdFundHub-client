import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandCoins, Clock, Coins } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const SupporterHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [contributions, setContributions] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadData = () => {
    if (!user?.email) return;
    setLoading(true);
    setLoadError('');
    Promise.all([
      axiosSecure.get(`/contributions/supporter/${user.email}?page=0&limit=100`),
      axiosSecure.get(`/contributions/approved/${user.email}`),
    ])
      .then(([allRes, approvedRes]) => {
        setContributions(allRes.data.contributions);
        setApproved(approvedRes.data);
      })
      .catch(() => setLoadError('Could not load your contributions.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [user, axiosSecure]);

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

  const displayName = user.displayName || user.email?.split('@')[0] || 'there';

  const pendingCount = contributions.filter((c) => c.status === 'pending').length;
  const totalContributed = approved.reduce((sum, c) => sum + c.contribution_amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Welcome back, {displayName.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-ink/55">Here's where your support is going.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={HandCoins} label="Contributions made" value={contributions.length} tone="pine" />
        <StatCard icon={Clock} label="Pending review" value={pendingCount} tone="gold" />
        <StatCard icon={Coins} label="Total contributed" value={`${totalContributed} credits`} tone="brick" />
      </div>

      <h2 className="mt-10 text-lg font-semibold text-ink">Approved contributions</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-mist bg-white">
        {approved.length === 0 ? (
          <EmptyState
            title="No approved contributions yet"
            body="Once a creator approves your pledge, it shows up here."
            action={
              <Link to="/dashboard/explore-campaigns" className="rounded-full bg-pine px-5 py-2 text-sm font-semibold text-paper hover:bg-pine-dark">
                Explore campaigns
              </Link>
            }
          />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Campaign</th>
                <th className="px-5 py-3">Creator</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((c) => (
                <tr key={c._id} className="border-b border-mist last:border-0">
                  <td className="px-5 py-3">{c.campaign_title}</td>
                  <td className="px-5 py-3 text-ink/60">{c.creator_name}</td>
                  <td className="figures px-5 py-3">{c.contribution_amount}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SupporterHome;
