"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { FUEL_TYPES, type FuelType, type Station } from "@/types";
import { formatPrice } from "@/lib/utils";
import { colorForPrice } from "./legend";

// Fix Leaflet's default icon paths (bundlers break the relative URLs).
type IconDefaultPrototype = L.Icon.Default & { _getIconUrl?: unknown };
delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FRANCE_CENTER: [number, number] = [46.8, 2.3];

export type Bounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

function buildIcon(color: string) {
  return L.divIcon({
    className: "fc-station-marker",
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,0.25)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });
}

type Props = {
  stations: Station[];
  selectedFuel: FuelType;
  thresholds: number[];
  onBoundsChange: (bounds: Bounds) => void;
};

export default function StationsMap({
  stations,
  selectedFuel,
  thresholds,
  onBoundsChange,
}: Props) {
  const iconCache = useMemo(() => {
    const cache = new Map<string, L.DivIcon>();
    return (color: string) => {
      let icon = cache.get(color);
      if (!icon) {
        icon = buildIcon(color);
        cache.set(color, icon);
      }
      return icon;
    };
  }, []);

  return (
    <MapContainer
      center={FRANCE_CENTER}
      zoom={6}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsTracker onChange={onBoundsChange} />
      <MarkerClusterGroup chunkedLoading maxClusterRadius={60}>
        {stations.map((s) => {
          const price = s.prices[selectedFuel];
          const color = colorForPrice(price, thresholds);
          return (
            <Marker
              key={s.id}
              position={[s.lat, s.lng]}
              icon={iconCache(color)}
            >
              <Popup>
                <StationPopup station={s} selectedFuel={selectedFuel} />
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

function BoundsTracker({ onChange }: { onChange: (b: Bounds) => void }) {
  const map = useMap();
  const emit = () => {
    const b = map.getBounds();
    onChange({
      north: b.getNorth(),
      south: b.getSouth(),
      east: b.getEast(),
      west: b.getWest(),
    });
  };
  useEffect(emit, []); // eslint-disable-line react-hooks/exhaustive-deps
  useMapEvents({ moveend: emit, zoomend: emit });
  return null;
}

function StationPopup({
  station,
  selectedFuel,
}: {
  station: Station;
  selectedFuel: FuelType;
}) {
  return (
    <div className="text-sm">
      <p className="font-semibold">{station.name}</p>
      {(station.cp || station.city) && (
        <p className="text-zinc-600">
          {station.cp} {station.city}
        </p>
      )}
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
        {FUEL_TYPES.map((f) => {
          const price = station.prices[f.id];
          const isSelected = f.id === selectedFuel;
          return (
            <li
              key={f.id}
              className={`flex justify-between gap-2 ${
                isSelected ? "font-semibold" : ""
              }`}
            >
              <span className="text-zinc-600">{f.label}</span>
              <span className="tabular-nums">
                {price != null ? formatPrice(price) : "—"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
