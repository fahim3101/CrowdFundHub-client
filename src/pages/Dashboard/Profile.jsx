import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Camera, Coins, HandCoins, Layers, Receipt, Save } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { uploadToImgBB } from '../../api/imgbb';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const Profile = () => {
  const { user, role, credits, refreshRole, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ a: 0, b: 0, c: 0 });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    axiosSecure
      .get(`/users/${user.email}`)
      .then((res) => {
        setProfile(res.data);
        setName(res.data.name || '');
      })
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false));
  }, [user, axiosSecure]);

  // Role-wise quick stats
  useEffect(() => {
    if (!user?.email || !role) return;
    const load = async () => {
      try {
        if (role === 'supporter') {
          const [cRes, pRes] = await Promise.all([
            axiosSecure.get(`/contributions/supporter/${user.email}?page=0&limit=1`),
            axiosSecure.get(`/payments/${user.email}`),
          ]);
          setStats({
            a: cRes.data.total || 0,
            b: pRes.data.length || 0,
            c: pRes.data.reduce((s, p) => s + (p.credits || 0), 0),
          });
        } else if (role === 'creator') {
          const [cRes, wRes] = await Promise.all([
            axiosSecure.get(`/campaigns/creator/${user.email}`),
            axiosSecure.get(`/withdrawals/creator/${user.email}`),
          ]);
          setStats({
            a: cRes.data.length || 0,
            b: cRes.data.reduce((s, c) => s + (c.amount_raised || 0), 0),
            c: wRes.data.filter((w) => w.status === 'pending').length || 0,
          });
        } else if (role === 'admin') {
          const [uRes, cRes, rRes] = await Promise.all([
            axiosSecure.get('/users'),
            axiosSecure.get('/campaigns/all'),
            axiosSecure.get('/reports'),
          ]);
          setStats({ a: uRes.data.length || 0, b: cRes.data.length || 0, c: rRes.data.length || 0 });
        }
      } catch {
        // stats optional — profile still works
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, role]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file');
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      let photoURL = profile?.photoURL || user?.photoURL || '';
      if (photoFile) {
        try {
          photoURL = await uploadToImgBB(photoFile);
        } catch {
          return toast.error('Photo upload failed');
        }
      }
      await updateUserProfile({ displayName: name.trim(), photoURL });
      await axiosSecure.patch(`/users/profile/${user.email}`, {
        name: name.trim(),
        photoURL,
      });
      await refreshRole(user.email);
      setProfile((p) => ({ ...p, name: name.trim(), photoURL }));
      setPhotoFile(null);
      if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
      setPhotoPreview('');
      setEditing(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile)
    return (
      <div className="py-16 text-center">
        <p className="text-ink/60">Could not load profile.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-pine px-6 py-2.5 text-sm font-semibold text-paper hover:bg-pine-dark"
        >
          Retry
        </button>
      </div>
    );

  const avatar = photoPreview || profile.photoURL || user?.photoURL;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-ink">My Profile</h1>
      <p className="mt-1 text-sm text-ink/55">Your account info — visible only to you.</p>

      <div className="mt-6 rounded-2xl border border-mist bg-white p-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="relative">
            {avatar ? (
              <img src={avatar} alt={profile.name || profile.email || 'User'} onError={(e) => { e.currentTarget.style.display = 'none'; }} className="h-20 w-20 rounded-full border-2 border-pine/20 object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-pine/20 bg-mist text-2xl font-semibold text-pine">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {editing && (
              <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-pine p-2 text-paper shadow hover:bg-pine-dark" title="Change photo">
                <Camera size={14} />
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="truncate text-xl font-semibold text-ink">{profile.name}</h2>
              <StatusBadge status={role} />
            </div>
            <p className="mt-1 truncate text-sm text-ink/55">{profile.email}</p>
            <p className="figures mt-2 inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-sm font-semibold text-pine-dark">
              <Coins size={14} /> {credits} credits
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-mist pt-5 text-sm sm:grid-cols-3">
          <div>
            <p className="text-ink/45">Member since</p>
            <p className="mt-1 font-medium text-ink">
              {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
            </p>
          </div>
          <div>
            <p className="text-ink/45">Role</p>
            <p className="mt-1 font-medium capitalize text-ink">{role}</p>
          </div>
          <div>
            <p className="text-ink/45">Email</p>
            <p className="mt-1 truncate font-medium text-ink">{profile.email}</p>
          </div>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="mt-6 w-full rounded-full border border-mist px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist"
          >
            Edit profile
          </button>
        ) : (
          <form onSubmit={handleSave} className="mt-6 flex flex-col gap-3 border-t border-mist pt-5">
            <label htmlFor="profile-name" className="text-sm font-medium text-ink/80">Display name</label>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="focus-ring rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none"
            />
            {photoPreview && (
              <img src={photoPreview} alt="New profile preview" className="h-16 w-16 rounded-full object-cover" />
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pine px-6 py-2.5 text-sm font-semibold text-paper hover:bg-pine-dark disabled:opacity-60"
              >
                <Save size={15} /> {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setName(profile.name || '');
                  setPhotoFile(null);
                  if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
                  setPhotoPreview('');
                }}
                className="rounded-full border border-mist px-5 py-2.5 text-sm font-medium text-ink/70 hover:bg-mist"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {role === 'supporter' && (
          <>
            <StatCard icon={HandCoins} label="Total contributions" value={stats.a} />
            <StatCard icon={Receipt} label="Payments made" value={stats.b} tone="gold" />
            <StatCard icon={Coins} label="Credits purchased" value={stats.c} tone="brick" />
          </>
        )}
        {role === 'creator' && (
          <>
            <StatCard icon={Layers} label="Campaigns launched" value={stats.a} />
            <StatCard icon={Coins} label="Total raised" value={`${stats.b}`} tone="gold" />
            <StatCard icon={HandCoins} label="Pending withdrawals" value={stats.c} tone="brick" />
          </>
        )}
        {role === 'admin' && (
          <>
            <StatCard icon={HandCoins} label="Total users" value={stats.a} />
            <StatCard icon={Layers} label="Total campaigns" value={stats.b} tone="gold" />
            <StatCard icon={Receipt} label="Open reports" value={stats.c} tone="brick" />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
