export interface Layer extends LayerWithoutId {
  id: string;
}

export interface LayerWithoutId {
  name: string;
  visible: boolean;
  source: string;
}
