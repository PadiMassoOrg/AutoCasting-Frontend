// location-api.types.ts

// ===== Tipos genéricos del proveedor =====
// Mantenelos amplios para poder cambiar de proveedor sin romper tipos.
export type LocationAPIFeature = {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry?: { type: 'Point'; coordinates: [number, number] };
};

export type LocationAPIResponse = {
  type: 'FeatureCollection';
  features: LocationAPIFeature[];
};

export type LocationValue = {
  display: string; // "Palermo, Buenos Aires, Argentina"
  suburb: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  lat?: number;
  lon?: number;
  provider?: 'LOCATION_API';
  providerPlaceId?: string;
};

export type LocationInput = {
  suburb: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  formatted: string;
  lat?: number;
  lon?: number;
  provider?: 'LOCATION_API';
  providerPlaceId?: string;
};
