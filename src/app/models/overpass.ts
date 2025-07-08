export type OverpassResponse = {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OverpassElement[];
};

export type OverpassElement = {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>[];
};
