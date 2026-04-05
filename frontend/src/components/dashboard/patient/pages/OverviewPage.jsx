import { useState, useEffect } from "react";
import {
  appointmentAPI,
  medicalDocumentAPI,
} from "../../../../services/api.js";
import SummaryCards from "../components/SummaryCards";
import AppointmentsList from "../components/AppointmentsList";
import AppointmentDetailsModal from "../components/AppointmentDetailsModal";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

const OverviewPage = ({ onBookAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch appointments for overview
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch all appointment states using Promise.all
        const [pendingData, approvedData, declinedData, cancelledData] =
          await Promise.all([
            appointmentAPI.getPendingAppointments(),
            appointmentAPI.getApprovedAppointments(),
            appointmentAPI.getDeclinedAppointments(),
            appointmentAPI.getCancelledAppointments(),
          ]);

        // Combine all appointments
        const allAppointments = [
          ...(pendingData || []),
          ...(approvedData || []),
          ...(declinedData || []),
          ...(cancelledData || []),
        ];

        const now = new Date();

        // Transform all appointments
        const transformed = allAppointments.map((apt) => {
          const aptDate = new Date(apt.appointmentAtUtc);
          return {
            id: apt.appointmentId,
            day: aptDate.getDate().toString(),
            month: aptDate.toLocaleDateString("en-US", { month: "short" }),
            doctor: apt.doctorName || "Dr. Unknown",
            type: apt.reason || "General Checkup",
            reason: apt.reason,
            time: aptDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status:
              apt.status === "pending"
                ? "pending"
                : apt.status === "approved"
                  ? "confirmed"
                  : apt.status === "declined"
                    ? "cancelled"
                    : apt.status === "cancelled"
                      ? "cancelled"
                      : "completed",
            appointmentAtUtc: apt.appointmentAtUtc,
          };
        });

        // Separate upcoming appointments
        const upcoming = transformed
          .filter((apt) => {
            const aptDate = new Date(apt.appointmentAtUtc);
            return (
              aptDate > now &&
              (apt.status === "pending" || apt.status === "confirmed")
            );
          })
          .sort(
            (a, b) =>
              new Date(a.appointmentAtUtc) - new Date(b.appointmentAtUtc),
          )
          .slice(0, 3); // Get first 3 upcoming appointments

        // Separate completed appointments
        const completed = transformed
          .filter((apt) => {
            const aptDate = new Date(apt.appointmentAtUtc);
            return (
              aptDate <= now &&
              (apt.status === "pending" || apt.status === "confirmed")
            );
          })
          .sort(
            (a, b) =>
              new Date(b.appointmentAtUtc) - new Date(a.appointmentAtUtc),
          )
          .slice(0, 3); // Get last 3 completed appointments

        setAppointments(transformed);
        setUpcomingAppointments(upcoming);
        setCompletedAppointments(completed);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch documents count
  useEffect(() => {
    const fetchDocumentsCount = async () => {
      try {
        const documents = await medicalDocumentAPI.getMyDocuments();
        setDocumentsCount(documents?.length || 0);
      } catch (error) {
        console.error("Failed to fetch documents count:", error);
        setDocumentsCount(0);
      }
    };

    fetchDocumentsCount();
  }, []);

  const summaryData = [
    {
      icon: "📅",
      value: upcomingAppointments.length.toString(),
      label: "Upcoming Appointments",
      color: "blue",
    },
    {
      icon: "⏳",
      value: appointments
        .filter((a) => a.status === "pending")
        .length.toString(),
      label: "Pending Confirmation",
      color: "amber",
    },
    {
      icon: "✅",
      value: completedAppointments.length.toString(),
      label: "Approved appointments",
      color: "green",
    },
    {
      icon: "📄",
      value: documentsCount.toString(),
      label: "Medical Documents",
      color: "indigo",
    },
  ];

  return (
    <div className="space-y-6">
      <SummaryCards cards={summaryData} />

      {/* Upcoming Appointments */}
      <Card>
        <Card.Header>
          <Card.Title subtitle="Your next scheduled visits">
            Upcoming Appointments
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You don't have any upcoming appointments
              </p>
              <Button variant="primary" onClick={onBookAppointment}>
                📅 Book Your First Appointment
              </Button>
            </div>
          ) : (
            upcomingAppointments.map((appt) => (
              <AppointmentsList
                key={appt.id}
                appointments={[appt]}
                title=""
                subtitle=""
                showTitle={false}
                onViewDetails={(apt) => {
                  setSelectedAppointment(apt);
                  setIsDetailsModalOpen(true);
                }}
              />
            ))
          )}
        </Card.Content>
      </Card>

      {/* Completed Appointments */}
      <Card>
        <Card.Header>
          <Card.Title subtitle="Your appointment history">
            Appointments
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : completedAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No completed appointments yet</p>
            </div>
          ) : (
            completedAppointments.map((appt) => (
              <AppointmentsList
                key={appt.id}
                appointments={[appt]}
                title=""
                subtitle=""
                showTitle={false}
                onViewDetails={(apt) => {
                  setSelectedAppointment(apt);
                  setIsDetailsModalOpen(true);
                }}
              />
            ))
          )}
        </Card.Content>
      </Card>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default OverviewPage;
