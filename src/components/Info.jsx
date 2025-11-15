import { useState } from "react";

export default function Info({ onFilterChange }) {
  const [activeFilters, setActiveFilters] = useState({
    low: true,
    medium: true,
    high: true,
  });

  const handleFilterToggle = (severity) => {
    const newFilters = {
      ...activeFilters,
      [severity]: !activeFilters[severity],
    };

    setActiveFilters(newFilters);

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="info">
      <h3>Map Legend & Filters</h3>
      <div className="info__markers">
        <div
          className={`item ${activeFilters.low ? "active" : "inactive"}`}
          onClick={() => handleFilterToggle("low")}
          style={{ cursor: "pointer" }}
        >
          <div className="first_point"></div>
          <p>low severity</p>
        </div>
        <div
          className={`item ${activeFilters.medium ? "active" : "inactive"}`}
          onClick={() => handleFilterToggle("medium")}
          style={{ cursor: "pointer" }}
        >
          <div className="second_point"></div>
          <p>medium severity</p>
        </div>
        <div
          className={`item ${activeFilters.high ? "active" : "inactive"}`}
          onClick={() => handleFilterToggle("high")}
          style={{ cursor: "pointer" }}
        >
          <div className="third_point"></div>
          <p>high severity</p>
        </div>
      </div>
    </div>
  );
}
