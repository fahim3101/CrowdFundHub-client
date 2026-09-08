const styles = {
  pending: 'bg-gold/15 text-gold-dark',
  approved: 'bg-pine/10 text-pine',
  rejected: 'bg-brick/10 text-brick',
  suspended: 'bg-brick/10 text-brick',
  open: 'bg-gold/15 text-gold-dark',
  supporter: 'bg-pine/10 text-pine',
  creator: 'bg-gold/15 text-gold-dark',
  admin: 'bg-ink text-paper',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status] || 'bg-mist text-ink/60'}`}>
    {status}
  </span>
);

export default StatusBadge;
