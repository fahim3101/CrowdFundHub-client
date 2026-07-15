import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
    <p className="font-mono text-sm uppercase tracking-widest text-pine">404</p>
    <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">This page didn't reach its goal.</h1>
    <p className="mt-3 max-w-sm text-ink/60">The page you're looking for doesn't exist or may have been moved.</p>
    <Link to="/" className="mt-7 rounded-full bg-pine px-6 py-3 text-sm font-semibold text-paper hover:bg-pine-dark">
      Back to home
    </Link>
  </div>
);

export default NotFound;
