'use client';

import { useState, useEffect } from 'react';
import { Card, Tab, Tabs } from "@heroui/react";
import { TeamSelector } from './components/TeamSelector';
import { TeamStats } from './components/TeamStats';
import { PitScoutingView } from './components/PitScoutingView';
import { MatchTypeFilter } from './components/MatchTypeFilter';
import { MatchRecordList } from './components/MatchRecordList';
import { TeamPerformanceChart } from './components/TeamPerformanceChart';
import { TeamComparisonChart } from './components/TeamComparisonChart';
import { EventSelector } from './components/EventSelector';
import { EventsAPI } from '@/lib/api/events';
import { ScoutEvent } from '@/lib/api/types';

export default function DashboardPage() {
  const [selectedEvent, setSelectedEvent] = useState<ScoutEvent | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedMatchType, setSelectedMatchType] = useState<string | null>(null);
  const [matchRecords, setMatchRecords] = useState([]);

  // Separate fetch function for reusability
  const fetchMatchRecords = async () => {
    if (!selectedEvent) {
      setMatchRecords([]);
      return;
    }

    // Clear records immediately to prevent showing old team data
    setMatchRecords([]);

    try {
      const data = await EventsAPI.getEventMatchRecords(
        selectedEvent.id,
        selectedTeam || undefined,
        selectedMatchType || undefined
      );
      console.log("Fetched records:", data);
      setMatchRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching match records:', err);
      setMatchRecords([]);
    }
  };

  // Effect for initial load and when filters change
  useEffect(() => {
    fetchMatchRecords();
  }, [selectedEvent, selectedTeam, selectedMatchType]);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col gap-6">
          {/* Event Selector */}
          <Card className="p-4 sm:p-6">
            <EventSelector 
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
              onRefreshData={fetchMatchRecords}
            />
          </Card>

          {/* Filters Section */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <TeamSelector 
                selectedTeam={selectedTeam} 
                onTeamSelect={setSelectedTeam} 
                eventId={selectedEvent?.id}
                eventType={selectedEvent?.sourceType}
              />
              <MatchTypeFilter 
                selectedType={selectedMatchType}
                onTypeSelect={setSelectedMatchType}
              />
            </div>
          </Card>

          {/* Content Tabs */}
          <Tabs>
            <Tab key="matches" title="Match Records">
              <div className="flex flex-col gap-6 mt-4">
                {/* Performance Charts */}
                {selectedTeam ? (
                  <>
                    <TeamStats teamNumber={selectedTeam} records={matchRecords} />
                    <Card className="p-6">
                      <TeamPerformanceChart records={matchRecords} />
                    </Card>
                  </>
                ) : (
                  <Card className="p-6">
                    <TeamComparisonChart records={matchRecords} />
                  </Card>
                )}
                
                {/* Match Records List */}
                <MatchRecordList 
                  eventId={selectedEvent?.id}
                  eventType={selectedEvent?.sourceType}
                  teamNumber={selectedTeam}
                  matchType={selectedMatchType}
                />
              </div>
            </Tab>
            <Tab key="pit" title="Pit Scouting">
              <PitScoutingView 
                eventId={selectedEvent?.id}
                teamNumber={selectedTeam}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    </main>
  );
}