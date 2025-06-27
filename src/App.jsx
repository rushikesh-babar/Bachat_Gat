import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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
import ActiveLoansPage from './components/ActiveLoansPage';
import LoanDetailsPage from './components/LoanDetailsPage';
import MonthlyEmiCollection from './components/MonthlyEmiCollection';
import SelectEmiMonth from './components/SelectEmiMonth';
// NEW IMPORTS for Loan Closure
import OpenLoansListForClosure from './components/OpenLoansListForClosure';
import LoanClosureDetails from './components/LoanClosureDetails';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <>
        <ToastContainer position="top-center" autoClose={3000} />
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

          {/* Loan Management - Accessible to Admin and Member */}
          <Route
          path="/loans/active"
          element={
            <ProtectedRoute role={['Admin', 'Member']}>
               <ActiveLoansPage />
            </ProtectedRoute>
          }
        />
       <Route
       path="/loans/:loanId"
       element={
         <ProtectedRoute role={['Admin', 'Member']}>
             <LoanDetailsPage />
         </ProtectedRoute>
        }
      />

          {/* NEW LOAN CLOSURE ROUTES (removed "admin" from paths) */}
          <Route
            path="/close-loan" 
            element={
              <ProtectedRoute role="Admin">
                <OpenLoansListForClosure />
              </ProtectedRoute>
            }
          />
          <Route
            path="/close-loan/:loanId/details" 
            element={
              <ProtectedRoute role="Admin">
                <LoanClosureDetails />
              </ProtectedRoute>
            }
          />

          {/* EMI Collection */}
          <Route
            path="/monthly-emi-collection/:month/:year"
            element={
              <ProtectedRoute role="Admin">
                <MonthlyEmiCollection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/select-emi-month"
            element={
              <ProtectedRoute role="Admin">
                 <SelectEmiMonth />
              </ProtectedRoute>
            }
          />

        </Routes>
      </>
    </Router>
  );
}

export default App;
