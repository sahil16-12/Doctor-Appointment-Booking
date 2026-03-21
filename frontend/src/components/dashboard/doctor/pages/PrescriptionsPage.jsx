import { useState, useEffect } from "react";
import { appointmentAPI } from "../../../../services/api.js";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import toast from "react-hot-toast";

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [sortBy, setSortBy] = useState("recent"); // recent or medication

  // Fetch prescriptions on mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await appointmentAPI.getPrescriptions();
        console.log("✅ Doctor Prescriptions Response:", data);
        setPrescriptions(data || []);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
        toast.error("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Sort prescriptions
  const sortedPrescriptions = [...prescriptions].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.issuedAtUtc) - new Date(a.issuedAtUtc);
    }
    return a.medicationName.localeCompare(b.medicationName);
  });

  const summaryData = {
    total: prescriptions.length,
    thisMonth: prescriptions.filter((p) => {
      const date = new Date(p.issuedAtUtc);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length,
    uniquePatients: new Set(prescriptions.map((p) => p.patientUserId)).size,
    uniqueMedications: new Set(prescriptions.map((p) => p.medicationName)).size,
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Card.Content className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {summaryData.total}
            </div>
            <div className="text-xs font-semibold text-gray-700">
              Total Prescriptions
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {summaryData.thisMonth}
            </div>
            <div className="text-xs font-semibold text-gray-700">
              This Month
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {summaryData.uniquePatients}
            </div>
            <div className="text-xs font-semibold text-gray-700">
              Unique Patients
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-1">
              {summaryData.uniqueMedications}
            </div>
            <div className="text-xs font-semibold text-gray-700">
              Unique Medications
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Prescriptions List */}
      <Card>
        <Card.Header>
          <Card.Title subtitle="Manage prescriptions issued to patients">
            Issued Prescriptions
          </Card.Title>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("recent")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                sortBy === "recent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📅 Recent
            </button>
            <button
              onClick={() => setSortBy("medication")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                sortBy === "medication"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              💊 Medication
            </button>
          </div>
        </Card.Header>
        <Card.Content>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💊</div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                No prescriptions issued yet
              </h4>
              <p className="text-xs text-gray-600">
                Prescriptions you issue will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPrescriptions.map((prescription) => (
                <div
                  key={prescription.prescriptionId}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                  onClick={() => setSelectedPrescription(prescription)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {prescription.medicationName}
                        </h4>
                        <Badge variant="default" className="text-xs">
                          {prescription.dosage}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>
                          👤 <span className="font-medium">Patient:</span>{" "}
                          {prescription.patientName || "Unknown"}
                        </p>
                        <p>
                          📋 <span className="font-medium">Frequency:</span>{" "}
                          {prescription.frequency}
                        </p>
                        <p>
                          ⏱️ <span className="font-medium">Duration:</span>{" "}
                          {prescription.duration}
                        </p>
                        <p>
                          📅 <span className="font-medium">Issued:</span>
                          {new Date(
                            prescription.issuedAtUtc,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="confirmed">Active</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPrescription(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedPrescription.medicationName}
                </h3>
                <p className="text-sm text-gray-600">
                  Prescribed to {selectedPrescription.patientName}
                </p>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Medication Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Medication Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase">
                      Dosage
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedPrescription.dosage}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase">
                      Frequency
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedPrescription.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase">
                      Duration
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedPrescription.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase">
                      Issued Date
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(
                        selectedPrescription.issuedAtUtc,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {selectedPrescription.instructions && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Instructions
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      {selectedPrescription.instructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Patient Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium uppercase mb-1">
                  Patient
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedPrescription.patientName}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsPage;
