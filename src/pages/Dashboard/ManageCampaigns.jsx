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
    setLoading(true);
    axiosSecure
      .get('/campaigns/all')
      .then((res) => setCampaigns(res.data))
      .catch(() => toast.error('Could not load campaigns'))
      .finally(() => setLoading(false));
  };

  useEffect(loadCampaigns, [axiosSecure]);

  const handleStatus = async (id, status) => {
    try {
      await axiosSecure.patch(`/campaigns/status/${id}`, { status });
      toast.success(`Campaign ${status}`);
      loadCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign permanently? Supporters will be refunded.')) return;
    try {
      const res = await axiosSecure.delete(`/campaigns/admin/${id}`);
      toast.success(`Campaign deleted${res.data?.refundedCount ? `, ${res.data.refundedCount} refunded` : ''}`);
      loadCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete campaign');
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
                    <div className="flex justify-end gap-1">
                      {c.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatus(c._id, 'approved')}
                            className="rounded-full bg-pine px-3 py-1.5 text-xs font-medium text-paper hover:bg-pine-dark"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatus(c._id, 'rejected')}
                            className="rounded-full border border-brick/30 px-3 py-1.5 text-xs font-medium text-brick hover:bg-brick/10"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(c._id)} className="rounded-full p-2 text-brick hover:bg-mist">
                        <Trash2 size={15} />
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

export default ManageCampaigns;
