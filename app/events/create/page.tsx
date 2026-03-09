'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input, Select, SelectItem, Tabs, Tab } from '@heroui/react';
import { toast } from '@/hooks/use-toast';
import { EventsAPI } from '@/lib/api/events';
import { TBAEventInfo } from '@/lib/api/types';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState<'tba' | 'custom'>('tba');
  
  // TBA Event Form
  const [tbaEventKey, setTbaEventKey] = useState('');
  const [tbaEventName, setTbaEventName] = useState('');
  const [tbaEventInfo, setTbaEventInfo] = useState<TBAEventInfo | null>(null);
  const [validatingTBA, setValidatingTBA] = useState(false);
  
  // Custom Event Form
  const [customEventName, setCustomEventName] = useState('');

  const validateTBAEvent = async () => {
    if (!tbaEventKey.trim()) {
      toast({ title: 'Error', description: 'Please enter an event code' });
      return;
    }

    setValidatingTBA(true);
    try {
      // For now, we'll use the TBA API directly to validate
      // In the future, we can add a backend endpoint for this
      const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${tbaEventKey}`, {
        headers: {
          'X-TBA-Auth-Key': process.env.NEXT_PUBLIC_TBA_API_KEY || '',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Event not found');
      }

      const eventInfo: TBAEventInfo = await response.json();
      setTbaEventInfo(eventInfo);
      setTbaEventName(eventInfo.name);
      toast({ title: 'Success', description: `Found: ${eventInfo.name}` });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Event not found or invalid API key' 
      });
      setTbaEventInfo(null);
    } finally {
      setValidatingTBA(false);
    }
  };

  const handleCreateTBAEvent = async () => {
    if (!tbaEventKey.trim() || !tbaEventName.trim()) {
      toast({ title: 'Error', description: 'Please fill all fields' });
      return;
    }

    setLoading(true);
    try {
      const event = await EventsAPI.createTBAEvent(tbaEventName, tbaEventKey);
      toast({ title: 'Success', description: `Created event: ${event.name}` });
      router.push(`/events/${event.id}`);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to create event' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomEvent = async () => {
    if (!customEventName.trim()) {
      toast({ title: 'Error', description: 'Please enter event name' });
      return;
    }

    setLoading(true);
    try {
      const event = await EventsAPI.createCustomEvent(customEventName);
      toast({ title: 'Success', description: `Created event: ${event.name}` });
      router.push(`/events/${event.id}`);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to create event' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-google-sans font-extrabold mb-3">
          Create New Event
        </h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>

      <Card className="p-8">
        <Tabs
          selectedKey={eventType}
          onSelectionChange={(key) => setEventType(key as 'tba' | 'custom')}
          className="w-full"
        >
          <Tab key="tba" title="TBA Event">
            <div className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-lg font-semibold mb-2 block">
                    Event Code
                  </label>
                  <div className="flex gap-4">
                    <Input
                      placeholder="e.g., 2026cnsh"
                      value={tbaEventKey}
                      onChange={(e) => setTbaEventKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onPress={validateTBAEvent}
                      isLoading={validatingTBA}
                      isDisabled={!tbaEventKey.trim()}
                    >
                      Validate
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter the TBA event code (format: year+event_code)
                  </p>
                </div>

                {tbaEventInfo && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      Event Found!
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {tbaEventInfo.name}</p>
                      <p><strong>Code:</strong> {tbaEventInfo.event_code}</p>
                      <p><strong>Date:</strong> {tbaEventInfo.start_date} - {tbaEventInfo.end_date}</p>
                      {tbaEventInfo.city && <p><strong>Location:</strong> {tbaEventInfo.city}, {tbaEventInfo.state_prov}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <Input
                    label="Event Name"
                    placeholder="Event name (auto-filled from TBA)"
                    value={tbaEventName}
                    onChange={(e) => setTbaEventName(e.target.value)}
                    isDisabled={!tbaEventInfo}
                  />
                </div>
              </div>

              <Button
                color="primary"
                size="lg"
                className="w-full"
                onPress={handleCreateTBAEvent}
                isLoading={loading}
                isDisabled={!tbaEventInfo || !tbaEventName.trim()}
              >
                Create TBA Event
              </Button>
            </div>
          </Tab>

          <Tab key="custom" title="Custom Event">
            <div className="space-y-6 mt-6">
              <div>
                <Input
                  label="Event Name"
                  placeholder="Enter custom event name"
                  value={customEventName}
                  onChange={(e) => setCustomEventName(e.target.value)}
                />
              </div>

              <Button
                color="primary"
                size="lg"
                className="w-full"
                onPress={handleCreateCustomEvent}
                isLoading={loading}
                isDisabled={!customEventName.trim()}
              >
                Create Custom Event
              </Button>
            </div>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
}
