import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

import Home from '../pages/Home/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ExploreCampaigns from '../pages/ExploreCampaigns';
import CampaignDetails from '../pages/CampaignDetails';
import NotFound from '../pages/NotFound';
import Forbidden from '../pages/Forbidden';

import DashboardRedirect from '../pages/Dashboard/DashboardRedirect';
import SupporterHome from '../pages/Dashboard/SupporterHome';
import MyContributions from '../pages/Dashboard/MyContributions';
import PurchaseCredit from '../pages/Dashboard/PurchaseCredit';
import PaymentHistory from '../pages/Dashboard/PaymentHistory';
import CreatorHome from '../pages/Dashboard/CreatorHome';
import AddCampaign from '../pages/Dashboard/AddCampaign';
import MyCampaigns from '../pages/Dashboard/MyCampaigns';
import Withdrawals from '../pages/Dashboard/Withdrawals';
import AdminHome from '../pages/Dashboard/AdminHome';
import ManageUsers from '../pages/Dashboard/ManageUsers';
import ManageCampaigns from '../pages/Dashboard/ManageCampaigns';
import WithdrawalRequests from '../pages/Dashboard/WithdrawalRequests';
import Reports from '../pages/Dashboard/Reports';
import Profile from '../pages/Dashboard/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'explore-campaigns', element: <ExploreCampaigns /> },
      { path: 'campaign/:id', element: <CampaignDetails /> },
      { path: 'forbidden', element: <Forbidden /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <DashboardRedirect /> },

      // Supporter
      { path: 'supporter-home', element: <RoleRoute allowedRole="supporter"><SupporterHome /></RoleRoute> },
      { path: 'explore-campaigns', element: <RoleRoute allowedRole="supporter"><ExploreCampaigns /></RoleRoute> },
      { path: 'my-contributions', element: <RoleRoute allowedRole="supporter"><MyContributions /></RoleRoute> },
      { path: 'purchase-credit', element: <RoleRoute allowedRole="supporter"><PurchaseCredit /></RoleRoute> },

      // Creator
      { path: 'creator-home', element: <RoleRoute allowedRole="creator"><CreatorHome /></RoleRoute> },
      { path: 'add-campaign', element: <RoleRoute allowedRole="creator"><AddCampaign /></RoleRoute> },
      { path: 'my-campaigns', element: <RoleRoute allowedRole="creator"><MyCampaigns /></RoleRoute> },
      { path: 'withdrawals', element: <RoleRoute allowedRole="creator"><Withdrawals /></RoleRoute> },

      // Shared between supporter + creator
      { path: 'payment-history', element: <PaymentHistory /> },

      // Shared by all roles
      { path: 'profile', element: <Profile /> },

      // Admin
      { path: 'admin-home', element: <RoleRoute allowedRole="admin"><AdminHome /></RoleRoute> },
      { path: 'manage-users', element: <RoleRoute allowedRole="admin"><ManageUsers /></RoleRoute> },
      { path: 'manage-campaigns', element: <RoleRoute allowedRole="admin"><ManageCampaigns /></RoleRoute> },
      { path: 'withdrawal-requests', element: <RoleRoute allowedRole="admin"><WithdrawalRequests /></RoleRoute> },
      { path: 'reports', element: <RoleRoute allowedRole="admin"><Reports /></RoleRoute> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
