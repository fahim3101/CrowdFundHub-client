import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Trash2, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyCampaigns = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(null);

  const loadCampaigns = () => {
    if (!user?.email) return;
    setLoading(true);
    setLoadError('');
    axiosSecure
      .get(`/campaigns/creator/${user.email}`)
      .then((res) => setCampaigns(res.data))
      .catch(() => setLoadError('Could not load your campaigns.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadCampaigns, [user, axiosSecure]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign? Approved supporters will be refunded automatically.')) return;
    try {
      await axiosSecure.delete(`/campaigns/${id}`);
      toast.success('Campaign deleted, supporters refunded');
      loadCampaigns();
    } catch {
      toast.error('Could not delete campaign');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await axiosSecure.patch(`/campaigns/${editing._id}`, {
        campaign_title: form.campaign_title.value,
        campaign_story: form.campaign_story.value,
        reward_info: form.reward_info.value,
      });
      toast.success('Campaign updated');
      setEditing(null);
      loadCampaigns();
    } catch {
      toast.error('Could not update campaign');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (loadError)
    return (
      <div className="py-16 text-center">
        <p className="text-ink/60">{loadError}</p>
        <button
          onClick={loadCampaigns}
          className="mt-4 rounded-full bg-pine px-6 py-2.5 text-sm font-semibold text-paper hover:bg-pine-dark"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">My Campaigns</h1>
      <p className="mt-1 text-sm text-ink/55">Everything you have launched, newest deadline first.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white">
        {campaigns.length === 0 ? (
          <EmptyState
            title="You haven't launched a campaign yet"
            body="Add your first campaign to get started."
            action={
              <Link to="/dashboard/add-campaign" className="rounded-full bg-pine px-5 py-2 text-sm font-semibold text-paper hover:bg-pine-dark">
                Add campaign
              </Link>
            }
          />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Goal</th>
                <th className="px-5 py-3">Raised</th>
                <th className="px-5 py-3">Deadline</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} className="border-b border-mist last:border-0">
                  <td title={c.campaign_title} className="max-w-[220px] truncate px-5 py-3">{c.campaign_title}</td>
                  <td className="figures px-5 py-3">{c.funding_goal}</td>
                  <td className="figures px-5 py-3">{c.amount_raised || 0}</td>
                  <td className="px-5 py-3 text-ink/50">{c.deadline}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(c)} aria-label={`Edit campaign ${c.campaign_title}`} className="focus-ring rounded-full p-2 text-pine hover:bg-mist">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(c._id)} aria-label={`Delete campaign ${c.campaign_title}`} className="focus-ring rounded-full p-2 text-brick hover:bg-mist">
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

      {editing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit campaign"
          onKeyDown={(e) => { if (e.key === 'Escape') setEditing(null); }}
          onClick={() => setEditing(null)}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 px-5 py-8"
        >
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Edit campaign</h3>
              <button onClick={() => setEditing(null)} aria-label="Close edit dialog"><X size={20} className="text-ink/40" /></button>
            </div>
            <form onSubmit={handleUpdate} className="mt-4 flex flex-col gap-3">
              <label htmlFor="edit-title" className="text-sm font-medium text-ink/80">Campaign title</label>
              <input id="edit-title" name="campaign_title" defaultValue={editing.campaign_title} required
                className="focus-ring rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
              <label htmlFor="edit-story" className="text-sm font-medium text-ink/80">Campaign story</label>
              <textarea id="edit-story" name="campaign_story" defaultValue={editing.campaign_story} rows={4} required
                className="focus-ring rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
              <label htmlFor="edit-reward" className="text-sm font-medium text-ink/80">Reward info</label>
              <input id="edit-reward" name="reward_info" defaultValue={editing.reward_info} required
                className="focus-ring rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
              <button type="submit" className="mt-1 rounded-full bg-pine px-6 py-2.5 text-sm font-semibold text-paper hover:bg-pine-dark">
                Save changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCampaigns;
