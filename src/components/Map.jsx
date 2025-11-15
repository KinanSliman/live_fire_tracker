import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchFireData } from "../app/fireSlice";
import MapStyleSelector from "./MapStyleSelector";
import { MAPTILER_STYLES } from "./mapTilerStyles.js";
import Info from "./Info.jsx";
import FireDetails from "./FireDetails.jsx";
import config from "./config.js";

const MAPTILLER_KEY = config.MAPTILER_KEY;

export default function Map({ onMapMove }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const dispatch = useDispatch();
  const { fireData, status } = useSelector((state) => state.fire);

  const [selectedStyle, setSelectedStyle] = useState("streets");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    low: true,
    medium: true,
    high: true,
  });
  const [selectedFire, setSelectedFire] = useState(null);

  const handleFireClick = useCallback((fire) => {
    setSelectedFire(fire);
  }, []);

  const handleCloseFireDetails = useCallback(() => {
    setSelectedFire(null);
  }, []);

  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  const handleFilterChange = useCallback(
    (filters) => {
      setActiveFilters(filters);

      if (mapLoaded && fireData?.length) {
        setTimeout(() => {
          addFirePoints(filters);
        }, 0);
      }
    },
    [mapLoaded, fireData]
  );

  const emitMapMovement = useCallback(() => {
    if (!map.current || !onMapMove) return;

    const center = map.current.getCenter();
    const zoom = map.current.getZoom();
    const pitch = map.current.getPitch();
    const bearing = map.current.getBearing();

    onMapMove(center.lng, center.lat, zoom, pitch, bearing);
  }, [onMapMove]);

  useEffect(() => {
    if (status === "idle" && fireData.length === 0) {
      dispatch(fetchFireData());
    }
  }, [dispatch, fireData.length, status]);

  useEffect(() => {
    if (map.current) return;

    const styleObj = MAPTILER_STYLES.find((s) => s.value === selectedStyle);
    if (!styleObj) return;

    initializeMap(styleObj);
  }, []);

  const initializeMap = (styleObj) => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleObj.url,
      center: [0, 0],
      zoom: 1.5,
      projection: styleObj.type === "3d" ? "globe" : "mercator",
      antialias: true,
    });

    const throttledEmitMovement = throttle(emitMapMovement, 50);

    map.current.on("load", () => {
      console.log("Map loaded successfully");
      if (styleObj.type === "3d") {
        apply3DEffects(styleObj);
      }
      setMapLoaded(true);

      emitMapMovement();
    });

    map.current.on("move", throttledEmitMovement);
    map.current.on("rotate", throttledEmitMovement);
    map.current.on("zoom", throttledEmitMovement);
    map.current.on("pitch", throttledEmitMovement);
  };

  const removeFireLayers = () => {
    if (!map.current) return;

    try {
      if (map.current.getLayer("fires-layer")) {
        map.current.removeLayer("fires-layer");
      }
      if (map.current.getSource("fires")) {
        map.current.removeSource("fires");
      }
    } catch (error) {
      console.log("Error removing fire layers:", error);
    }
  };

  const addFirePoints = (filters = activeFilters) => {
    if (!map.current || !fireData?.length) {
      console.log("Cannot add fire points - missing map or data");
      return;
    }

    try {
      removeFireLayers();

      const validFireData = fireData.filter(
        (f) =>
          f.longitude != null &&
          f.latitude != null &&
          !isNaN(Number(f.longitude)) &&
          !isNaN(Number(f.latitude)) &&
          filters[f.severity]
      );

      if (validFireData.length === 0) {
        console.warn("No valid coordinates in fire data after filtering");

        removeFireLayers();
        return;
      }

      console.log(`Adding ${validFireData.length} fire points after filtering`);

      const geojson = {
        type: "FeatureCollection",
        features: validFireData.map((f) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [Number(f.longitude), Number(f.latitude)],
          },
          properties: {
            id: f._id,
            severity: f.severity,
            date: f.acq_date,
            region: f.region,

            ...f,
          },
        })),
      };

      map.current.addSource("fires", { type: "geojson", data: geojson });

      map.current.addLayer({
        id: "fires-layer",
        type: "circle",
        source: "fires",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 3, 10, 7],
          "circle-color": [
            "match",
            ["get", "severity"],
            "low",
            "green",
            "medium",
            "orange",
            "high",
            "red",
            "gray",
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 0.6,
          "circle-opacity": 0.85,
        },
      });

      map.current.on("click", "fires-layer", (e) => {
        if (e.features && e.features.length > 0) {
          const fireFeature = e.features[0];
          const fireProperties = fireFeature.properties;

          const originalFire = fireData.find(
            (f) => f._id === fireProperties.id
          );

          if (originalFire) {
            handleFireClick(originalFire);
          } else {
            handleFireClick(fireProperties);
          }
        }
      });

      map.current.on("mouseenter", "fires-layer", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "fires-layer", () => {
        map.current.getCanvas().style.cursor = "";
      });

      console.log("Fire layer added successfully with filters");
    } catch (error) {
      console.error("Error adding fire points:", error);
    }
  };

  const handleStyleChange = (newStyle) => {
    if (!map.current) return;

    setSelectedStyle(newStyle);
    const styleObj = MAPTILER_STYLES.find((s) => s.value === newStyle);
    if (!styleObj) return;

    removeFireLayers();

    map.current.setStyle(styleObj.url);

    map.current.once("idle", () => {
      console.log("New style fully loaded and idle:", newStyle);

      if (fireData?.length) {
        console.log("Re-adding fire points after style change");
        addFirePoints(activeFilters);
      }
    });
  };

  useEffect(() => {
    if (mapLoaded && fireData?.length) {
      console.log(
        "Data loaded, waiting for map to be idle before adding points"
      );

      const addPointsWhenIdle = () => {
        console.log("Map is idle, adding fire points");
        addFirePoints(activeFilters);
      };

      map.current.off("idle", addPointsWhenIdle);

      if (map.current.isMoving() || map.current.isZooming()) {
        map.current.once("idle", addPointsWhenIdle);
      } else {
        addPointsWhenIdle();
      }
    }
  }, [fireData, mapLoaded, activeFilters]);

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.off("move", emitMapMovement);
        map.current.off("rotate", emitMapMovement);
        map.current.off("zoom", emitMapMovement);
        map.current.off("pitch", emitMapMovement);
      }
    };
  }, [emitMapMovement]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div className="title">
        <h2
          style={{
            color: "white",
            fontSize: "1rem",
            backgroundColor: "black",
            border: "none",
            borderRadius: "2px",
            padding: "5px 12px",
            position: "absolute",
            top: "2%",
            right: "5%",
          }}
        >
          Live Wildfire Tracker
        </h2>
      </div>
      <MapStyleSelector
        selectedStyle={selectedStyle}
        onChange={handleStyleChange}
      />
      <Info onFilterChange={handleFilterChange} />
      <FireDetails fire={selectedFire} onClose={handleCloseFireDetails} />
      <div
        className="map"
        ref={mapContainer}
        style={{ width: "100%", height: "100%" }}
      ></div>
    </div>
  );
}
