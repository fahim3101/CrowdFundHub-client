import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { loginWithEmail, loginWithGoogle, refreshRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const result = await loginWithGoogle();
      const user = result.user;

      // register-if-new: server no-ops if this email already has an account
      // (and never overwrites role for existing users)
      await axios.post(`${API_URL}/users`, {
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email,
        photoURL: user.photoURL || '',
        role: 'supporter',
      });

      // Pull fresh role instead of setTimeout hacks
      await refreshRole(user.email);

      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
      <h1 className="text-3xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-2 text-sm text-ink/60">Log in to see your credits, campaigns, and contributions.</p>

      <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="login-email" className="text-sm font-medium text-ink/80">Email</label>
          <input id="login-email" name="email" type="email" required placeholder="you@example.com"
            className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
        </div>

        <div>
          <label htmlFor="login-password" className="text-sm font-medium text-ink/80">Password</label>
          <div className="relative mt-1">
            <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
              className="focus-ring w-full rounded-lg border border-mist bg-white px-4 py-2.5 pr-10 text-sm outline-none" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded text-ink/40">
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && <p role="alert" className="rounded-lg bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>}

        <button type="submit" disabled={loading}
          className="mt-2 rounded-full bg-pine px-6 py-3 text-sm font-semibold text-paper transition hover:bg-pine-dark disabled:opacity-60">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-mist" />
        <span className="text-xs text-ink/40">or</span>
        <div className="h-px flex-1 bg-mist" />
      </div>

      <button onClick={handleGoogle}
        className="focus-ring flex items-center justify-center gap-2 rounded-full border border-mist bg-white px-6 py-3 text-sm font-medium text-ink transition hover:bg-mist">
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-ink/60">
        New here?{' '}
        <Link to="/register" className="font-medium text-pine hover:underline">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
