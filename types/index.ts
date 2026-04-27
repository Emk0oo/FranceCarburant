export const FUEL_TYPES = [
  { id: "sp95", label: "SP95" },
  { id: "sp98", label: "SP98" },
  { id: "e10", label: "E10" },
  { id: "gazole", label: "Diesel" },
  { id: "e85", label: "E85" },
  { id: "gplc", label: "GPLc" },
] as const;

export type FuelType = (typeof FUEL_TYPES)[number]["id"];

export type Station = {
  id: string;
  name: string;
  address: string;
  city: string;
  cp: string;
  lat: number;
  lng: number;
  region?: string;
  departement?: string;
  prices: Record<FuelType, number | null>;
};
