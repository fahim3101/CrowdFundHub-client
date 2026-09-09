import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldOff, Trash2 } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const Reports = () => {
  const axiosSecure = useAxiosSecure();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadReports = () => {
    setLoading(true);
    setLoadError('');
    axiosSecure
      .get('/reports')
      .then((res) => setReports(res.data))
      .catch(() => setLoadError('Could not load reports.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadReports, [axiosSecure]);

  const handleSuspend = async (campaignId, campaignTitle) => {
    if (!window.confirm(`Suspend "${campaignTitle || 'this campaign'}"? It will be hidden from supporters. This cannot be undone from here — use Manage Campaigns to re-approve.`)) return;
    try {
      await axiosSecure.patch(`/reports/suspend/${campaignId}`);
      toast.success('Campaign suspended');
      loadReports();
    } catch {
      toast.error('Could not suspend campaign');
    }
  };

  const handleDelete = async (reportId, campaignId) => {
    if (!window.confirm('Delete this campaign and dismiss the report?')) return;
    try {
      await axiosSecure.delete(`/reports/${reportId}/${campaignId}`);
      toast.success('Campaign deleted');
      loadReports();
    } catch {
      toast.error('Could not delete campaign');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (loadError)
    return (
      <div className="py-16 text-center">
        <p className="text-ink/60">{loadError}</p>
        <button
          onClick={loadReports}
          className="mt-4 rounded-full bg-pine px-6 py-2.5 text-sm font-semibold text-paper hover:bg-pine-dark"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Reports</h1>
      <p className="mt-1 text-sm text-ink/55">Campaigns flagged by supporters as suspicious or fraudulent.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white">
        {reports.length === 0 ? (
          <EmptyState title="No reports filed" body="Reported campaigns will appear here for review." />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Campaign</th>
                <th className="px-5 py-3">Reported by</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="border-b border-mist last:border-0">
                  <td title={r.campaign_title} className="max-w-[180px] truncate px-5 py-3">{r.campaign_title}</td>
                  <td className="px-5 py-3 text-ink/60">{r.reporter_name}</td>
                  <td title={r.reason} className="max-w-[240px] truncate px-5 py-3 text-ink/60">{r.reason}</td>
                  <td className="px-5 py-3 text-ink/50">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSuspend(r.campaign_id, r.campaign_title)}
                        aria-label={`Suspend campaign ${r.campaign_title}`}
                        className="focus-ring flex items-center gap-1 rounded-full border border-gold/40 px-3 py-1.5 text-xs font-medium text-gold-dark hover:bg-gold/10"
                      >
                        <ShieldOff size={13} /> Suspend
                      </button>
                      <button
                        onClick={() => handleDelete(r._id, r.campaign_id)}
                        aria-label={`Delete campaign ${r.campaign_title}`}
                        className="focus-ring flex items-center gap-1 rounded-full border border-brick/30 px-3 py-1.5 text-xs font-medium text-brick hover:bg-brick/5"
                      >
                        <Trash2 size={13} /> Delete
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

export default Reports;
