import { useEffect, useState } from 'react';
import { Users, UserCog, Coins, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadData = () => {
    setLoading(true);
    setLoadError('');
    Promise.all([
      axiosSecure.get('/users'),
      axiosSecure.get('/campaigns/pending'),
      axiosSecure.get('/payments-count'),
    ])
      .then(([usersRes, pendingRes, paymentsRes]) => {
        setUsers(usersRes.data);
        setPendingCampaigns(pendingRes.data);
        setPaymentsCount(paymentsRes.data.count);
      })
      .catch(() => setLoadError('Could not load admin overview.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [axiosSecure]);

  const handleDecision = async (id, status) => {
    if (!window.confirm(`${status === 'approved' ? 'Approve' : 'Reject'} this campaign? This cannot be undone.`)) return;
    try {
      await axiosSecure.patch(`/campaigns/status/${id}`, { status });
      toast.success(`Campaign ${status}`);
      loadData();
    } catch {
      toast.error('Something went wrong');
    }
  };

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

  const supporters = users.filter((u) => u.role === 'supporter').length;
  const creators = users.filter((u) => u.role === 'creator').length;
  const totalCredits = users.reduce((sum, u) => sum + (u.credits || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Admin overview</h1>
      <p className="mt-1 text-sm text-ink/55">A snapshot of the whole platform.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total supporters" value={supporters} tone="pine" />
        <StatCard icon={UserCog} label="Total creators" value={creators} tone="gold" />
        <StatCard icon={Coins} label="Total credits in circulation" value={totalCredits} tone="brick" />
        <StatCard icon={Receipt} label="Total payments processed" value={paymentsCount} tone="pine" />
      </div>

      <h2 className="mt-10 text-lg font-semibold text-ink">Campaign approvals</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-mist bg-white">
        {pendingCampaigns.length === 0 ? (
          <EmptyState title="No campaigns waiting for approval" />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Creator</th>
                <th className="px-5 py-3">Goal</th>
                <th className="px-5 py-3">Deadline</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingCampaigns.map((c) => (
                <tr key={c._id} className="border-b border-mist last:border-0">
                  <td title={c.campaign_title} className="max-w-[220px] truncate px-5 py-3">{c.campaign_title}</td>
                  <td className="px-5 py-3 text-ink/60">{c.creator_name}</td>
                  <td className="figures px-5 py-3">{c.funding_goal}</td>
                  <td className="px-5 py-3 text-ink/50">{c.deadline}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDecision(c._id, 'approved')}
                        aria-label={`Approve campaign ${c.campaign_title}`}
                        className="focus-ring rounded-full bg-pine px-3 py-1.5 text-xs font-medium text-paper hover:bg-pine-dark"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(c._id, 'rejected')}
                        aria-label={`Reject campaign ${c.campaign_title}`}
                        className="focus-ring rounded-full border border-brick/30 px-3 py-1.5 text-xs font-medium text-brick hover:bg-brick/5"
                      >
                        Reject
                      </button>
                    </div>
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

export default AdminHome;
