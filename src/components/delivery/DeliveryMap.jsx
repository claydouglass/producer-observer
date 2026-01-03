import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icons by health status
const createMarkerIcon = (color, size = 24) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const healthColors = {
  thriving: "#10b981",
  healthy: "#3b82f6",
  needs_attention: "#f59e0b",
  at_risk: "#ef4444",
  churned: "#6b7280",
};

// Oregon center coordinates
const OREGON_CENTER = [44.0, -120.5];
const OREGON_ZOOM = 7;

// Territory centers for zooming
const territoryCenters = {
  "Portland Metro": { center: [45.52, -122.68], zoom: 11 },
  "Willamette Valley": { center: [44.5, -123.1], zoom: 9 },
  "Southern Oregon": { center: [42.4, -122.9], zoom: 9 },
  "Central Oregon": { center: [44.1, -121.3], zoom: 9 },
  Coast: { center: [44.6, -124.0], zoom: 8 },
  "Eastern Oregon": { center: [44.5, -118.5], zoom: 7 },
};

export default function DeliveryMap({
  retailers,
  selectedRetailer,
  onRetailerSelect,
  territory,
  routeStops = [],
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize map
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: OREGON_CENTER,
      zoom: OREGON_ZOOM,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map view when territory changes
  useEffect(() => {
    if (!mapInstanceRef.current || !territory) return;

    const territoryConfig = territoryCenters[territory];
    if (territoryConfig) {
      mapInstanceRef.current.setView(
        territoryConfig.center,
        territoryConfig.zoom,
        {
          animate: true,
          duration: 0.5,
        },
      );
    }
  }, [territory]);

  // Update markers when retailers change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Check if retailer is in route
    const routeIds = new Set(routeStops.map((r) => r.id));

    // Add new markers
    retailers.forEach((retailer) => {
      const isInRoute = routeIds.has(retailer.id);
      const routeIndex = routeStops.findIndex((r) => r.id === retailer.id);
      const color = isInRoute
        ? "#16a34a"
        : healthColors[retailer.healthCategory] || healthColors.healthy;
      const isSelected = selectedRetailer?.id === retailer.id;
      const size = isSelected
        ? 32
        : isInRoute
          ? 28
          : retailer.isUrgent
            ? 26
            : 22;

      // For route stops, show numbered markers
      const icon = isInRoute
        ? L.divIcon({
            className: "custom-marker",
            html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: #16a34a;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">${routeIndex + 1}</div>
        `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            popupAnchor: [0, -size / 2],
          })
        : createMarkerIcon(color, size);

      const marker = L.marker(
        [retailer.coordinates.lat, retailer.coordinates.lng],
        { icon },
      );

      // Popup content
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui, sans-serif;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${retailer.name}</div>
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${retailer.address}</div>
          <div style="display: flex; gap: 12px; font-size: 12px;">
            <div>
              <span style="color: #6b7280;">Health:</span>
              <span style="font-weight: 600; color: ${color};">${retailer.healthScore}/100</span>
            </div>
            <div>
              <span style="color: #6b7280;">Stage:</span>
              <span style="font-weight: 500;">${retailer.journeyStage.replace("_", " ")}</span>
            </div>
          </div>
          ${
            retailer.daysSinceOrder !== null
              ? `
            <div style="font-size: 12px; margin-top: 4px;">
              <span style="color: #6b7280;">Last Order:</span>
              <span style="font-weight: 500;">${retailer.daysSinceOrder} days ago</span>
            </div>
          `
              : ""
          }
          ${
            retailer.isUrgent
              ? `
            <div style="margin-top: 8px; padding: 4px 8px; background: #fef2f2; color: #dc2626; font-size: 11px; font-weight: 600; border-radius: 4px;">
              URGENT: Overdue for order
            </div>
          `
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        onRetailerSelect(retailer);
      });

      marker.addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    });
  }, [retailers, selectedRetailer, onRetailerSelect, routeStops]);

  // Pan to selected retailer
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRetailer) return;

    mapInstanceRef.current.setView(
      [selectedRetailer.coordinates.lat, selectedRetailer.coordinates.lng],
      13,
      { animate: true, duration: 0.5 },
    );
  }, [selectedRetailer]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="text-xs font-medium text-gray-600 mb-2">
          Health Status
        </div>
        <div className="space-y-1">
          {Object.entries(healthColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600 capitalize">
                {status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Territory Label */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-[1000]">
        <div className="text-sm font-semibold text-gray-900">{territory}</div>
        <div className="text-xs text-gray-500">
          {retailers.length} retailers
        </div>
      </div>
    </div>
  );
}
