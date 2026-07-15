// The shared marketing-page heading: an eyebrow label, a serif title,
// and the signature progress-rule mark underneath it.
// Pass `invert` when placing this on a dark section background.
const SectionHeading = ({ eyebrow, title, subtitle, align = 'left', invert = false }) => {
  const isCenter = align === 'center';
  const titleColor = invert ? 'text-paper' : 'text-ink';
  const subtitleColor = invert ? 'text-paper/60' : 'text-ink/70';
  const eyebrowColor = invert ? 'text-gold' : 'text-pine/70';

  return (
    <div className={isCenter ? 'text-center' : 'text-left'}>
      {eyebrow && (
        <p className={`font-mono text-xs uppercase tracking-[0.2em] ${eyebrowColor}`}>{eyebrow}</p>
      )}
      <h2 className={`mt-2 text-3xl font-semibold sm:text-4xl ${titleColor}`}>{title}</h2>
      <div className={isCenter ? 'mx-auto rule-mark' : 'rule-mark'} />
      {subtitle && (
        <p className={`mt-4 max-w-2xl ${subtitleColor} ${isCenter ? 'mx-auto' : ''}`}>{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
