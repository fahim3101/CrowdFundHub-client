import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    axiosSecure.get('/users').then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  };

  useEffect(loadUsers, [axiosSecure]);

  const handleRoleChange = async (id, role) => {
    try {
      await axiosSecure.patch(`/users/role/${id}`, { role });
      toast.success('Role updated');
      loadUsers();
    } catch {
      toast.error('Could not update role');
    }
  };

  const handleRemove = async (id) => {
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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Manage Users</h1>
      <p className="mt-1 text-sm text-ink/55">Every registered account on the platform.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white">
        {users.length === 0 ? (
          <EmptyState title="No users yet" />
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
              {users.map((u) => (
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
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="focus-ring rounded-lg border border-mist bg-white px-2.5 py-1.5 text-xs outline-none"
                    >
                      <option value="supporter">Supporter</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleRemove(u._id)} className="rounded-full p-2 text-brick hover:bg-mist">
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
