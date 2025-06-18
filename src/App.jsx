import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // ✅ Added for global toast support
import LoginPage from './components/LoginPage';
import MemberForm from './components/MemberForm';
import ViewMembers from './components/ViewMembers';
import UpdateMember from './components/UpdateMember';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardRegular from './components/DashboardRegular';
import ProtectedRoute from './components/ProtectedRoute';
import MemberDetails from './components/MemberDetails';
import UpdateMemberList from './components/UpdateMemberList';
import SelectMonthYear from './components/SelectMonthYear';
import AddCollectionForm from './components/AddCollectionForm';
import AddCollectionList from './components/AddCollectionList';
import PaidUnpaidMembersList from './components/PaidUnpaidMemberList';
import MemberwiseCollection from './components/MemberwiseCollection';
import MonthwiseCollectionView from './components/MonthwiseCollectionView';
import SelectMonthYearForView from './components/SelectMonthYearFormView';
import AddLoanForm from './components/AddLoanForm';
import SelectMemberForLoan from './components/SelectMemberForLoan';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Toastify styles

function App() {
  return (
    <Router>
      <>
        <ToastContainer position="top-center" autoClose={3000} /> {/* ✅ ToastContainer added */}
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

          {/* Shared routes: Admin + Member */}
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

          {/* Dashboards */}
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

          {/* Admin monthly savings flow */}
          <Route
            path="/select-month"
            element={
              <ProtectedRoute role="Admin">
                <SelectMonthYear />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-collection-form/:memberId"
            element={
              <ProtectedRoute role="Admin">
                <AddCollectionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-collection-list/:month/:year"
            element={
              <ProtectedRoute role="Admin">
                <AddCollectionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collection-summary"
            element={
              <ProtectedRoute role="Admin">
                <PaidUnpaidMembersList />
              </ProtectedRoute>
            }
          />

          {/* Collection view routes */}
          <Route
            path="/memberwise-collection"
            element={
              <ProtectedRoute role={['Admin', 'Member']}>
                <MemberwiseCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monthwise-collection/:month/:year"
            element={
              <ProtectedRoute role={['Admin', 'Member']}>
                <MonthwiseCollectionView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-monthwise-view"
            element={
              <ProtectedRoute role={['Admin', 'Member']}>
                <SelectMonthYearForView />
              </ProtectedRoute>
            }
          />
           <Route
            path="/select-member-loan"
            element={
              <ProtectedRoute role="Admin">
               <SelectMemberForLoan />          
              </ProtectedRoute>
            }
          />
          
          <Route
  path="/add-loan-details/:memberId"
  element={
    <ProtectedRoute role="Admin">
      <AddLoanForm />
    </ProtectedRoute>
  }
/>

          
        </Routes>
      </>
    </Router>
  );
}

export default App;
