import { useState, useEffect } from "react";
import { appointmentAPI } from "../../../../services/api.js";
import toast from "react-hot-toast";

// Helper function to safely parse and format dates
const formatAppointmentDate = (dateString) => {
  if (!dateString) return "Invalid Date";

  try {
    let date = new Date(dateString);

    // If date is invalid, try parsing as timestamp
    if (isNaN(date.getTime())) {
      // Try removing 'Z' and re-parsing if it exists
      const withoutZ = dateString.replace("Z", "");
      date = new Date(withoutZ);
    }

    // Final check
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

const CreatePrescriptionModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    appointmentId: "",
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch approved appointments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchApprovedAppointments();
    }
  }, [isOpen]);

  const fetchApprovedAppointments = async () => {
    setAppointmentsLoading(true);
    try {
      const data = await appointmentAPI.getApprovedAppointments();
      // Filter for approved appointments that don't have prescriptions yet
      const availableAppointments = (data || []).filter(
        (apt) => apt.status === "approved",
      );
      console.log(
        "✅ Available Appointments for Prescription:",
        availableAppointments,
      );
      setAppointments(availableAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.appointmentId.trim()) {
      newErrors.appointmentId = "Appointment is required";
    }
    if (!formData.medicationName.trim()) {
      newErrors.medicationName = "Medication name is required";
    }
    if (!formData.dosage.trim()) {
      newErrors.dosage = "Dosage is required";
    }
    if (!formData.frequency.trim()) {
      newErrors.frequency = "Frequency is required";
    }
    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        appointmentId: parseInt(formData.appointmentId),
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        ...(formData.instructions && { instructions: formData.instructions }),
      };

      console.log("📤 Creating Prescription:", payload);
      const response = await appointmentAPI.createPrescription(payload);
      console.log("✅ Prescription Created:", response);

      toast.success("Prescription issued successfully!");

      // Reset form
      setFormData({
        appointmentId: "",
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      });
      setErrors({});

      // Call success callback to refresh prescriptions list
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Failed to create prescription:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to create prescription";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (!isOpen) return null;

  const selectedAppointment = appointments.find(
    (apt) => apt.appointmentId === parseInt(formData.appointmentId),
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Issue Prescription</h3>
            <p className="text-sm text-blue-100">
              Create a new prescription for an approved appointment
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 rounded-full p-1 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          {/* Appointment Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Select Appointment <span className="text-red-500">*</span>
            </label>
            {appointmentsLoading ? (
              <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
            ) : (
              <select
                name="appointmentId"
                value={formData.appointmentId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.appointmentId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Choose an appointment...</option>
                {appointments.map((apt) => (
                  <option key={apt.appointmentId} value={apt.appointmentId}>
                    {apt.patientName} -{" "}
                    {formatAppointmentDate(apt.appointmentAtUtc)}
                  </option>
                ))}
              </select>
            )}
            {errors.appointmentId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.appointmentId}
              </p>
            )}
            {appointments.length === 0 && !appointmentsLoading && (
              <p className="text-sm text-amber-600 mt-2">
                ⚠️ No approved appointments available
              </p>
            )}
          </div>

          {/* Selected Appointment Details */}
          {selectedAppointment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Patient:</span>{" "}
                {selectedAppointment.patientName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Date & Time:</span>{" "}
                {formatAppointmentDate(selectedAppointment.appointmentAtUtc)}
              </p>
            </div>
          )}

          {/* Medication Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Medication Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="medicationName"
              placeholder="e.g., Aspirin, Amoxicillin"
              value={formData.medicationName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.medicationName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.medicationName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.medicationName}
              </p>
            )}
          </div>

          {/* Dosage and Frequency Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Dosage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dosage"
                placeholder="e.g., 500mg"
                value={formData.dosage}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.dosage
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.dosage && (
                <p className="text-sm text-red-500 mt-1">{errors.dosage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Frequency <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="frequency"
                placeholder="e.g., Twice daily"
                value={formData.frequency}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.frequency
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.frequency && (
                <p className="text-sm text-red-500 mt-1">{errors.frequency}</p>
              )}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="duration"
              placeholder="e.g., 7 days, 2 weeks"
              value={formData.duration}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.duration
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.duration && (
              <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Instructions <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              name="instructions"
              placeholder="e.g., Take with food, avoid dairy products..."
              value={formData.instructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading || appointmentsLoading || appointments.length === 0
              }
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>💊 Issue Prescription</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescriptionModal;
