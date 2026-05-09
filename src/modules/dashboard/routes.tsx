// DashboardRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./components/routes/AuthRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import MainLayout from "./layout/MainLayout";
import Profile from "./pages/student/Profile";
import "react-quill/dist/quill.snow.css";
import ErrorPage from "./pages/student/ErrorPage";
import Dashboard from "./pages/student/Dashboard";
import Payments from "./pages/student/Payments";
import Settings from "./pages/student/Settings";
import MyTutors from "./pages/student/MyTutors";
import FindTutors from "./pages/student/FindTutors";
import MyLessons from "./pages/student/MyLessons";
import Messages from "./pages/student/Messages";
import TutorDetail from "./pages/student/TutorDetail";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorLessons from "./pages/tutor/TutorLessons";
import TutorAvailability from "./pages/tutor/TutorAvailability";
import TutorStudents from "./pages/tutor/TutorStudents";
import TutorProfile from "./pages/tutor/TutorProfile";
import TutorReviews from "./pages/tutor/TutorReviews";
import TutorMessages from "./pages/tutor/TutorMessages";
import TutorEarnings from "./pages/tutor/TutorEarnings";
import TutorSettings from "./pages/tutor/TutorSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTutors from "./pages/admin/AdminTutors";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminOrgs from "./pages/admin/AdminOrgs";
import OrgAdminDashboard from "./pages/orgAdmin/OrgAdminDashboard";
import OrgLearners from "./pages/orgAdmin/OrgLearners";
import OrgLearnerDetail from "./pages/orgAdmin/OrgLearnerDetail";
import OrgInvitations from "./pages/orgAdmin/OrgInvitations";
import OrgEsolTeachers from "./pages/orgAdmin/OrgEsolTeachers";
import OrgSettings from "./pages/orgAdmin/OrgSettings";
import EsolLearnerHome from "./pages/student/EsolLearnerHome";
import EsolSession from "./pages/student/EsolSession";
import EsolVocab from "./pages/student/EsolVocab";
import RoleRoute from "./components/routes/RoleRoute";

export const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/tutors/:id" element={<TutorDetail />} />
          {/* ── Student routes ── */}
          <Route element={<RoleRoute allowed={["student"]} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-tutors" element={<MyTutors />} />
            <Route path="/tutors" element={<FindTutors />} />
            <Route path="/lessons" element={<MyLessons />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* ESOL learner routes (org-managed students) */}
            <Route path="/esol/home" element={<EsolLearnerHome />} />
            <Route path="/esol/sessions/:sessionId" element={<EsolSession />} />
            <Route path="/esol/vocab" element={<EsolVocab />} />
          </Route>

          {/* ── Org admin routes ── */}
          <Route element={<RoleRoute allowed={["org_admin"]} />}>
            <Route path="/org/home" element={<OrgAdminDashboard />} />
            <Route path="/org/learners" element={<OrgLearners />} />
            <Route
              path="/org/learners/:learnerId"
              element={<OrgLearnerDetail />}
            />
            <Route path="/org/invitations" element={<OrgInvitations />} />
            <Route path="/org/teachers" element={<OrgEsolTeachers />} />
            <Route path="/org/settings" element={<OrgSettings />} />
          </Route>

          {/* ── Tutor routes ── */}
          <Route element={<RoleRoute allowed={["tutor"]} />}>
            <Route path="/tutor/home" element={<TutorDashboard />} />
            <Route path="/tutor/lessons" element={<TutorLessons />} />
            <Route path="/tutor/availability" element={<TutorAvailability />} />
            <Route path="/tutor/students" element={<TutorStudents />} />
            <Route path="/tutor/profile" element={<TutorProfile />} />
            <Route path="/tutor/reviews" element={<TutorReviews />} />
            <Route path="/tutor/messages" element={<TutorMessages />} />
            <Route path="/tutor/earnings" element={<TutorEarnings />} />
            <Route path="/tutor/settings" element={<TutorSettings />} />
          </Route>

          {/* ── Admin routes ── */}
          <Route element={<RoleRoute allowed={["admin"]} />}>
            <Route path="/admin/home" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/tutors" element={<AdminTutors />} />
            <Route path="/admin/lessons" element={<AdminLessons />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/orgs" element={<AdminOrgs />} />
          </Route>
        </Route>
      </Route>

      <Route path="/*" element={<Auth />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
