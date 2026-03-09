"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Camera, X } from 'lucide-react';
import { Input, Button, Card, Textarea, Select, SelectItem, Autocomplete, AutocompleteItem } from "@heroui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { getCookie } from 'cookies-next/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { EventsAPI } from '@/lib/api/events';
import { ScoutEvent } from '@/lib/api/types';

function PitScoutingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [events, setEvents] = useState<ScoutEvent[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    eventId: '',
    teamNumber: '',
    capabilities: {
      towerL1: false,
      towerL2: false,
      towerL3: false,
      fuelStorageAbility: 0,
    },
    chassisType: '',
    autoType: '',
    comments: '',
    photos: [] as string[],
  });

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await EventsAPI.getAllEvents();
        setEvents(eventsData);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load events' });
      } finally {
        setLoadingEvents(false);
      }
    };
    loadEvents();
  }, []);

  // Load teams when event is selected
  useEffect(() => {
    if (formData.eventId) {
      const loadTeams = async () => {
        try {
          setLoadingTeams(true);
          const selectedEvent = events.find(e => e.id === formData.eventId);
          const isCustomEvent = selectedEvent?.sourceType === 'CUSTOM';
          
          if (isCustomEvent) {
            // For custom events, load all teams from database
            const allTeamsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/findAll`);
            const allTeamsData = await allTeamsResponse.json();
            setTeams(allTeamsData.map((team: any) => ({
              id: team.id,
              teamNumber: team.number,
              name: team.name || `Team ${team.number}`
            })));
          } else {
            // For TBA events, load event-specific teams
            const teamsData = await EventsAPI.getEventTeams(formData.eventId);
            setTeams(teamsData.map(team => ({
              id: team.id,
              teamNumber: team.teamNumber,
              name: team.team?.name || `Team ${team.teamNumber}`
            })));
          }
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to load teams' });
          setTeams([]); // Clear teams on error
        } finally {
          setLoadingTeams(false);
        }
      };
      loadTeams();
    }
  }, [formData.eventId, events]);

  // Auto-fill from URL params
  useEffect(() => {
    const urlEventId = searchParams.get('eventId');
    const teamNumber = searchParams.get('teamNumber');
    if (urlEventId || teamNumber) {
      setFormData(prev => ({
        ...prev,
        eventId: urlEventId || '',
        teamNumber: teamNumber || ''
      }));
    }
  }, [searchParams]);

  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const maxWidth = 600;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth; }
        } else {
          if (height > maxHeight) { width = Math.round(width * maxHeight / height); height = maxHeight; }
        }

        canvas.width = Math.round(width * 0.8);
        canvas.height = Math.round(height * 0.8);
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.4));
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setPhotos(prev => [...prev, compressed]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getCookie("Authorization");
      if (!token) {
        toast({ variant: "destructive", title: "Error", description: "Not authenticated." });
        return;
      }

      const submitData = {
        teamNumber: parseInt(formData.teamNumber),
        eventId: formData.eventId,
        comments: formData.comments,
        capabilities: formData.capabilities,
        chassisType: formData.chassisType,
        autoType: formData.autoType,
        photos: photos.map(photo => photo.split(',')[1]?.substring(0, 100000) || ''),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pit-scouting/create`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit');
      }

      toast({ title: "Success!", description: "Form submitted successfully" });
      
      // Redirect based on form data
      if (formData.eventId) {
        setTimeout(() => router.push(`/events/${formData.eventId}`), 1500);
      } else {
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error instanceof Error ? error.message : "Failed to submit" });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, capabilities: { ...prev.capabilities, [field]: checked } }));
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl lg:max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-google-sans font-extrabold mb-3">Pit Scouting</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 lg:p-8 border-1 border-black dark:border-white rounded-2xl">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Team Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">Event & Team Information</h2>
                
                {/* Event Selector */}
                <Select
                  placeholder="Select an event"
                  selectedKeys={formData.eventId ? new Set([formData.eventId]) : new Set()}
                  onSelectionChange={(keys) => {
                    const eventId = Array.from(keys)[0] as string;
                    setFormData(prev => ({ ...prev, eventId, teamNumber: '' }));
                  }}
                  isLoading={loadingEvents}
                  label="Event"
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

                {/* Team Selector - Input for Custom Events, Dropdown for TBA Events */}
                {(() => {
                  const selectedEvent = events.find(e => e.id === formData.eventId);
                  const isCustomEvent = selectedEvent?.sourceType === 'CUSTOM';
                  
                  return isCustomEvent ? (
                    <Input
                      label="Team Number"
                      placeholder="Enter team number"
                      type="number"
                      variant="bordered"
                      className="max-w-xs"
                      value={formData.teamNumber}
                      onChange={(e) => handleInputChange('teamNumber', e.target.value)}
                      min={1}
                    />
                  ) : (
                    <Select
                      placeholder="Select a team"
                      selectedKeys={formData.teamNumber ? new Set([String(formData.teamNumber)]) : new Set()}
                      onSelectionChange={(keys) => {
                        const teamNumber = Array.from(keys)[0] as string;
                        setFormData(prev => ({ ...prev, teamNumber }));
                      }}
                      isLoading={loadingTeams}
                      isDisabled={!formData.eventId}
                      label="Team"
                    >
                      {teams.map((team) => (
                        <SelectItem key={String(team.teamNumber)} textValue={String(team.teamNumber)}>
                          <div className="flex flex-col">
                            <div className="font-semibold">Team {team.teamNumber}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  );
                })()}
              </div>

              {/* Tower Capabilities */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">Tower Capabilities</h2>
                <div className="grid gap-4">
                  {[
                    { id: 'towerL1', label: 'Tower L1 (30 pts)' },
                    { id: 'towerL2', label: 'Tower L2 (20 pts)' },
                    { id: 'towerL3', label: 'Tower L3 (10 pts)' },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox id={id} checked={formData.capabilities[id]} onCheckedChange={(checked) => handleCheckboxChange(id, checked as boolean)} />
                      <label htmlFor={id} className="text-sm font-medium leading-none">{label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fuel Storage */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">Fuel Storage Ability</h2>
                <Input
                  type="number"
                  label="Fuel Storage Capacity"
                  placeholder="How many fuel can it store?"
                  variant="bordered"
                  className="max-w-xs"
                  value={String(formData.capabilities.fuelStorageAbility || '')}
                  onChange={(e) => setFormData(prev => ({ ...prev, capabilities: { ...prev.capabilities, fuelStorageAbility: parseInt(e.target.value) || 0 } }))}
                />
              </div>

              {/* Chassis Type */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">Chassis Type</h2>
                <Input label="Chassis Type" placeholder="Enter chassis type" variant="bordered" className="max-w-xs" value={formData.chassisType} onChange={(e) => handleInputChange('chassisType', e.target.value)} />
              </div>

              {/* Auto Type */}
              <div className="space-y-4">
                <h2 className="text-xl font-google-sans font-semibold">Auto Type</h2>
                <Input label="Auto Type" placeholder="Enter auto type" variant="bordered" className="max-w-xs" value={formData.autoType} onChange={(e) => handleInputChange('autoType', e.target.value)} />
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h2 className="text-xl font-google-sans font-semibold">Robot Photos</h2>
              <div className="flex flex-wrap gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img src={photo} alt={`Robot photo ${index + 1}`} className="w-32 h-32 object-cover rounded-lg" />
                    <Button isIconOnly size="sm" color="danger" variant="solid" onPress={() => removePhoto(index)} className="absolute -top-2 -right-2 rounded-full"><X className="w-4 h-4" /></Button>
                  </div>
                ))}
                <div className="w-32 h-32">
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" multiple onChange={handleFileChange} className="hidden" />
                  <Button variant="bordered" onPress={() => fileInputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <Camera className="w-6 h-6" /><span className="text-sm">Take Photo</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
          <Textarea label="Additional Notes" onChange={(e) => handleInputChange('comments', e.target.value)} value={formData.comments} placeholder="Enter any additional observations" className="w-full min-h-[100px]" />
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="flat" type="reset" className="font-google-sans px-8">Reset</Button>
          <Button color="primary" type="submit" className="font-google-sans px-8">Submit</Button>
        </div>
      </form>
    </div>
  );
}

export default function PitScouting() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading...</div>}>
      <PitScoutingContent />
    </Suspense>
  );
}
