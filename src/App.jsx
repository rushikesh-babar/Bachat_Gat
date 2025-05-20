import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MemberForm from './components/MemberForm';
import ViewMembers from './components/ViewMembers';
import UpdateMember from './components/UpdateMember';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardRegular from './components/DashboardRegular';
import ProtectedRoute from './components/ProtectedRoute';
import MemberDetails from './components/MemberDetails';
import UpdateMemberList from './components/UpdateMemberList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin-only routes */}
        <Route
          path="/memberform"
          element={
            <ProtectedRoute role="Admin">
              <MemberForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-member/:id"
          element={
            <ProtectedRoute role="Admin">
              <UpdateMember />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-members"
          element={
            <ProtectedRoute role="Admin">
              <UpdateMemberList />
            </ProtectedRoute>
          }
        />

        {/* Both Admin and Member can access */}
        <Route
          path="/view-members"
          element={
            <ProtectedRoute role={['Admin', 'Member']}>
              <ViewMembers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member-details/:id"
          element={
            <ProtectedRoute role={['Admin', 'Member']}>
              <MemberDetails />
            </ProtectedRoute>
          }
        />

        {/* Dashboards now protected by role */}
        <Route
          path="/dashboards/admin"
          element={
            <ProtectedRoute role="Admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboards/regular"
          element={
            <ProtectedRoute role="Member">
              <DashboardRegular />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
