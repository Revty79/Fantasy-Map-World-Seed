export interface StarterSymbolDefinition {
  key: string;
  label: string;
  category: string;
}

export const STARTER_SYMBOLS: StarterSymbolDefinition[] = [
  { key: "mountain", label: "Mountain", category: "mountains" },
  { key: "hill", label: "Hill", category: "mountains" },
  { key: "forest", label: "Forest", category: "forests" },
  { key: "city", label: "City", category: "settlements" },
  { key: "village", label: "Village", category: "settlements" },
  { key: "castle", label: "Castle", category: "fortifications" },
  { key: "ruin", label: "Ruin", category: "ruins" },
  { key: "tower", label: "Tower", category: "fortifications" },
  { key: "port", label: "Port", category: "ports" },
  { key: "landmark", label: "Landmark", category: "landmarks" },
];
