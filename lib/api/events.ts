import { ScoutEvent, EventTeam, EventMatch, CreateCustomEventRequest, CreateTBAEventRequest, TBAEventInfo } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class EventsAPI {
  // Event Management
  static async getAllEvents(): Promise<ScoutEvent[]> {
    const response = await fetch(`${API_URL}/event/all`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  }

  static async createCustomEvent(name: string): Promise<ScoutEvent> {
    const response = await fetch(`${API_URL}/event/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create custom event');
    return response.json();
  }

  static async createTBAEvent(name: string, tbaEventKey: string): Promise<ScoutEvent> {
    const response = await fetch(`${API_URL}/event/tba`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, tbaEventKey }),
    });
    if (!response.ok) throw new Error('Failed to create TBA event');
    return response.json();
  }

  // Event Teams & Matches
  static async getEventTeams(eventId: string): Promise<EventTeam[]> {
    const response = await fetch(`${API_URL}/event/${eventId}/teams`);
    if (!response.ok) throw new Error('Failed to fetch event teams');
    return response.json();
  }

  static async getEventMatches(eventId: string): Promise<EventMatch[]> {
    const response = await fetch(`${API_URL}/event/${eventId}/matches`);
    if (!response.ok) throw new Error('Failed to fetch event matches');
    return response.json();
  }

  static async addTeamToEvent(eventId: string, teamNumber: number): Promise<EventTeam> {
    const response = await fetch(`${API_URL}/event/${eventId}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamNumber }),
    });
    if (!response.ok) throw new Error('Failed to add team to event');
    return response.json();
  }

  static async addMatchToEvent(eventId: string, displayName: string, matchNumber?: number): Promise<EventMatch> {
    const response = await fetch(`${API_URL}/event/${eventId}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, matchNumber }),
    });
    if (!response.ok) throw new Error('Failed to add match to event');
    return response.json();
  }

  // Event Scouting Records
  static async getEventMatchRecords(eventId: string, teamNumber?: number, matchType?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (teamNumber) params.append('team', teamNumber.toString());
    if (matchType) params.append('type', matchType);
    
    const response = await fetch(`${API_URL}/scouting/event/${eventId}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch event match records');
    return response.json();
  }
}
