import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Forbidden = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
    <ShieldAlert className="text-brick" size={40} />
    <h1 className="mt-4 text-3xl font-semibold text-ink">Access restricted</h1>
    <p className="mt-3 max-w-sm text-ink/60">Your account role doesn't have access to this page.</p>
    <Link to="/dashboard" className="mt-7 rounded-full bg-pine px-6 py-3 text-sm font-semibold text-paper hover:bg-pine-dark">
      Back to dashboard
    </Link>
  </div>
);

export default Forbidden;
