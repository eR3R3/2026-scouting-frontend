"use client";

import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface Team {
  number: number;
  name?: string;
}

type Props = {
  selectedTeam: number | null;
  onTeamSelect: (n: number | null) => void;
  eventId?: string;
  eventType?: string;
};

export function TeamSelector({ selectedTeam, onTeamSelect, eventId, eventType }: Props) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (eventId) {
          // Get event teams
          const teamsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/teams`);
          const teamsData = await teamsResponse.json();
          
          const formattedTeams = teamsData.map((team: any) => ({
            number: team.teamNumber,
            name: team.team?.name || `Team ${team.teamNumber}`
          }));
          
          // If no teams found, provide a default option
          if (formattedTeams.length === 0) {
            setTeams([{ number: 0, name: 'No teams registered' }]);
          } else {
            setTeams(formattedTeams);
          }
        } else {
          // If no event selected, show all teams
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/findAll`);
          const data = await response.json();
          setTeams(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch teams:', error);
        // On error, provide a default option
        setTeams([{ number: 0, name: 'Unable to load teams' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [eventId]);

  const onSelectionChange = (key: React.Key | null) => {
    onTeamSelect(key ? Number(key) : null);
  };

  const onInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <Autocomplete
      className="min-w-[220px]"
      defaultItems={teams}
      label="选择队伍"
      placeholder="输入队号搜索…"
      allowsCustomValue={false}
      onInputChange={onInputChange}
      onSelectionChange={onSelectionChange}
      isLoading={loading}
    >
      {(team) => (
        <AutocompleteItem key={team.number.toString()} textValue={team.number.toString()}>
          <div className="flex flex-col">
              <span className="font-medium">Team {team.number}</span>
              {eventType === 'CUSTOM' && team.name && (
              <span className="text-sm text-gray-500">{team.name}</span>
              )}
          </div>
            </AutocompleteItem>
        )}
    </Autocomplete>
  );
}
