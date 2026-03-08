'use client';

import { useEffect, useState } from 'react';
import { Card, Chip } from "@heroui/react";
import Image from 'next/image';

interface PitScoutingData {
  autoType: string;
  capabilities: {
    towerL1: boolean;
    towerL2: boolean;
    towerL3: boolean;
    fuelStorageAbility: number;
  };
  chassisType: string;
  photos: string[];
  comments?: string;
}

export function PitScoutingView({ teamNumber, eventId }) {
  const [data, setData] = useState<PitScoutingData | null>(null);

  useEffect(() => {
    if (!teamNumber) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/pit-scouting/${teamNumber}`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error('Error fetching pit scouting data:', err));
  }, [teamNumber]);

  if (!teamNumber || !data) return null;

  const capabilities: PitScoutingData['capabilities'] = data.capabilities || { towerL1: false, towerL2: false, towerL3: false, fuelStorageAbility: 0 };

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Team {teamNumber} Pit Scouting</h2>

      <div className="space-y-6">
        {/* Tower Capabilities */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Tower Capabilities</h3>
          <div className="flex flex-wrap gap-2">
            {capabilities.towerL1 && <Chip color="primary" size="sm">Tower L1 (30pts)</Chip>}
            {capabilities.towerL2 && <Chip color="primary" size="sm">Tower L2 (20pts)</Chip>}
            {capabilities.towerL3 && <Chip color="primary" size="sm">Tower L3 (10pts)</Chip>}
          </div>
        </section>

        {/* Robot Details */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-default-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2">Fuel Storage</h3>
            <p>{capabilities.fuelStorageAbility ?? 'N/A'}</p>
          </div>
          <div className="bg-default-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2">Chassis Type</h3>
            <p>{data.chassisType}</p>
          </div>
          <div className="bg-default-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2">Auto Type</h3>
            <p>{data.autoType}</p>
          </div>
        </section>

        {/* Photos */}
        {data.photos && data.photos.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-3">Robot Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
              {data.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square w-full">
                  <Image src={`data:image/jpeg;base64,${photo}`} alt={`Robot photo ${index + 1}`} fill className="object-cover rounded-lg" sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        {data.comments && (
          <section className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
            <div className="bg-default-50 p-4 rounded-lg whitespace-pre-wrap">{data.comments}</div>
          </section>
        )}
      </div>
    </Card>
  );
}
