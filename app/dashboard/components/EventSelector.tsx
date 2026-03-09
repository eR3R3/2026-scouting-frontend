'use client';

import { useEffect, useState } from 'react';
import { Select, SelectItem, Button } from '@heroui/react';
import { RefreshCw } from 'lucide-react';
import { EventsAPI } from '@/lib/api/events';
import { ScoutEvent } from '@/lib/api/types';
import { toast } from '@/hooks/use-toast';

interface EventSelectorProps {
  selectedEvent: ScoutEvent | null;
  onEventSelect: (event: ScoutEvent | null) => void;
  onRefreshData?: () => void;
}

export function EventSelector({ selectedEvent, onEventSelect, onRefreshData }: EventSelectorProps) {
  const [events, setEvents] = useState<ScoutEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await EventsAPI.getAllEvents();
        setEvents(eventsData);
        
        // Auto-select first event if none selected
        if (!selectedEvent && eventsData.length > 0) {
          onEventSelect(eventsData[0]);
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load events' });
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [selectedEvent, onEventSelect]);

  const handleSyncTBA = async () => {
    if (!selectedEvent) {
      toast({ title: 'Error', description: 'Please select an event first' });
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tba/sync/${selectedEvent.tbaEventKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to sync event data');
      }

      toast({ 
        title: 'Success', 
        description: `Successfully synced ${selectedEvent.name}` 
      });
      
      // Reload events to get updated data
      const eventsData = await EventsAPI.getAllEvents();
      setEvents(eventsData);
      
      // Reload match records for selected event
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to sync event data' 
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Select
          placeholder="Select an event"
          selectedKeys={selectedEvent ? new Set([selectedEvent.id]) : new Set()}
          onSelectionChange={(keys) => {
            const eventId = Array.from(keys)[0] as string;
            const event = events.find(e => e.id === eventId);
            onEventSelect(event || null);
          }}
          label="Event"
          size="sm"
        >
          {events.map((event) => (
            <SelectItem key={event.id} textValue={event.name}>
              <div className="flex flex-col">
                <div className="font-semibold">{event.name}</div>
                <div className="text-sm text-gray-600">
                  {event.sourceType} {event.tbaEventKey && `• ${event.tbaEventKey}`}
                </div>
              </div>
            </SelectItem>
          ))}
        </Select>
      </div>
      
      <Button
        color="primary"
        variant="flat"
        size="sm"
        onPress={handleSyncTBA}
        isLoading={syncing}
        startContent={<RefreshCw className="w-4 h-4" />}
        isDisabled={!selectedEvent || selectedEvent.sourceType !== 'TBA'}
      >
        Sync TBA
      </Button>
    </div>
  );
}
