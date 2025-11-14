import { useState, useEffect } from "react";
import { reverseGeocode } from "../utils/geocoding";

export default function FireDetails({ fire, onClose }) {
  const [locationInfo, setLocationInfo] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (fire && fire.latitude && fire.longitude) {
      fetchLocationInfo(fire.latitude, fire.longitude);
    } else {
      setLocationInfo(null);
    }
  }, [fire]);

  const fetchLocationInfo = async (lat, lng) => {
    setLoadingLocation(true);
    try {
      const location = await reverseGeocode(lat, lng);
      setLocationInfo(location);
    } catch (error) {
      console.error("Error fetching location info:", error);
      setLocationInfo(null);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Don't render anything if no fire is selected
  if (!fire) {
    return null;
  }

  // Format date and time
  const formatDateTime = (dateString, timeString) => {
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Format time (timeString is in format "102" meaning 01:02)
      const time = String(timeString).padStart(4, "0");
      const hours = time.substring(0, 2);
      const minutes = time.substring(2, 4);
      const formattedTime = `${hours}:${minutes}`;

      return `${formattedDate} at ${formattedTime}`;
    } catch (error) {
      return "Date unavailable";
    }
  };

  // Format region name as fallback
  const formatRegion = (region) => {
    if (!region) return "Unknown Location";
    return region
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Estimate fire size based on FRP (Fire Radiative Power)
  const estimateFireSize = (frp) => {
    if (!frp) return "Unknown";

    const sizeInAcres = Math.round(frp * 2.5);
    const sizeInKm2 = Math.round(sizeInAcres * 0.00404686 * 100) / 100;

    return `${sizeInKm2} km²`;
  };

  // Get display location name
  const getDisplayLocation = () => {
    if (locationInfo) {
      if (locationInfo.city && locationInfo.country) {
        return `${locationInfo.city}, ${locationInfo.country}`;
      } else if (locationInfo.country) {
        return locationInfo.country;
      } else if (locationInfo.state) {
        return locationInfo.state;
      }
    }
    return formatRegion(fire.region);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fireDetails">
      <div className="fireDetails__data">
        {/* Close Button */}
        <button className="closeBTN" onClick={handleClose}>
          ×
        </button>

        <div className="head">
          <div className="head__location">
            <h4>{getDisplayLocation()}</h4>
            {loadingLocation && (
              <p className="loading-text">Loading location details...</p>
            )}
            {locationInfo && locationInfo.displayName && (
              <p className="full-address">
                {locationInfo.displayName.split(",")[0]}
              </p>
            )}
          </div>
          <p className={`severity ${fire.severity}`}>
            {fire.severity} severity
          </p>
        </div>
        <div className="body">
          <div className="body__item">
            <p>Detected</p>
            <p>{formatDateTime(fire.acq_date, fire.acq_time)}</p>
          </div>

          <div className="body__item">
            <p>FRP</p>
            <p>{fire.frp ? `${fire.frp} MW` : "Unknown"}</p>
          </div>

          <div className="body__item">
            <p>Estimated Size</p>
            <p>{estimateFireSize(fire.frp)}</p>
          </div>

          <div className="body__item">
            <p>Coordinates</p>
            <p>
              {Number(fire.latitude).toFixed(4)}°,{" "}
              {Number(fire.longitude).toFixed(4)}°
            </p>
          </div>

          {locationInfo && locationInfo.state && (
            <div className="body__item">
              <p>Region</p>
              <p>{locationInfo.state}</p>
            </div>
          )}

          <div className="body__item">
            <p>Satellite</p>
            <p>{fire.instrument || "Unknown"}</p>
          </div>

          {fire.confidence && (
            <div className="body__item">
              <p>Confidence</p>
              <p>
                {fire.confidence === "n"
                  ? "Normal"
                  : fire.confidence.toUpperCase()}
              </p>
            </div>
          )}

          {fire.bright_ti4 && (
            <div className="body__item">
              <p>Brightness</p>
              <p>{fire.bright_ti4}K</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
