"use client";

import { useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { FUEL_TYPES, type FuelType, type Station } from "@/types";
import { formatPrice } from "@/lib/utils";
import { MapControls } from "./MapControls";
import { colorForPrice, computeQuintiles } from "./legend";

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

function buildIcon(color: string) {
  return L.divIcon({
    className: "fc-station-marker",
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,0.25)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });
}

export default function StationsMap({ stations }: { stations: Station[] }) {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("sp95");

  const { thresholds, hasNoPrice } = useMemo(() => {
    const prices: number[] = [];
    let missing = 0;
    for (const s of stations) {
      const p = s.prices[selectedFuel];
      if (p == null) missing++;
      else prices.push(p);
    }
    return {
      thresholds: computeQuintiles(prices),
      hasNoPrice: missing > 0,
    };
  }, [stations, selectedFuel]);

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
    <div className="relative h-full w-full">
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
      <MapControls
        selectedFuel={selectedFuel}
        onChange={setSelectedFuel}
        thresholds={thresholds}
        hasNoPriceStations={hasNoPrice}
      />
    </div>
  );
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
