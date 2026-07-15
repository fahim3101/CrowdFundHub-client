import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageCampaigns = () => {
  const axiosSecure = useAxiosSecure();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCampaigns = () => {
    axiosSecure.get('/campaigns/all').then((res) => {
      setCampaigns(res.data);
      setLoading(false);
    });
  };

  useEffect(loadCampaigns, [axiosSecure]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign permanently?')) return;
    try {
      await axiosSecure.delete(`/campaigns/admin/${id}`);
      toast.success('Campaign deleted');
      loadCampaigns();
    } catch {
      toast.error('Could not delete campaign');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Manage Campaigns</h1>
      <p className="mt-1 text-sm text-ink/55">Every campaign on the platform, regardless of status.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white">
        {campaigns.length === 0 ? (
          <EmptyState title="No campaigns yet" />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Creator</th>
                <th className="px-5 py-3">Raised / Goal</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} className="border-b border-mist last:border-0">
                  <td className="max-w-[220px] truncate px-5 py-3">{c.campaign_title}</td>
                  <td className="px-5 py-3 text-ink/60">{c.creator_name}</td>
                  <td className="figures px-5 py-3">{c.amount_raised || 0} / {c.funding_goal}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(c._id)} className="rounded-full p-2 text-brick hover:bg-mist">
                      <Trash2 size={15} />
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

export default ManageCampaigns;
