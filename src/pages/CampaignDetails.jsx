import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Flag, Gift, Target } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import LoadingSpinner from '../components/LoadingSpinner';

const CampaignDetails = () => {
  const { id } = useParams();
  const { user, role, refreshCredits } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const fetchCampaign = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!campaign) return <p className="py-24 text-center text-ink/50">Campaign not found.</p>;

  const percent = Math.min(100, Math.round(((campaign.amount_raised || 0) / campaign.funding_goal) * 100));
  const isExpired = campaign.deadline && campaign.deadline < new Date().toISOString().slice(0, 10);
  const isAccepting = campaign.status === 'approved' && !isExpired;

  const handleContribute = async (e) => {
    e.preventDefault();
    const value = Number(amount);

    if (!Number.isInteger(value) || value <= 0) {
      return toast.error('Enter a valid credit amount');
    }
    if (value < campaign.minimum_contribution) {
      return toast.error(`Minimum contribution is ${campaign.minimum_contribution} credits`);
    }

    setSubmitting(true);
    try {
      await axiosSecure.post('/contributions', {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        contribution_amount: value,
        supporter_email: user.email,
        supporter_name: user.displayName,
        creator_email: campaign.creator_email,
        creator_name: campaign.creator_name,
      });
      toast.success('Contribution submitted — waiting on the creator to approve it');
      setAmount('');
      refreshCredits();
      fetchCampaign();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit contribution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post('/reports', {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        reporter_name: user.displayName,
        reporter_email: user.email,
        reason: reportReason,
      });
      toast.success('Thanks — the admin team will look into it');
      setShowReport(false);
      setReportReason('');
    } catch {
      toast.error('Could not submit report');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <span className="rounded-full bg-mist px-3 py-1 font-mono text-xs uppercase tracking-wide text-pine-dark">
        {campaign.category}
      </span>
      <h1 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">{campaign.campaign_title}</h1>
      <p className="mt-2 text-sm text-ink/60">by {campaign.creator_name}</p>

      <img
        src={campaign.campaign_image_url}
        alt={campaign.campaign_title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://picsum.photos/seed/${campaign._id}/1200/600`;
        }}
        className="mt-8 h-72 w-full rounded-2xl bg-mist object-cover sm:h-96"
      />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-ink">The story</h2>
          <p className="mt-3 whitespace-pre-line text-ink/70">{campaign.campaign_story}</p>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-mist bg-white p-4">
            <Gift className="mt-0.5 text-gold" size={20} />
            <div>
              <p className="text-sm font-semibold text-ink">What supporters receive</p>
              <p className="mt-1 text-sm text-ink/65">{campaign.reward_info}</p>
            </div>
          </div>

          {user && role === 'supporter' && (
            <button
              onClick={() => setShowReport(!showReport)}
              className="mt-6 flex items-center gap-1.5 text-sm text-brick/80 hover:underline"
            >
              <Flag size={14} /> Report this campaign
            </button>
          )}

          {showReport && (
            <form onSubmit={handleReport} className="mt-3 flex flex-col gap-3 rounded-xl border border-brick/20 bg-brick/5 p-4">
              <textarea
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Why does this campaign look suspicious or fraudulent?"
                className="focus-ring w-full rounded-lg border border-mist bg-white p-3 text-sm outline-none"
                rows={3}
              />
              <button type="submit" className="w-fit rounded-full bg-brick px-4 py-2 text-sm font-medium text-paper">
                Submit report
              </button>
            </form>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-mist bg-white p-6">
          <div className="progress-rule-lg">
            <span style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="figures text-2xl font-semibold text-pine">{campaign.amount_raised || 0}</span>
            <span className="text-sm text-ink/50">of {campaign.funding_goal} credits</span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-ink/60">
            <Calendar size={15} /> Deadline: {campaign.deadline}
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-ink/60">
            <Target size={15} /> Minimum contribution: {campaign.minimum_contribution} credits
          </div>

          <div className="mt-6 border-t border-mist pt-6">
            {!isAccepting ? (
              <p className="text-center text-sm text-ink/50">
                {isExpired
                  ? 'This campaign has expired.'
                  : `This campaign is ${campaign.status} and not accepting contributions right now.`}
              </p>
            ) : !user ? (
              <div className="text-center">
                <p className="text-sm text-ink/60">Log in as a supporter to contribute.</p>
                <Link to="/login" className="mt-3 block rounded-full bg-pine px-4 py-2.5 text-center text-sm font-semibold text-paper">
                  Log in
                </Link>
              </div>
            ) : role !== 'supporter' ? (
              <p className="text-center text-sm text-ink/50">Only supporter accounts can contribute credits.</p>
            ) : (
              <form onSubmit={handleContribute} className="flex flex-col gap-3">
                <label className="text-sm font-medium text-ink/80">Contribution amount (credits)</label>
                <input
                  type="number"
                  min={campaign.minimum_contribution}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min ${campaign.minimum_contribution}`}
                  className="focus-ring rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Contribute'}
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CampaignDetails;
