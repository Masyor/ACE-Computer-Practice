export type StageLevel = 'GEP 11A' | 'GEP 11B' | 'GEP 12';

export interface PlayerCustomization {
  name: string;
  stage: StageLevel;
  shirtColor: string;
  hairColor: string;
  spriteStyle: 'classic' | 'modern' | 'academic';
  hairStyle: 'short' | 'spiky' | 'ponytail' | 'bob' | 'curly';
}

export interface ResourceLink {
  title: string;
  url: string;
  description: string;
  badge?: string;
  iconType?: string;
}

export interface DoorRoom {
  id: number;
  name: string;
  subtitle: string;
  color: string;
  icon: string;
  xPositionPercent?: number; // Position along hallway percentage (0-100) or auto-calculated
  worldX?: number; // Absolute X pixel coordinate in extended corridor
  getLinks: (stage: StageLevel) => ResourceLink[];
}
