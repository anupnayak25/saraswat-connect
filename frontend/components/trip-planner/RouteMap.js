"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length < 2) return;
    const bounds = L.latLngBounds(positions.map((pos) => L.latLng(pos[0], pos[1])));
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, positions]);

  return null;
}

export default function RouteMap({ routeGeometry, stops }) {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const linePositions = useMemo(() => {
    if (!routeGeometry?.coordinates?.length) return [];
    return routeGeometry.coordinates.map((coord) => [coord[1], coord[0]]);
  }, [routeGeometry]);

  const stopPositions = useMemo(() => {
    return (Array.isArray(stops) ? stops : [])
      .map((stop) => stop?.coordinates)
      .filter((coords) => coords && typeof coords.lat === "number" && typeof coords.lng === "number")
      .map((coords) => [coords.lat, coords.lng]);
  }, [stops]);

  const hasRoute = linePositions.length > 1;
  const center = hasRoute ? linePositions[0] : DEFAULT_CENTER;

  return (
    <MapContainer center={center} zoom={DEFAULT_ZOOM} className="h-full w-full rounded-lg relative z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hasRoute && <Polyline positions={linePositions} pathOptions={{ color: "#0f766e", weight: 5 }} />}
      {stopPositions.map((pos, index) => (
        <Marker key={`${pos[0]}-${pos[1]}-${index}`} position={pos} />
      ))}
      {hasRoute && <FitBounds positions={linePositions} />}
    </MapContainer>
  );
}
