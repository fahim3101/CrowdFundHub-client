import { useEffect, useState } from 'react';
import { Layers, TrendingUp, Coins, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreatorHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [campaigns, setCampaigns] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalContribution, setModalContribution] = useState(null);

  const loadData = () => {
    if (!user?.email) return;
    Promise.all([
      axiosSecure.get(`/campaigns/creator/${user.email}`),
      axiosSecure.get(`/contributions/pending/${user.email}`),
    ]).then(([campRes, pendingRes]) => {
      setCampaigns(campRes.data);
      setPending(pendingRes.data);
      setLoading(false);
    });
  };

  useEffect(loadData, [user, axiosSecure]);

  const handleDecision = async (id, status) => {
    try {
      await axiosSecure.patch(`/contributions/status/${id}`, { status });
      toast.success(`Contribution ${status}`);
      setModalContribution(null);
      loadData();
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (loading) return <LoadingSpinner />;

  const activeCampaigns = campaigns.filter((c) => new Date(c.deadline) >= new Date()).length;
  const totalRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Welcome back, {user.displayName?.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-ink/55">Here's how your campaigns are doing.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Layers} label="Total campaigns" value={campaigns.length} tone="pine" />
        <StatCard icon={TrendingUp} label="Active campaigns" value={activeCampaigns} tone="gold" />
        <StatCard icon={Coins} label="Total raised" value={`${totalRaised} credits`} tone="brick" />
      </div>

      <h2 className="mt-10 text-lg font-semibold text-ink">Contributions to review</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-mist bg-white">
        {pending.length === 0 ? (
          <EmptyState title="No pending contributions" body="New pledges to your campaigns will show up here." />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Supporter</th>
                <th className="px-5 py-3">Campaign</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Details</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((c) => (
                <tr key={c._id} className="border-b border-mist last:border-0">
                  <td className="px-5 py-3">{c.supporter_name}</td>
                  <td className="px-5 py-3 text-ink/60">{c.campaign_title}</td>
                  <td className="figures px-5 py-3">{c.contribution_amount}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setModalContribution(c)}
                      className="flex items-center gap-1 text-xs text-pine hover:underline"
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDecision(c._id, 'approved')}
                        className="rounded-full bg-pine px-3 py-1.5 text-xs font-medium text-paper hover:bg-pine-dark"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(c._id, 'rejected')}
                        className="rounded-full border border-brick/30 px-3 py-1.5 text-xs font-medium text-brick hover:bg-brick/5"
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

      {modalContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold text-ink">Contribution detail</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="text-ink/50">Supporter:</span> {modalContribution.supporter_name}</p>
              <p><span className="text-ink/50">Campaign:</span> {modalContribution.campaign_title}</p>
              <p><span className="text-ink/50">Amount:</span> <span className="figures">{modalContribution.contribution_amount} credits</span></p>
              <p><span className="text-ink/50">Date:</span> {new Date(modalContribution.current_date).toLocaleString()}</p>
            </div>
            <button
              onClick={() => setModalContribution(null)}
              className="mt-6 w-full rounded-full border border-mist py-2.5 text-sm font-medium text-ink hover:bg-mist"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorHome;
