'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Button, Select, SelectItem, Chip } from '@heroui/react';
import { EventsAPI } from '@/lib/api/events';
import { ScoutEvent, EventTeam } from '@/lib/api/types';
import { toast } from '@/hooks/use-toast';

export default function EventPitScoutingPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<ScoutEvent | null>(null);
  const [teams, setTeams] = useState<EventTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  useEffect(() => {
    if (!eventId) return;
    
    const loadEventData = async () => {
      try {
        const [eventsData, teamsData] = await Promise.all([
          EventsAPI.getAllEvents().then(events => events.find(e => e.id === eventId)),
          EventsAPI.getEventTeams(eventId),
        ]);

        if (!eventsData) {
          toast({ title: 'Error', description: 'Event not found' });
          router.push('/events');
          return;
        }

        setEvent(eventsData);
        setTeams(teamsData);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load event data' });
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId, router]);

  const handleNext = () => {
    if (!selectedTeam) {
      toast({ title: 'Error', description: 'Please select a team' });
      return;
    }

    const team = teams.find(t => t.id === selectedTeam);
    if (team) {
      router.push(`/pit-scouting/team/${team.teamNumber}?eventId=${eventId}`);
    }
  };

  const handleGoBack = () => {
    router.push('/events');
  };

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

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-google-sans font-extrabold mb-3">
          Pit Scouting
        </h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
        <p className="text-gray-600 mt-4">{event.name}</p>
      </div>

      <Card className="p-8">
        <div className="space-y-8">
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
                    <Chip size="sm" variant="flat" className="mt-2">
                      {team.source}
                    </Chip>
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Selection Summary */}
          {selectedTeam && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Selected Team
              </h3>
              <div className="text-sm">
                <p>
                  <strong>Team:</strong> {teams.find(t => t.id === selectedTeam)?.teamNumber}
                </p>
                {teams.find(t => t.id === selectedTeam)?.team?.name && (
                  <p>
                    <strong>Name:</strong> {teams.find(t => t.id === selectedTeam)?.team?.name}
                  </p>
                )}
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
            isDisabled={!selectedTeam}
          >
            Next
          </Button>
        </div>
      </Card>
    </main>
  );
}
