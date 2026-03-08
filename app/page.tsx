'use client'

import Image from "next/image";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import {ThemeSwitcher} from "@/components/ThemeSwitcher";
import { useState } from "react";
import { TeamRankings } from "@/app/dashboard/components/TeamRankings";
import { EventSelector } from "@/app/dashboard/components/EventSelector";
import { EventsAPI } from "@/lib/api/events";
import { ScoutEvent } from "@/lib/api/types";
export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<ScoutEvent | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedMatchType, setSelectedMatchType] = useState<string | null>(null);
  const [matchRecords, setMatchRecords] = useState([]);

  // Add effect to fetch match records when event/team changes
  useEffect(() => {
    if (!selectedEvent) {
      setMatchRecords([]);
      return;
    }

    if (!selectedTeam) {
      console.log("fetching all records for event");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/event/${selectedEvent.id}`)
        .then(res => res.json())
        .then(data => {
          console.log("all records for event", data);
          setMatchRecords(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error('Error fetching match records:', err));
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/event/${selectedEvent.id}?team=${selectedTeam}`)
        .then(res => res.json())
        .then(data => setMatchRecords(Array.isArray(data) ? data : []))
        .catch(err => console.error('Error fetching match records:', err));
    }
  }, [selectedEvent, selectedTeam]);
  return (
    <div className="flex flex-col justify-between p-6" suppressHydrationWarning>
      <div className="mb-6">
        <EventSelector 
          selectedEvent={selectedEvent}
          onEventSelect={setSelectedEvent}
          onRefreshData={() => {}} // No refresh needed for homepage
        />
      </div>
      <TeamRankings matchRecords={matchRecords} />
    </div>
  );
}
