// Event Types
export interface ScoutEvent {
  id: string;
  name: string;
  sourceType: 'CUSTOM' | 'TBA';
  tbaEventKey?: string;
  syncEnabled: boolean;
  syncIntervalMinutes: number;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventTeam {
  id: string;
  scoutEventId: string;
  teamNumber: number;
  source: 'MANUAL' | 'TBA';
  addedAt: string;
  team?: {
    number: number;
    name: string;
    lastUpdated: string;
  };
}

export interface EventMatch {
  id: string;
  scoutEventId: string;
  displayName: string;
  matchNumber?: number;
  source: 'MANUAL' | 'TBA';
  tbaMatchKey?: string;
  scheduledTime?: string;
  tbaMatch?: {
    matchKey: string;
    eventKey: string;
    matchNumber: number;
    matchType: string;
    redAlliance: number[];
    blueAlliance: number[];
    scoreRedFinal?: number;
    scoreBlueFinal?: number;
  };
}

// API Request/Response Types
export interface CreateCustomEventRequest {
  name: string;
}

export interface CreateTBAEventRequest {
  name: string;
  tbaEventKey: string;
}

export interface TBAEventInfo {
  key: string;
  name: string;
  event_code: string;
  city?: string;
  state_prov?: string;
  country?: string;
  start_date: string;
  end_date: string;
  year: number;
}
