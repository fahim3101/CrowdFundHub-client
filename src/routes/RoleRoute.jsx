import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

// Wraps a route that only ONE role should reach, e.g. /dashboard/manage-users.
// Someone typing the URL directly with the wrong role gets bounced, not shown a broken page.
const RoleRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to="/forbidden" replace />;

  return children;
};

export default RoleRoute;
