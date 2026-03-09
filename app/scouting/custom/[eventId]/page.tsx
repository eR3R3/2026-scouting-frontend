'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Button, Input } from '@heroui/react';
import { EventsAPI } from '@/lib/api/events';
import { ScoutEvent } from '@/lib/api/types';
import { toast } from '@/hooks/use-toast';

export default function CustomScoutingPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<ScoutEvent | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state - similar to original step1 but for custom events
  const [matchType, setMatchType] = useState('');
  const [matchNumber, setMatchNumber] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [alliance, setAlliance] = useState('');

  useEffect(() => {
    if (!eventId) return;
    
    const loadEventData = async () => {
      try {
        const eventsData = await EventsAPI.getAllEvents().then(events => 
          events.find(e => e.id === eventId)
        );

        if (!eventsData || eventsData.sourceType !== 'CUSTOM') {
          toast({ title: 'Error', description: 'Invalid custom event' });
          router.push('/events');
          return;
        }

        setEvent(eventsData);
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
    if (!matchType || !matchNumber || !teamNumber || !alliance) {
      toast({ title: 'Error', description: 'Please fill all fields' });
      return;
    }

    // Validate and parse inputs
    const parsedMatchNumber = parseInt(matchNumber);
    const parsedTeamNumber = parseInt(teamNumber);

    if (isNaN(parsedMatchNumber) || parsedMatchNumber < 0) {
      toast({ title: 'Error', description: 'Invalid match number' });
      return;
    }

    if (isNaN(parsedTeamNumber) || parsedTeamNumber < 1) {
      toast({ title: 'Error', description: 'Invalid team number' });
      return;
    }

    // Store selection in sessionStorage for next steps
    const scoutingData = {
      eventId,
      event,
      matchType,
      matchNumber: parsedMatchNumber, // 确保是有效数字
      teamNumber: parsedTeamNumber,
      alliance,
    };

    console.log('Custom page saving data:', scoutingData); // 添加调试
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
          Custom Event Scouting
        </h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
        <p className="text-gray-600 mt-4">{event.name}</p>
      </div>

      <Card className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Section - Match Info */}
          <section className="space-y-6">
            <div>
              <label className="text-lg font-semibold mb-2 block">
                Match Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Qualification', 'Practice', 'Match', 'Final'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`
                      px-4 py-3 rounded-lg font-semibold transition-all
                      ${matchType === type
                        ? 'bg-primary text-white'
                        : 'border-2 border-gray-300 hover:border-primary'}
                    `}
                    onClick={() => setMatchType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Input
                type="number"
                label="Match Number"
                placeholder="Enter match number"
                value={matchNumber}
                onChange={(e) => setMatchNumber(e.target.value)}
                min={0}
              />
            </div>
          </section>

          {/* Right Section - Team & Alliance */}
          <section className="space-y-6">
            <div>
              <Input
                type="number"
                label="Team Number"
                placeholder="Enter team number"
                value={teamNumber}
                onChange={(e) => setTeamNumber(e.target.value)}
                min={1}
              />
            </div>

            <div>
              <label className="text-lg font-semibold mb-2 block">
                Alliance
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`
                    px-6 py-6 rounded-lg font-bold text-xl transition-all
                    ${alliance === 'Red'
                      ? 'bg-red-500 text-white'
                      : 'border-3 border-red-500 hover:bg-red-500 hover:text-white'}
                  `}
                  onClick={() => setAlliance('Red')}
                >
                  Red Alliance
                </button>
                <button
                  type="button"
                  className={`
                    px-6 py-6 rounded-lg font-bold text-xl transition-all
                    ${alliance === 'Blue'
                      ? 'bg-blue-500 text-white'
                      : 'border-3 border-blue-500 hover:bg-blue-500 hover:text-white'}
                  `}
                  onClick={() => setAlliance('Blue')}
                >
                  Blue Alliance
                </button>
              </div>
            </div>
          </section>
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
            isDisabled={!matchType || !matchNumber || !teamNumber || !alliance}
          >
            Next
          </Button>
        </div>
      </Card>
    </main>
  );
}
