import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/LoadingSpinner';

// /dashboard by itself sends the user to their own home route
const DashboardRedirect = () => {
  const { role, loading } = useAuth();

  if (loading || !role) return <LoadingSpinner />;

  const routes = {
    supporter: '/dashboard/supporter-home',
    creator: '/dashboard/creator-home',
    admin: '/dashboard/admin-home',
  };

  return <Navigate to={routes[role] || '/'} replace />;
};

export default DashboardRedirect;
