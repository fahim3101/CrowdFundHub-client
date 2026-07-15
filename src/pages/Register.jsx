import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UploadCloud } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { uploadToImgBB } from '../api/imgbb';

const API_URL = import.meta.env.VITE_API_URL;

const passwordIssue = (password) => {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Password needs at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password needs at least one lowercase letter';
  return '';
};

const Register = () => {
  const { registerWithEmail, loginWithGoogle, updateUserProfile, refreshRole } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const role = form.role.value;

    console.log('Registering with role:', role);

    const pwIssue = passwordIssue(password);
    if (pwIssue) return setError(pwIssue);

    setLoading(true);
    try {
      let photoURL = '';
      if (photoFile) {
        setUploading(true);
        photoURL = await uploadToImgBB(photoFile);
        setUploading(false);
      } else {
        // No photo - leave empty (will show initial letter instead of random avatar)
        photoURL = '';
      }

      const result = await registerWithEmail(email, password);
      await updateUserProfile({ displayName: name, photoURL });

      // Create user in MongoDB - this MUST succeed before continuing
      try {
        console.log('Creating user in MongoDB with role:', role);
        const userRes = await axios.post(`${API_URL}/users`, {
          name,
          email,
          photoURL,
          role,
        });
        console.log('MongoDB user created:', userRes.data);
      } catch (dbErr) {
        // If MongoDB user creation fails, delete the Firebase user to prevent orphan accounts
        console.error('Failed to create user in DB:', dbErr);
        await result.user.delete();
        throw new Error('Failed to create account. Please try again.');
      }

      toast.success('Account created! Welcome to CrowdFundHub.');

      // Pull the freshly-written role into AuthContext before navigating,
      // so DashboardRedirect sends the user to the right home.
      await refreshRole(email);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      // Check for Firebase auth errors first
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (err.code === 'auth/invalid-email') {
        setError('That email address looks invalid');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (err.response?.data?.message) {
        // Server error
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const result = await loginWithGoogle();
      const user = result.user;

      await axios.post(`${API_URL}/users`, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'supporter',
      });

      // Pull the role into context before navigating so the dashboard
      // redirect sees the right role instead of falling through to '/'.
      await refreshRole(user.email);

      toast.success('Welcome to CrowdFundHub!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google register error:', err);
      toast.error(err.response?.data?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
      <h1 className="text-3xl font-semibold text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink/60">Join as a supporter or a creator — you can always start light.</p>

      <form onSubmit={handleRegister} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink/80">Full name</label>
          <input name="name" type="text" required placeholder="Jane Doe"
            className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Email</label>
          <input name="email" type="email" required placeholder="you@example.com"
            className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Profile picture</label>
          <label className="focus-ring mt-1 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-mist bg-white px-4 py-3">
            {photoPreview ? (
              <img src={photoPreview} alt="preview" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-ink/40">
                <UploadCloud size={18} />
              </span>
            )}
            <span className="text-sm text-ink/50">
              {photoPreview ? 'Change photo' : 'Click to upload a photo (optional)'}
            </span>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </label>
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">I want to join as</label>
          <select name="role" defaultValue="supporter"
            className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none">
            <option value="supporter">Supporter — I want to back campaigns</option>
            <option value="creator">Creator — I want to launch a campaign</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Password</label>
          <div className="relative mt-1">
            <input name="password" type={showPassword ? 'text' : 'password'} required
              placeholder="At least 6 characters, 1 upper, 1 lower"
              className="focus-ring w-full rounded-lg border border-mist bg-white px-4 py-2.5 pr-10 text-sm outline-none" />
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && <p className="rounded-lg bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>}

        <button type="submit" disabled={loading}
          className="mt-2 rounded-full bg-pine px-6 py-3 text-sm font-semibold text-paper transition hover:bg-pine-dark disabled:opacity-60">
          {uploading ? 'Uploading photo…' : loading ? 'Creating account…' : 'Create account'}
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
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-pine hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
