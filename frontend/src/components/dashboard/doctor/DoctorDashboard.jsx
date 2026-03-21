import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import DoctorSidebar from "./components/DoctorSidebar";
import Button from "../ui/Button";
import DoctorProfileModal from "./components/DoctorProfileModal";
import OverviewPage from "./pages/OverviewPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import PatientsPage from "./pages/PatientsPage";
import SchedulePage from "./pages/SchedulePage";
import EarningsPage from "./pages/EarningsPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import CreatePrescriptionModal from "./components/CreatePrescriptionModal";

import { doctorAPI, authAPI } from "../../../services/api";
import { logout as logoutAction } from "../../../store/authSlice";
import { getInitials } from "../../../utils/helpers.js";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activePage, setActivePage] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreatePrescriptionModalOpen, setIsCreatePrescriptionModalOpen] =
    useState(false);
  const [prescriptionsRefreshKey, setPrescriptionsRefreshKey] = useState(0);

  // Fetch doctor profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await doctorAPI.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // TODO: Handle error appropriately (show toast, redirect to login, etc.)
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update after successful edit
  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(logoutAction());
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Prepare doctor data for sidebar
  const doctorData = profile
    ? {
        name: profile.fullName,
        initials: getInitials(profile.fullName),
        id: profile.id.toString().padStart(6, "0"),
        specialization: profile.specialization || "Specialist",
        experience: profile.yearsExperience || null,
      }
    : null;

  const pageMeta = {
    overview: {
      title: "Dashboard",
      sub: "Welcome back to your dashboard",
    },
    appointments: {
      title: "Appointments",
      sub: "Manage appointment requests and schedule",
    },
    patients: {
      title: "My Patients",
      sub: "View and manage your patient list",
    },
    schedule: {
      title: "Schedule",
      sub: "Set your availability and clinic hours",
    },
    earnings: {
      title: "Earnings",
      sub: "Track your income and transactions",
    },
    prescriptions: {
      title: "Prescriptions",
      sub: "Manage prescriptions issued to patients",
    },
  };

  const pageComponents = {
    overview: <OverviewPage />,
    appointments: <AppointmentsPage />,
    patients: <PatientsPage />,
    schedule: <SchedulePage />,
    earnings: <EarningsPage />,
    prescriptions: <PrescriptionsPage key={prescriptionsRefreshKey} />,
  };

  const meta = pageMeta[activePage];
  // Get first name for greeting
  const firstName = profile?.fullName?.split(" ")[0] || "Doctor";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DoctorSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        doctorData={doctorData}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-8 py-6 flex items-end justify-between">
            <div>
              <h1
                className={`text-3xl font-semibold text-[#1e293b]`}
                style={{ fontFamily: "Fraunces, serif" }}
              >
                {activePage === "overview" ? (
                  <>
                    Good morning,{" "}
                    <span className="text-[#2563eb]">{firstName}</span> 🌿
                  </>
                ) : (
                  meta.title
                )}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{meta.sub}</p>
            </div>
            <div className="flex gap-3">
              {activePage === "prescriptions" && (
                <Button
                  variant="default"
                  size="md"
                  onClick={() => setIsCreatePrescriptionModalOpen(true)}
                >
                  💊 Issue Prescription
                </Button>
              )}
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsProfileModalOpen(true)}
              >
                👤 Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8 max-w-7xl">{pageComponents[activePage]}</div>
      </main>

      {/* Profile Modal */}
      <DoctorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* Create Prescription Modal */}
      <CreatePrescriptionModal
        isOpen={isCreatePrescriptionModalOpen}
        onClose={() => setIsCreatePrescriptionModalOpen(false)}
        onSuccess={() => {
          setPrescriptionsRefreshKey((prev) => prev + 1);
          setIsCreatePrescriptionModalOpen(false);
        }}
      />
    </div>
  );
};

export default DoctorDashboard;
