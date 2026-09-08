import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = () => {
    setLoading(true);
    axiosSecure
      .get('/users')
      .then((res) => setUsers(res.data))
      .catch(() => toast.error('Could not load users'))
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, [axiosSecure]);

  const handleRoleChange = async (id, role, targetEmail) => {
    if (targetEmail === currentUser?.email && role !== 'admin') {
      return toast.error('You cannot demote yourself — ask another admin.');
    }
    try {
      await axiosSecure.patch(`/users/role/${id}`, { role });
      toast.success('Role updated');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update role');
    }
  };

  const handleRemove = async (id, targetEmail) => {
    if (targetEmail === currentUser?.email) {
      return toast.error('You cannot delete yourself.');
    }
    if (!window.confirm('Remove this user permanently?')) return;
    try {
      await axiosSecure.delete(`/users/${id}`);
      toast.success('User removed');
      loadUsers();
    } catch {
      toast.error('Could not remove user');
    }
  };

  if (loading) return <LoadingSpinner />;

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Manage Users</h1>
      <p className="mt-1 text-sm text-ink/55">Every registered account on the platform.</p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email…"
        className="focus-ring mt-5 w-full max-w-sm rounded-full border border-mist bg-white px-4 py-2.5 text-sm outline-none"
      />

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white">
        {filtered.length === 0 ? (
          <EmptyState title={users.length === 0 ? 'No users yet' : 'No users match your search'} />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Credits</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-b border-mist last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      {u.photoURL ? (
                        <img src={u.photoURL} alt="" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-xs font-semibold text-pine">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink/60">{u.email}</td>
                  <td className="figures px-5 py-3">{u.credits}</td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value, u.email)}
                      className="focus-ring rounded-lg border border-mist bg-white px-2.5 py-1.5 text-xs outline-none"
                    >
                      <option value="supporter">Supporter</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleRemove(u._id, u.email)} className="rounded-full p-2 text-brick hover:bg-mist">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
