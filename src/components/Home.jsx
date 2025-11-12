import { useRef, useEffect } from "react";
import Map from "./Map";

export default function Home() {
  const homeRef = useRef(null);

  // Function to update background based on map rotation
  const updateBackgroundPosition = (lng, lat, zoom, pitch, bearing) => {
    if (!homeRef.current) return;

    // For cover approach - calculate position based on longitude and bearing
    const normalizedLng = ((lng + 180) / 360) * 100;
    const bearingOffset = (bearing / 360) * 30; // Adjust for sensitivity

    homeRef.current.style.backgroundPosition = `${
      normalizedLng + bearingOffset
    }% 50%`;
  };

  return (
    <div className="home" ref={homeRef}>
      <Map onMapMove={updateBackgroundPosition} />
    </div>
  );
}
