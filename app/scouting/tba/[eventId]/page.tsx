'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Button, Select, SelectItem } from '@heroui/react';
import { EventsAPI } from '@/lib/api/events';
import { ScoutEvent, EventTeam, EventMatch } from '@/lib/api/types';
import { toast } from '@/hooks/use-toast';

export default function TBAScoutingPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<ScoutEvent | null>(null);
  const [teams, setTeams] = useState<EventTeam[]>([]);
  const [matches, setMatches] = useState<EventMatch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  useEffect(() => {
    if (!eventId) return;
    
    const loadEventData = async () => {
      try {
        const [eventsData, teamsData, matchesData] = await Promise.all([
          EventsAPI.getAllEvents().then(events => events.find(e => e.id === eventId)),
          EventsAPI.getEventTeams(eventId),
          EventsAPI.getEventMatches(eventId),
        ]);

        if (!eventsData || eventsData.sourceType !== 'TBA') {
          toast({ title: 'Error', description: 'Invalid TBA event' });
          router.push('/events');
          return;
        }

        setEvent(eventsData);
        setTeams(teamsData);
        setMatches(matchesData);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load event data' });
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Event not found</div>
      </div>
    );
  }

  const handleNext = () => {
    if (!selectedMatch || !selectedTeam) {
      toast({ title: 'Error', description: 'Please select both match and team' });
      return;
    }

    // Store selection in sessionStorage for next steps
    const scoutingData = {
      eventId,
      event,
      selectedMatch: matches.find(m => m.id === selectedMatch),
      selectedTeam: teams.find(t => t.id === selectedTeam),
    };
    
    sessionStorage.setItem('scoutingData', JSON.stringify(scoutingData));
    router.push('/scouting/step3');
  };

  const handleGoBack = () => {
    router.push('/events');
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-google-sans font-extrabold mb-3">
          TBA Event Scouting
        </h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
        <p className="text-gray-600 mt-4">{event.name}</p>
      </div>

      <Card className="p-8">
        <div className="space-y-8">
          {/* Match Selection */}
          <div>
            <label className="text-xl font-semibold mb-4 block">
              Select Match
            </label>
            <Select
              placeholder="Choose a match"
              selectedKeys={selectedMatch ? new Set([selectedMatch]) : new Set()}
              onSelectionChange={(keys) => setSelectedMatch(Array.from(keys)[0] as string)}
              isRequired
            >
              {matches.map((match) => (
                <SelectItem key={match.id} textValue={match.displayName}>
                  <div className="flex flex-col">
                    <div className="font-semibold">{match.displayName}</div>
                    {match.tbaMatch && (
                      <div className="text-sm text-gray-600">
                        {match.tbaMatch.matchType} • 
                        R: {match.tbaMatch.redAlliance?.join(', ')} vs 
                        B: {match.tbaMatch.blueAlliance?.join(', ')}
                      </div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Team Selection */}
          <div>
            <label className="text-xl font-semibold mb-4 block">
              Select Team
            </label>
            <Select
              placeholder="Choose a team"
              selectedKeys={selectedTeam ? new Set([selectedTeam]) : new Set()}
              onSelectionChange={(keys) => setSelectedTeam(Array.from(keys)[0] as string)}
              isRequired
            >
              {teams.map((team) => (
                <SelectItem key={team.id} textValue={`Team ${team.teamNumber}`}>
                  <div className="flex flex-col">
                    <div className="font-semibold">Team {team.teamNumber}</div>
                    {team.team?.name && (
                      <div className="text-sm text-gray-600">{team.team.name}</div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Selection Summary */}
          {selectedMatch && selectedTeam && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Selection Summary
              </h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Match:</strong> {matches.find(m => m.id === selectedMatch)?.displayName}
                </p>
                <p>
                  <strong>Team:</strong> Team {teams.find(t => t.id === selectedTeam)?.teamNumber}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button
            variant="flat"
            size="lg"
            className="font-google-sans px-12 py-6 text-xl"
            onPress={handleGoBack}
          >
            Back
          </Button>
          <Button
            color="primary"
            size="lg"
            className="font-google-sans px-12 py-6 text-xl"
            onPress={handleNext}
            isDisabled={!selectedMatch || !selectedTeam}
          >
            Next
          </Button>
        </div>
      </Card>
    </main>
  );
}
