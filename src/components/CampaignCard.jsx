import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const daysLeft = (deadline) => {
  const diff = new Date(deadline) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

const fallbackImg = (id) => `https://picsum.photos/seed/${id || 'campaign'}/800/500`;

const CampaignCard = ({ campaign }) => {
  const percent = Math.min(
    100,
    Math.round(((campaign.amount_raised || 0) / campaign.funding_goal) * 100)
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-mist bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-pine/10">
      <div className="relative h-44 overflow-hidden bg-mist">
        <img
          src={campaign.campaign_image_url}
          alt={campaign.campaign_title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImg(campaign._id);
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-paper">
          {campaign.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-semibold text-ink">{campaign.campaign_title}</h3>
        <p className="mt-1 text-sm text-ink/60">by {campaign.creator_name}</p>

        <div className="mt-4 progress-rule">
          <span style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="figures font-semibold text-pine">{campaign.amount_raised || 0} credits</span>
          <span className="text-ink/50">of {campaign.funding_goal} goal</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-mist pt-4">
          <span className="flex items-center gap-1.5 text-xs text-ink/60">
            <Clock size={14} /> {daysLeft(campaign.deadline)} days left
          </span>
          <Link
            to={`/campaign/${campaign._id}`}
            className="rounded-full bg-pine px-4 py-1.5 text-sm font-medium text-paper transition hover:bg-pine-dark"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
