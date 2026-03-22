import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const LocationPicker = ({
  city,
  state,
  latitude,
  longitude,
  onLocationChange,
  isEditMode = true,
}) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const mapRef = useRef(null);

  // Ensure we have valid numbers for map
  const mapLat = latitude || 22.5645;
  const mapLon = longitude || 72.9289;

  // Handle geocoding for city and state
  const handleGeocode = async () => {
    if (!city.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    setIsGeocoding(true);
    try {
      const query = state ? `${city}, ${state}` : city;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          headers: {
            "User-Agent": "DoctorAppointmentBooking/1.0",
          },
        },
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();
      if (data.length === 0) {
        toast.error("Location not found. Please try another city/state.");
        return;
      }

      const { lat, lon, display_name } = data[0];
      const newLat = parseFloat(lat);
      const newLon = parseFloat(lon);

      // Notify parent of all location changes
      onLocationChange({
        city,
        state,
        latitude: newLat,
        longitude: newLon,
      });

      toast.success(`Location found: ${display_name}`);
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error(
        "Failed to find location. Please try again or select on map.",
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  // Handle clicking on the map
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;

        // Notify parent of coordinates
        onLocationChange({
          city,
          state,
          latitude: lat,
          longitude: lng,
        });

        // Try reverse geocoding to get city/state
        reverseGeocode(lat, lng);
      },
    });
    return null;
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            "User-Agent": "DoctorAppointmentBooking/1.0",
          },
        },
      );

      if (!response.ok) throw new Error("Reverse geocoding failed");

      const data = await response.json();
      const address = data.address || {};

      // Extract city and state from the address
      const extractedCity =
        address.city || address.town || address.village || "";
      const extractedState = address.state || "";

      if (extractedCity || extractedState) {
        onLocationChange({
          city: extractedCity || city,
          state: extractedState || state,
          latitude,
          longitude,
        });
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      // Silently fail - user can enter city/state manually
    }
  };

  if (!isEditMode) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 block">
          Location
        </label>
        <p className="text-sm text-[#1e293b] font-medium">
          {city && state ? `${city}, ${state}` : "Not specified"}
        </p>
        <p className="text-xs text-gray-400">
          {latitude && longitude
            ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="col-span-full space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Select Location</h3>

      {/* City and State Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) =>
              onLocationChange({
                city: e.target.value,
                state,
                latitude,
                longitude,
              })
            }
            onKeyPress={(e) => e.key === "Enter" && handleGeocode()}
            placeholder="e.g., Anand"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">
            State/Province
          </label>
          <input
            type="text"
            value={state}
            onChange={(e) =>
              onLocationChange({
                city,
                state: e.target.value,
                latitude,
                longitude,
              })
            }
            onKeyPress={(e) => e.key === "Enter" && handleGeocode()}
            placeholder="e.g., Gujarat"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Geocode Button */}
      <button
        onClick={handleGeocode}
        disabled={isGeocoding}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
      >
        {isGeocoding ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            Searching...
          </>
        ) : (
          "🔍 Search Location"
        )}
      </button>

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden border border-gray-300 h-96 z-0">
        <MapContainer
          center={[mapLat, mapLon]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {latitude && longitude && (
            <Marker position={[latitude, longitude]}>
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold mb-1">Selected Location</p>
                  <p>
                    {city && state ? `${city}, ${state}` : "Click to select"}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Lat: {latitude.toFixed(4)}
                  </p>
                  <p className="text-gray-600">Lon: {longitude.toFixed(4)}</p>
                </div>
              </Popup>
            </Marker>
          )}
          <MapClickHandler />
        </MapContainer>
      </div>

      {/* Coordinates Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs font-semibold text-blue-900 mb-2">
          Selected Coordinates:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
          <div>
            <span className="font-medium">Latitude:</span>
            <p className="font-mono">{mapLat.toFixed(6)}</p>
          </div>
          <div>
            <span className="font-medium">Longitude:</span>
            <p className="font-mono">{mapLon.toFixed(6)}</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-gray-500 italic">
        💡 Tip: Enter city and state, then click "Search Location" or click
        directly on the map to select your location.
      </p>
    </div>
  );
};

export default LocationPicker;
