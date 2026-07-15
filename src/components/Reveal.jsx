import useInView from '../hooks/useInView';

// Wraps any section so it fades and slides up into place the first time
// it scrolls into view — the homepage's scroll animation.
const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

export default Reveal;
