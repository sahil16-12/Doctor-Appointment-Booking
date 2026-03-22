import { useState } from "react";
import { formatDate } from "../../../../utils/helpers.js";
import { patientAPI } from "../../../../services/api.js";
import Button from "../../ui/Button";
import toast from "react-hot-toast";
import LocationPicker from "./LocationPicker";

const ProfileModal = ({ isOpen, onClose, profile, onProfileUpdate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState(
    profile
      ? {
          bloodGroup: profile.bloodGroup || "",
          emergencyContact: profile.emergencyContact || "",
          allergies: profile.allergies || "",
          heightCm: profile.heightCm || "",
          weightKg: profile.weightKg || "",
          chronicConditions: profile.chronicConditions || "",
          city: profile.city || "",
          state: profile.state || "",
          latitude: profile.latitude || "",
          longitude: profile.longitude || "",
        }
      : {},
  );

  if (!isOpen || !profile) return null;

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      const updatePayload = {
        bloodGroup: editData.bloodGroup || null,
        emergencyContact: editData.emergencyContact || null,
        allergies: editData.allergies || null,
        heightCm: editData.heightCm ? parseInt(editData.heightCm) : null,
        weightKg: editData.weightKg ? parseInt(editData.weightKg) : null,
        chronicConditions: editData.chronicConditions || null,
        city: editData.city || null,
        state: editData.state || null,
        latitude: editData.latitude ? parseFloat(editData.latitude) : null,
        longitude: editData.longitude ? parseFloat(editData.longitude) : null,
      };

      const updatedProfile = await patientAPI.updateProfile(updatePayload);

      toast.success("Profile updated successfully!");
      onProfileUpdate(updatedProfile);
      setIsEditMode(false);
    } catch (error) {
      toast.error(
        error.message || "Failed to update profile. Please try again.",
      );
      console.error("Profile update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      bloodGroup: profile.bloodGroup || "",
      emergencyContact: profile.emergencyContact || "",
      allergies: profile.allergies || "",
      heightCm: profile.heightCm || "",
      weightKg: profile.weightKg || "",
      chronicConditions: profile.chronicConditions || "",
      city: profile.city || "",
      state: profile.state || "",
      latitude: profile.latitude || "",
      longitude: profile.longitude || "",
    });
    setIsEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2
            className="text-2xl font-semibold text-[#1e293b]"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            {isEditMode ? "Edit Profile" : "Profile Information"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label="Full Name"
                value={profile.fullName}
                editable={false}
              />
              <InfoItem
                label="Date of Birth"
                value={formatDate(profile.dob)}
                editable={false}
              />
              <InfoItem label="Email" value={profile.email} editable={false} />
              <InfoItem label="Phone" value={profile.phone} editable={false} />
              <EditableInfoItem
                label="Blood Group"
                value={editData.bloodGroup}
                isEditMode={isEditMode}
                onChange={(val) => handleEditChange("bloodGroup", val)}
                placeholder="e.g., A+, B-, O+"
                maxLength={10}
              />
              <EditableInfoItem
                label="Emergency Contact"
                value={editData.emergencyContact}
                isEditMode={isEditMode}
                onChange={(val) => handleEditChange("emergencyContact", val)}
                placeholder="e.g., +1 555-0123"
                maxLength={20}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableInfoItem
                label="Height (cm)"
                value={editData.heightCm}
                isEditMode={isEditMode}
                onChange={(val) => handleEditChange("heightCm", val)}
                type="number"
                placeholder="e.g., 170"
                min="0"
                max="300"
              />
              <EditableInfoItem
                label="Weight (kg)"
                value={editData.weightKg}
                isEditMode={isEditMode}
                onChange={(val) => handleEditChange("weightKg", val)}
                type="number"
                placeholder="e.g., 70"
                min="0"
                max="500"
              />
            </div>
            <div className="mt-4">
              <EditableInfoItem
                label="Allergies"
                value={editData.allergies}
                isEditMode={isEditMode}
                onChange={(val) => handleEditChange("allergies", val)}
                placeholder="e.g., Penicillin, Shellfish"
                maxLength={500}
                fullWidth
                textarea
              />
            </div>
            <div className="mt-4">
              <EditableInfoItem
                label="Chronic Conditions"
                value={editData.chronicConditions}
                isEditMode={isEditMode}
                onChange={(val) => handleEditChange("chronicConditions", val)}
                placeholder="e.g., Hypertension, Diabetes"
                maxLength={500}
                fullWidth
                textarea
              />
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Location Information
            </h3>
            {isEditMode ? (
              <LocationPicker
                city={editData.city || ""}
                state={editData.state || ""}
                latitude={editData.latitude || 22.5645}
                longitude={editData.longitude || 72.9289}
                onLocationChange={(location) => {
                  setEditData((prev) => ({
                    ...prev,
                    city: location.city,
                    state: location.state,
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }));
                }}
                isEditMode={true}
              />
            ) : (
              <LocationPicker
                city={profile.city || ""}
                state={profile.state || ""}
                latitude={profile.latitude}
                longitude={profile.longitude}
                isEditMode={false}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          {isEditMode ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" onClick={() => setIsEditMode(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 block mb-1">
        {label}
      </label>
      <p className="text-sm text-[#1e293b] font-medium">
        {value || "Not specified"}
      </p>
    </div>
  );
};

const EditableInfoItem = ({
  label,
  value,
  isEditMode,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  min,
  max,
  step,
  fullWidth = false,
  textarea = false,
}) => {
  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <label className="text-xs font-medium text-gray-500 block mb-1">
        {label}
      </label>
      {isEditMode ? (
        textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )
      ) : (
        <p className="text-sm text-[#1e293b] font-medium">
          {value
            ? type === "number"
              ? `${value} ${label.includes("cm") ? "cm" : label.includes("kg") ? "kg" : ""}`
              : value
            : "Not specified"}
        </p>
      )}
    </div>
  );
};

export default ProfileModal;
